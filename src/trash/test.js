
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        if(keys.KeyA)
        {
            pushedTime += deltaTime                
            torque.y = 0.1
        }

        if(keys.KeyD)
        {    
            pushedTime -= deltaTime            
            //torque.y = pushedTime * deltaTime * 10
            torque.y = -0.1
        }
        //console.log(pushedTime)

        if(keys.KeyW)
        {             
            impulse.x -= 1 * 10 * deltaTime * Math.sin(pushedTime * deltaTime * 10) 
            impulse.z -= 1 * 10 * deltaTime * Math.cos(pushedTime * deltaTime * 10) 
        }