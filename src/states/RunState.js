export default function RunState(animations, previousState)
{
    const currentAction = animations.actions.Run
        
    if(previousState)
    {
        const previousAction = animations.actions[previousState]

        currentAction.enabled = true

        if(previousState === 'Walk')
        {
            const ratio = currentAction._clip.duration / previousAction._clip.duration
            currentAction.time = previousAction.time * ratio //stateのアニメーション遷移を滑らかにしている？
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