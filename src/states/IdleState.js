export default function IdleState(animations, previousState)
{
    const currentAction = animations.actions.Idle
    
    if(previousState)
    {
        const previousAction = animations.actions[previousState]
        
        currentAction.enabled = true

        currentAction.time = 0.0
        currentAction.setEffectiveTimeScale(1.0)
        currentAction.setEffectiveWeight(1.0)
        currentAction.crossFadeFrom(previousAction, 0.5, true)

        currentAction.play()
    }
    else
    {
        currentAction.play()
    }

    return <>
    </>
}