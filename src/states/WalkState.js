export default function WalkState(animations, previousState)
{
    const currentAction = animations.actions.Walk

    if(previousState)
    {
        const previousAction = animations.actions[previousState]

        currentAction.enabled = true

        if(previousState === 'Run')
        {
            const ratio = currentAction._clip.duration / previousAction._clip.duration
            currentAction.time = previousAction.time * ratio
        }
        else
        {
            currentAction.time = 0.0
            currentAction.setEffectiveTimeScale(1.0)
            currentAction.setEffectiveWeight(1.0)
        }

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