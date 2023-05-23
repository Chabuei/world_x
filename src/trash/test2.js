const avatarRigidBody = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-1, 2, -1)
    const avatarRigidBody = RAPIER.RigidBodyDesc.dynamic().setTranslation(-1, 2, -1)
    const avatarCollider = RAPIER.ColliderDesc.cuboid(0.5, 1, 0.5)//.setFriction(1).setRestitution(0.2)
    const avatarRigidBody2 = world.createRigidBody(avatarRigidBody)
    const avatarCollider2 = world.createCollider(avatarCollider, avatarRigidBody2)

    //charactercontroller
    const characterController = world.createCharacterController(2.0)
    characterController.setUp({ x: 0.0, y: 1.0, z: 0.0 })
    characterController.setApplyImpulsesToDynamicBodies(true)

    let forPosition = { x: 0, y: 0, z: 0 }

    useFrame((state, deltaTime) => //行列計算はthree.jsを用いた(rapierではまだ乏しい)
    {                              //しばらく止めっているときは処理を停止する機構も欲しい
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

        if(keys.KeyS)
        {
            newVelocity.z += newAcceleration.z * deltaTime
        }

        if(keys.KeyA)
        {
            quaternion.setFromAxisAngle(axis, Math.PI * deltaTime)
            rotation.multiply(quaternion)
        }

        if(keys.KeyD)
        {
            quaternion.setFromAxisAngle(axis, - Math.PI * deltaTime)
            rotation.multiply(quaternion)
        }

        //回転はキャラだけでいいのでは？
        //avatarRigidBody2.setNextKinematicRotation({ w: rotation._w, x: rotation._x, y: rotation._y, z: rotation._z })
        //avatarRigidBody2.setRotation({ w: rotation._w, x: rotation._x, y: rotation._y, z: rotation._z })
        const avatarRotation = avatarRigidBody2.rotation()
        //state.scene.children[3].quaternion.copy(new THREE.Quaternion(new THREE.Vector3(avatarRotation.x, avatarRotation.y, avatarRotation.z), avatarRotation.w))
        /*state.scene.children[3].quaternion._x = avatarRotation.x
        state.scene.children[3].quaternion._y = avatarRotation.y
        state.scene.children[3].quaternion._z = avatarRotation.z
        state.scene.children[3].quaternion._w = avatarRotation.w*/
        state.scene.children[3].quaternion.copy(rotation)
        //console.log(state.scene.children[3].quaternion)
        console.log(avatarRotation)

        const forward = new THREE.Vector3(0, 0, 1)
        const sideways = new THREE.Vector3(1, 0, 0)

        forward.applyQuaternion(state.scene.children[3].quaternion)
        sideways.applyQuaternion(state.scene.children[3].quaternion)

        forward.normalize()
        sideways.normalize()

        forward.multiplyScalar(newVelocity.z * deltaTime)
        sideways.multiplyScalar(newVelocity.x * deltaTime)

        forPosition.x += forward.x
        forPosition.y += forward.y
        forPosition.z += forward.z
        
        characterController.computeColliderMovement(avatarCollider2, { x: forPosition.x, y: forPosition.y, z: forPosition.z })
        const movement = characterController.computedMovement()

        avatarRigidBody2.setNextKinematicTranslation({ x: movement.x, y: movement.y, z: movement.z })
        
        world.step()

        const avatarPosition = avatarRigidBody2.translation()
    
        state.scene.children[3].position.set(avatarPosition.x, avatarPosition.y, avatarPosition.z)

        //sphere
        const spherePosition = sphereRigidBody2.translation()
        state.scene.children[7].position.set(spherePosition.x, spherePosition.y, spherePosition.z)