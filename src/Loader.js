import { useGLTF, useAnimations } from '@react-three/drei'
import Animator from './Animator.js'

export default function Loader(props)
{
    const { animations, scene } = useGLTF('./model/Soldier.glb')
    const newAnimations = useAnimations(animations, scene)
    
    return (
        <>
            <primitive castShadow receiveShadow object = { scene } position = {[0, 0, 0]}/>
            <hemisphereLight args = { ['#fbc367', '#4b3d60', 3] }/>
            <Animator animations = { newAnimations }/>
        </>
    )
}

