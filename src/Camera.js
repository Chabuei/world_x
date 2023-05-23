import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function Camera()
{
    const currentPosition = new THREE.Vector3(0, 0, 0)
    const currentLookAt = new THREE.Vector3(0, 0, 0)
    
    useFrame((state, deltaTime) => 
    {
        const time = 1.0 - Math.pow(0.001, deltaTime)
        const idealOffset = new THREE.Vector3(-1.0, 2.0, -2.5)
        const idealLookAt = new THREE.Vector3(0, 0, 2)
        
        idealOffset.applyQuaternion(state.scene.children[3].quaternion)
        idealLookAt.applyQuaternion(state.scene.children[3].quaternion)
        
        idealOffset.add(state.scene.children[3].position)
        idealLookAt.add(state.scene.children[3].position)

        currentPosition.lerp(idealOffset, time)
        currentLookAt.lerp(idealLookAt, time)

        state.camera.position.copy(currentPosition)
        state.camera.lookAt(currentLookAt)
    })

    return <>
    </>
}