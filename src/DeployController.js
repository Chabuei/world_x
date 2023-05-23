import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'

const DeployController = () => 
{
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 'red' }))
    const mousePosition = { x: 0, y: 0 }    
    let intersect

    window.addEventListener('mousemove', (event) => 
    {
        mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
        mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
    })

    useFrame((state, deltaTime) => 
    {
        const keys = getKeys()
        
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mousePosition, state.camera)
        intersect = raycaster.intersectObject(state.scene.children[5])

        if(intersect[0])
        {
            if(intersect[0].point)
            {                
                const intersectPoint = new THREE.Vector3().copy(intersect[0].point).floor().addScalar(0.5)                
                state.scene.children[8].position.set(intersectPoint.x, 0.01, intersectPoint.z)
            }            
        }

        if(keys.KeyK)
        {
            const boxMeshClone = boxMesh.clone()
            boxMeshClone.position.set(state.scene.children[8].position.x, 0, state.scene.children[8].position.z)
            state.scene.add(boxMeshClone)
        }
    })

    return (
        <>
        </>
    )
}

export default DeployController