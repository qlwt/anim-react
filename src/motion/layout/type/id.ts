import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import * as sc from "@qyu/signal-core"

export type Motion_Layout_Id_Dimensions = {
    readonly top: number
    readonly left: number
    readonly width: number
    readonly height: number
}

export type Motion_Layout_Id_Transforms = {
    readonly left: sc.Signal<number>
    readonly top: sc.Signal<number>
    /** logarithmic, meant to be Math.exp()'d before usage */
    readonly width: sc.Signal<number>
    /** logarithmic, meant to be Math.exp()'d before usage */
    readonly height: sc.Signal<number>
}

export type Motion_Layout_Id_Snapshot = {
    readonly dimensions: Motion_Layout_Id_Dimensions
    readonly parent_context: Motion_Layout_CtxState | null
}

export type Motion_Layout_Id = {
    readonly transforms: Motion_Layout_Id_Transforms
    readonly snapshot: sc.Signal<Motion_Layout_Id_Snapshot | null>
}
