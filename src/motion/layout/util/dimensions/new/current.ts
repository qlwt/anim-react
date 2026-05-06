import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import type { Motion_Layout_Id_Dimensions, Motion_Layout_Id_Snapshot } from "#src/motion/layout/type/id.js"

export type Motion__Layout_DimensionsNewCurrent_Params = {
    readonly element_context: Motion_Layout_CtxState
    readonly element_snapshot: Motion_Layout_Id_Snapshot
}

export const motion__layout_dimensions_new_current = function(def: Motion__Layout_DimensionsNewCurrent_Params): Motion_Layout_Id_Dimensions {
    const context_logscale = def.element_context.accumulator.scale.output()
    const context_logdescale = def.element_context.statics.output()?.scale ?? null
    const context_position = def.element_context.accumulator.position.output()

    return {
        left: context_position.left,
        top: context_position.top,
        width: def.element_snapshot.dimensions.width * Math.exp(context_logscale.width) / Math.exp(context_logdescale?.width ?? 0),
        height: def.element_snapshot.dimensions.height * Math.exp(context_logscale.height) / Math.exp(context_logdescale?.height ?? 0),
    }
}
