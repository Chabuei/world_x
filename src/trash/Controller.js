import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
export default function Controller(props)
{
    const avatar = useGLTF('./model/Soldier.glb')
    let previousEuler = 0
    let nextEuler = 0

    const [ subscribeKeys, getKeys ] = useKeyboardControls()
		
    const velocity = new THREE.Vector3(0, 0, 0)
    const acceleration = new THREE.Vector3(1.0, 0.25, 5.0)
    const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)

    const addNextEuler = (input) => 
    {
        nextEuler += input
    }

    const subNextEuler = (input) => 
    {
        nextEuler -= input
    }

    useFrame(( state, delta ) => 
    {
        /*const keys = getKeys()

        const newVelocity = velocity
        const newDecceleration = new THREE.Vector3(newVelocity.x * decceleration.x, newVelocity.y * decceleration.y, newVelocity.z * decceleration.z)

        newDecceleration.multiplyScalar(delta)
        newDecceleration.z = Math.sign(newDecceleration.z) * Math.min(Math.abs(newDecceleration.z), Math.abs(newVelocity.z))
        newVelocity.add(newDecceleration)

        const q = new THREE.Quaternion()
        const a = new THREE.Vector3()
        const r = avatar.scene.quaternion.clone()
        const newAcceleration = acceleration.clone()

        if(keys.Space)
        {
            newAcceleration.multiplyScalar(3.5)
        }

        if(keys.KeyW)
        {
            //newVelocity.z += newAcceleration.z * delta soldierの向きがおかしいので調整した
            newVelocity.z -= newAcceleration.z * delta
        }

        if(keys.KeyS)
        {
            newVelocity.z -= newAcceleration.z * delta
        }

        if(keys.KeyA)
        {
            a.set(0, 1, 0)
            q.setFromAxisAngle(a, 4.0 * Math.PI * delta * acceleration.y)
            r.multiply(q)
        }

        if(keys.KeyD)
        {
            a.set(0, 1, 0)
            q.setFromAxisAngle(a, 4.0 * -Math.PI * delta * acceleration.y)
            r.multiply(q)
        }

        avatar.scene.quaternion.copy(r)

        const forward = new THREE.Vector3(0, 0, 1)
        const sideways = new THREE.Vector3(1, 0, 0)

        forward.applyQuaternion(avatar.scene.quaternion)
        sideways.applyQuaternion(avatar.scene.quaternion)

        forward.normalize()
        sideways.normalize()

        forward.multiplyScalar(newVelocity.z * delta)
        sideways.multiplyScalar(newVelocity.x * delta)

        avatar.scene.position.add(forward)
        avatar.scene.position.add(sideways)*/

        /*
        const euler = avatar.scene.rotation.clone()
        
        if(keys.KeyA)
        {
            addNextEuler(Math.abs(euler._y - previousEuler))
            previousEuler = euler._y
            
        }

        if(keys.KeyD) 
        {
            subNextEuler(Math.abs(euler._y - previousEuler))
            previousEuler = euler._y
        }

        const rayCaster = new THREE.Raycaster()
        const rayCaster2 = new THREE.Raycaster()
        const currentAvatarPosition = avatar.scene.getWorldPosition(new THREE.Vector3())
        const rayOrigin = new THREE.Vector3(currentAvatarPosition.x, currentAvatarPosition.y + 1, currentAvatarPosition.z)
        const rayTarget = new THREE.Vector3(currentAvatarPosition.x, currentAvatarPosition.y - 1, currentAvatarPosition.z)
        const rayOrigin2 = new THREE.Vector3(Math.cos((- 1 * nextEuler) - 1) + currentAvatarPosition.x, currentAvatarPosition.y + 1, Math.sin((-1 * nextEuler) - 1) + currentAvatarPosition.z)
        const rayTarget2 = new THREE.Vector3(Math.cos((- 1 * nextEuler) - 1) + currentAvatarPosition.x, currentAvatarPosition.y - 1, Math.sin((-1 * nextEuler) - 1) + currentAvatarPosition.z)

        rayOrigin.normalize()
        rayTarget.normalize()
        rayOrigin2.normalize()
        rayTarget2.normalize()

        rayCaster.set(rayOrigin, rayTarget)
        rayCaster2.set(rayOrigin2, rayTarget2)

        const intersect = rayCaster.intersectObject(state.scene.children[2]) //zustandでintersectの有無をやり取りしてはいけない。極限的なresponsetimeが必要な場合にzustandを用いるとzustandの遅延のせいでデータが離散化してしまいデータの挙動がバグる
        const intersect2 = rayCaster2.intersectObject(state.scene.children[2]) //intersectによるオーバヘッドも多少影響している

        console.log(`I1:${intersect.length} I2:${intersect2.length}`)
        
        const x = Math.abs(forward.x)
        const z = Math.abs(forward.z)

        if(intersect.length >= 1 && intersect2.length >= 1)
        {
            avatar.scene.position.add(forward)
            avatar.scene.position.add(sideways)
        }

        if(intersect.length >= 1 && intersect2.length < 1) //xかzのどちらかを消したい(両方消すと壁にくっついたままになる)
        {
            if(x > z)
            {
                forward.x = 0
                
                avatar.scene.position.add(forward)
                avatar.scene.position.add(sideways)
            }
            
            if(x == z)
            {
               forward.x = 0 
               forward.z = 0

                avatar.scene.position.add(forward)
                avatar.scene.position.add(sideways)
            }
            
            if(x < z)
            {
                forward.z = 0

                avatar.scene.position.add(forward)
                avatar.scene.position.add(sideways)
            }
        }

        if(intersect.length < 1 && intersect2.length >= 1) //xかzのどちらかを消したい(両方消すと壁にくっついたままになる)
        {
            avatar.scene.position.add(forward)
            avatar.scene.position.add(sideways)   
        }

        if(intersect.length < 1 && intersect2.length < 1) //xかzのどちらかを消したい(両方消すと壁にくっついたままになる)
        {
            avatar.scene.position.add(forward)
            avatar.scene.position.add(sideways)
        }*/
    })

    return <>
        {/*<primitive object={ avatar.scene } position={ [ 0, 0, 0 ] } />なぜかこれを消したらsoldier以外のモデルをインポートしてもカメラがおかしくならなくなった*/ }
    </>
}