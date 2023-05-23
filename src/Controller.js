import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as RAPIER from '@dimforge/rapier3d'

export const Controller = () => 
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
    
    let previousEuler = 0
    let currentEuler = 0    
    let flag = false
    let signX = null
    let signZ = null

    useFrame((state, deltaTime) => //行列計算はthree.jsを用いた(rapierではまだ乏しい)
    {                              
        //-----しばらく止まっているときは処理を停止する機構も欲しい-----
        const keys = getKeys()
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

        ///rotation.yの変化量を足し続ける(sin、cosの制御に必要)
        const change = currentRotation._y - previousEuler
        flag ? currentEuler += Math.abs(change) : currentEuler -= Math.abs(change)        
        previousEuler = currentRotation._y

        //後ろ歩きをもし実装するならdetectorは3つ必要になる
        //曲面でもすり抜けはしないが移動がギザギザになる(lerpを使えば解消できそう)
        if(Math.sin(currentEuler + (Math.PI / 2)) > 0)
        {
            if(Math.cos(currentEuler + (Math.PI / 2)) > 0)
            {
                //第1象限
                signX = 1
                signZ = -1
            }
            else
            {
                //第2象限
                signX = -1
                signZ = -1
            }
        }
        else
        {
            if(Math.cos(currentEuler + (Math.PI / 2)) > 0)
            {
                //第4象限   
                signX = 1
                signZ = 1
            }
            else
            {
                //第3象限
                signX = -1
                signZ = 1
            }
        }

        const rayCaster = new RAPIER.Ray({ x: currentPosition.x, y: 5, z: currentPosition.z }, { x: currentPosition.x, y: -5, z: currentPosition.z })
        const rayCasterX = new RAPIER.Ray({ x: currentPosition.x + 0.1 * signX, y: 5, z: currentPosition.z }, { x: currentPosition.x + 0.1 * signX, y: -5, z: currentPosition.z })
        const rayCasterZ = new RAPIER.Ray({ x: currentPosition.x, y: 5, z: currentPosition.z + 0.1 * signZ }, { x: currentPosition.x, y: -5, z: currentPosition.z + 0.1 * signZ })
        const hit = world.castRay(rayCaster, 10, true)
        const hitX = world.castRay(rayCasterX, 10, true)
        const hitZ = world.castRay(rayCasterZ, 10, true)

        if(!hitX)
        {
            forward.x = 0
        }
        
        if(!hitZ)
        {
            forward.z = 0
        }

        if(!hitX && !hitZ)
        {
            forward.x = 0
            forward.z = 0
        }

        state.scene.children[6].position.x = currentPosition.x 
        state.scene.children[6].position.z = currentPosition.z + 0.1 * signZ
        
        state.scene.children[7].position.x = currentPosition.x + 0.1 * signX
        state.scene.children[7].position.z = currentPosition.z
        
        state.scene.children[3].position.add(forward)

        world.step()
    })

    return <>
        <mesh position = { [0, -0.5, 0] }>
            <boxGeometry args = { [ 10, 1, 10 ] }/>
            <meshBasicMaterial color = { 'green' }/>
        </mesh>
        <mesh position = { [0, 0, 0] }>
            <boxGeometry args = { [ 0.05, 0.1, 0.05 ] }/>
            <meshBasicMaterial color = 'red'/>
        </mesh>
        <mesh position = { [0, 0, 0] }>
            <boxGeometry args = { [ 0.05, 0.1, 0.05 ] }/>
            <meshBasicMaterial color = 'blue'/>
        </mesh>
        <mesh position = { [ 0.5, 0.01, 0.5 ] } rotation = { [ -Math.PI / 2, 0, 0 ] }>
            <planeGeometry args = { [ 1, 1 ] }/>
            <meshBasicMaterial color = 'purple'/>
        </mesh>
    </>
}