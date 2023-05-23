import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import IdleState from './states/IdleState.js'
import WalkState from './states/WalkState.js'
import RunState from './states/RunState.js'

export default create(subscribeWithSelector((set, get) =>
{
    return {
        previousState: null,
        currentState: null,
        states: { Idle: IdleState, Walk: WalkState, Run: RunState },

        setState: (inputState) => 
        { //つまりcurrentStateを書き換える前に参照するとそれはpreviousStateと同義である
            const previousState = get().currentState

            set((state) => 
            {
                return { previousState: previousState, currentState: inputState }
            })
        },

        executeState: (animations) => 
        {
            const previousState = get().previousState

            get().states[get().currentState](animations, previousState)
        }
    }
}))