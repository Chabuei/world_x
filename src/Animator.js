import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import StateHandler from './StateHandler.js'

export default function Animator(props)
{   
    const animations = props.animations
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const previousState = StateHandler((state) => { return state.previousState })
    const setState = StateHandler((state) => { return state.setState })
    const executeState = StateHandler((state) => { return state.executeState })
    
    useEffect(() => 
    {
        setState('Idle')
    }, [])
    
    useFrame((state, deltaTime) => 
    {
        const keys = getKeys()

        if(keys.KeyW) //このfsmはもっとキレイにしたい
        {
            if(keys.Space)
            {
                if(previousState == 'Walk' || previousState == 'Idle')
                {
                    setState('Run')
                    executeState(animations)    
                }
            }
            else
            {
                if(previousState == 'Idle' || previousState == 'Run')
                {
                    setState('Walk')
                    executeState(animations)
                }
            }
        }
        else
        {
            if(previousState == 'Walk' || previousState == 'Run' || previousState == null)
            {
                setState('Idle')
                executeState(animations)
            }
        }
    })

    return <>
    </>
}