import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as RAPIER from '@dimforge/rapier3d'

export const Physics = () => 
{
    const [ subscribeKeys, getKeys ] = useKeyboardControls()

    const velocity = new THREE.Vector3(0, 0, 0)
    const acceleration = new THREE.Vector3(1.0, 0.25, 5.0)
    const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)

    const gravity = { x: 0.0, y: -9.8, z: 0.0 }
    const world = new RAPIER.World(gravity)
    
    //forGround
    const groundRigidBody = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0)
    const groundCollider = RAPIER.ColliderDesc.cuboid(10, 1, 10)
    const groundRigidBody2 = world.createRigidBody(groundRigidBody)
    const groundCollider2 = world.createCollider(groundCollider, groundRigidBody2)
    //console.log(groundCollider2)

    //forSphere
    const sphereRigidBody = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, 0)
    const sphereCollider = RAPIER.ColliderDesc.ball(1)
    const sphereRigidBody2 = world.createRigidBody(sphereRigidBody)
    const sphereCollider2 = world.createCollider(sphereCollider, sphereRigidBody2)

    //forAvatar
    const avatarRigidBody = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 0, 0).setLinvel(0.0, 0.0, 0.0).setAngvel({x: 0, y :0, z: 0})
    const avatarCollider = RAPIER.ColliderDesc.cuboid(0.0, 1.0, 0.0)//.setFriction(1).setRestitution(0.2)
    const avatarRigidBody2 = world.createRigidBody(avatarRigidBody)
    const avatarCollider2 = world.createCollider(avatarCollider, avatarRigidBody2)
    
    let previousEuler = 0
    let currentEuler = 0    
    let flag = false
    let collisionPoint = new THREE.Vector3(0, 0, 0)

    let currentSin = 0
    let previousSin = 0
    let fc = null
    let fp = null
    let currentState = null
    let previousState = null
    let transition = null
    let changePoint = null

    let currentKey = null
    let previousKey = null
    let firstForward = null

    useFrame((state, deltaTime) => //行列計算はthree.jsを用いた(rapierではまだ乏しい)
    {                              
        //-----しばらく止めっているときは処理を停止する機構も欲しい-----
        const keys = getKeys()

        //control
        const newVelocity = velocity
        const newAcceleration = acceleration.clone()
        const newDecceleration = new THREE.Vector3(newVelocity.x * decceleration.x, newVelocity.y * decceleration.y, newVelocity.z * decceleration.z)
        newDecceleration.multiplyScalar(deltaTime)
        newDecceleration.z = Math.sign(newDecceleration.z) * Math.min(Math.abs(newDecceleration.z), Math.abs(newVelocity.z))
        newVelocity.add(newDecceleration)

        const quaternion = new THREE.Quaternion()
        const axis = new THREE.Vector3(0, 1, 0)
        const rotation = state.scene.children[3].quaternion.clone()

        if(keys.Space)
        {
            newAcceleration.multiplyScalar(3.5)
        }

        if(keys.KeyW)
        {            
            newVelocity.z -= newAcceleration.z * deltaTime
        }

        if(keys.KeyS)
        {
            newVelocity.z += newAcceleration.z * deltaTime
        }

        if(keys.KeyA)
        {
            flag = true
            quaternion.setFromAxisAngle(axis, Math.PI * deltaTime)
            rotation.multiply(quaternion)
        }

        if(keys.KeyD)
        {
            flag = false
            quaternion.setFromAxisAngle(axis, - Math.PI * deltaTime)
            rotation.multiply(quaternion)
        }

        state.scene.children[3].quaternion.copy(rotation)

        const forward = new THREE.Vector3(0, 0, 1)

        forward.applyQuaternion(state.scene.children[3].quaternion)
        forward.normalize()
        forward.multiplyScalar(newVelocity.z * deltaTime)

        const currentPosition = state.scene.children[3].position
        const currentRotation = state.scene.children[3].rotation
        const currentQuaternion = state.scene.children[3].quaternion
        const change = currentRotation._y - previousEuler
        
        flag ? currentEuler += Math.abs(change) : currentEuler -= Math.abs(change)        
        previousEuler = currentRotation._y
    
        //rayCasting
        const rayCaster = new RAPIER.Ray({ x: currentPosition.x, y: 5, z: currentPosition.z }, { x: currentPosition.x, y: -5, z: currentPosition.z })
        const rayCaster2 = new RAPIER.Ray({ x: currentPosition.x + Math.sin(currentEuler + Math.PI) * 0.1, y: 5, z: currentPosition.z + Math.cos(currentEuler + Math.PI) * 0.1 }, { x: currentPosition.x + Math.sin(currentEuler + Math.PI) * 0.1 , y: -5, z: currentPosition.z + Math.cos(currentEuler + Math.PI) * 0.1 })
        const hit = world.castRay(rayCaster, 10, true)
        const hit2 = world.castRay(rayCaster2, 10, true)
        
        //衝突が発生していない場合はworld.castRayの戻り値はnullになる
        //hitにはrayと衝突したオブジェクトの情報が格納されている
        if(hit2)
        {
            //console.log(hit2)
            //let point = rayCaster2.pointAt(hit2.toi)
            //console.log(point.z)
        }

        //rotationの変化量検出
        currentSin = currentRotation._y - previousSin //curretnSin>0の時aを押してる、currentSin<0の時dを押してる、currentSin=0の時何も押してない
        previousSin = currentRotation._y
    
        if(0 <= Math.abs(Math.sin(currentRotation.y)) && Math.abs(Math.sin(currentRotation.y)) <= Math.PI / 4)
        {
            //z向いてる
            if(currentState == 'x')//必要なのは変化ではなく変化が起きるタイミング
            {
                console.log('xからzへの変化を検出')
                transition = 'from X to Z'
                changePoint = 'x-z'
            }

            currentState = 'z'
            previousState = 'x'
        }
        else
        {
            //x向いてる
            if(currentState == 'z')
            {
                console.log('zからxへの変化を検出')
                transition = 'from Z to X'
                changePoint = 'z-x'
            }

            currentState = 'x'
            previousState = 'z'
        }

        //console.log(`sin:${Math.sin(currentRotation._y)} cos:${Math.cos(currentRotation._y)}`)
        //console.log(`qua_y:${Math.atan(currentQuaternion._y)}, qua_w:${Math.atan(currentQuaternion._w)}`)
        //console.log(currentState)

        let point = 0
        let point2 = 0
        if(hit && !hit2)
        {   
           
            /*if(!((7 / 4) * Math.PI <= currentRotation._y && currentRotation._y <= 2 * Math.PI))//90度まで検出できる
            {                    
                forward.x = 0           
            }*/

            /*if(0 <= Math.abs(Math.sin(currentRotation.y)) && Math.abs(Math.sin(currentRotation.y)) <= Math.PI / 4)
            {

            }*/

            forward.z = 0
            //console.log()
            /*const rayCaster3 = new RAPIER.Ray({ x: currentPosition.x + Math.sin(currentEuler + Math.PI) * 0.1, y: -0.5, z: currentPosition.z + Math.cos(currentEuler + Math.PI) * 0.1 }, { x: currentPosition.x, y: - 0.5, z: currentPosition.z })
            const hit3 = world.castRay(rayCaster3, 100, true)
            point = rayCaster3.pointAt(hit3.toi)
            //console.log(`x:${point.x} y:${point.y} z:${point.z}`)

            const rayCaster4 = new RAPIER.Ray({ x: currentPosition.x + Math.sin(currentEuler + Math.PI) * 0.1, y: -0.5, z: currentPosition.z + Math.cos(currentEuler + Math.PI) * 0.1 }, { x: currentPosition.x - 2, y: - 0.5, z: currentPosition.z })
            const hit4 = world.castRay(rayCaster4, 100, true)
            point2 = rayCaster4.pointAt(hit4.toi)
            //console.log(`x:${point2.x} y:${point2.y} z:${point2.z}`)
            console.log(`1:${point.z} 2:${point2.z}`)*/
        }

        const rayCaster4 = new RAPIER.Ray({ x: 0, y: -0.1, z: -11 }, { x: 0, y: -0.1, z: 0.1 })
        const hit4 = world.castRay(rayCaster4, 100, true)
        if(hit4)
        {
            let point = rayCaster4.pointAt(hit4.toi)
            //console.log(hit4)
            //console.log(`x:${point.x / 2} y:${point.y / 2} z:${point.z / 2}`)
            console.log(`x:${point.x} y:${point.y} z:${point.z}`) //あくまでrapierの座標であってthreeの座標ではない
        }
        const rayCaster5 = new RAPIER.Ray({ x: 0, y: -0.1, z: -11 }, { x: -1, y: -0.1, z: 0.1 })
        const hit5 = world.castRay(rayCaster5, 100, true)
        if(hit4)
        {
            let point = rayCaster5.pointAt(hit5.toi)
            //console.log(hit4)
            //console.log(`x:${point.x / 2} y:${point.y / 2} z:${point.z / 2}`)
            console.log(`x2:${point.x} y2:${point.y} z2:${point.z}`) //あくまでrapierの座標であってthreeの座標ではない
        }

        state.scene.children[7].position.x = currentPosition.x + Math.sin(currentEuler + Math.PI) * 0.1//ここでいゆ周期は変化量と同じ？
        state.scene.children[7].position.z = currentPosition.z + Math.cos(currentEuler + Math.PI) * 0.1

        /*state.scene.children[8].position.x = point.x + Math.sin(currentEuler + Math.PI) * 0.1//ここでいゆ周期は変化量と同じ？
        state.scene.children[8].position.z = point.z + Math.cos(currentEuler + Math.PI) * 0.1

        state.scene.children[9].position.x = point2.x + Math.sin(currentEuler + Math.PI) * 0.1//ここでいゆ周期は変化量と同じ？
        state.scene.children[9].position.z = point2.z + Math.cos(currentEuler + Math.PI) * 0.1*/
        
        state.scene.children[3].position.add(forward)

        world.step()
    })

    return <>
        <mesh position = { [0, -0.5, 0] }>
            <boxGeometry args = { [ 10, 1, 10 ] }/>
            <meshBasicMaterial color = { 'green' }/>
        </mesh>
        <mesh position = { [0, 3, 3] }>
            <sphereGeometry args = { [ 1 ] }/>
            <meshBasicMaterial color = { 'red' }/>
        </mesh>
        <mesh position = { [0, 0, 0] }>
            <boxGeometry args = { [ 0.05, 0.1, 0.05 ] }/>
            <meshBasicMaterial color = 'red'/>
        </mesh>
        <mesh position = { [0, 0, 0] }>
            <boxGeometry args = { [ 0.05, 0.1, 0.05 ] }/>
            <meshBasicMaterial color = 'blue'/>
        </mesh>
        <mesh position = { [0, 0, 0] }>
            <boxGeometry args = { [ 0.05, 0.1, 0.05 ] }/>
            <meshBasicMaterial color = 'purple'/>
        </mesh>
    </>
}