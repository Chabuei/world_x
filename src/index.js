import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, BakeShadows } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Loader from './Loader.js'
import Camera from './Camera'
import { Controller } from './Controller.js'
import DeployController from './DeployController.js'
import './style.css'

const container = document.querySelector('.root')//javascript側でhtmlを生成
const root = createRoot(container)

root.render(
    <>        
        <KeyboardControls  map =
        { [
        { name: 'KeyW', keys: [ 'KeyW' ] },
        { name: 'KeyA', keys: [ 'KeyA' ] },
        { name: 'KeyS', keys: [ 'KeyS' ] },
        { name: 'KeyD', keys: [ 'KeyD' ] },
        { name: 'KeyK', keys: [ 'KeyK' ] },
        { name: 'KeyL', keys: [ 'KeyL' ] },
        { name: 'Space', keys: [ 'Space' ] },
        ] }>
            <Canvas shadows camera={ { fov: 45, near: 0.1, far: 300 } } >                
                <Perf />
                <axesHelper args = { [20, 20, 20] }/>
                <gridHelper  args = { [20, 20] }/>
                <BakeShadows />
                <Loader />
                <Camera />
                <Controller />
                <DeployController />                            
            </Canvas>            
        </KeyboardControls>
    </>
)