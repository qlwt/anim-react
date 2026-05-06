import type { Motion_Layout_Id_Snapshot } from "#src/motion/layout/type/id.js"
import * as sc from "@qyu/signal-core"

export type Motion_Layout_CtxState_StaticsScale = {
    readonly width: number
    readonly height: number
}

export type Motion_Layout_CtxState_Statics = {
    readonly scale: Motion_Layout_CtxState_StaticsScale
}

export type Motion_Layout_CtxState_AccumulatorPosition = {
    readonly left: number
    readonly top: number
}

export type Motion_Layout_CtxState_AccumulatorScale = {
    readonly width: number
    readonly height: number
}

export type Motion_Layout_CtxState_Accumulator = {
    readonly scale: sc.OSignal<Motion_Layout_CtxState_AccumulatorScale>
    readonly position: sc.OSignal<Motion_Layout_CtxState_AccumulatorPosition>
}

export type Motion_Layout_CtxState = {
    readonly ref: () => HTMLElement | null
    readonly accumulator: Motion_Layout_CtxState_Accumulator
    readonly snapshot: sc.OSignal<Motion_Layout_Id_Snapshot | null>
    readonly statics: sc.OSignal<Motion_Layout_CtxState_Statics | null>
} 
