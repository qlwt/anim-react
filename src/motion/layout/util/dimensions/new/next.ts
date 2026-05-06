import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import type { Motion_Layout_Id_Dimensions, Motion_Layout_Id_Transforms } from "#src/motion/layout/type/id.js"

export type Motion__Layout_DimensionsNewNext_Params = {
    readonly element_rect: DOMRect
    readonly element_transforms: Motion_Layout_Id_Transforms
    readonly parent_context: Motion_Layout_CtxState | null
}

export const motion__layout_dimensions_new_next = function(def: Motion__Layout_DimensionsNewNext_Params): Motion_Layout_Id_Dimensions {
    const element_scale_width = Math.exp(def.element_transforms.width.output())
    const element_scale_height = Math.exp(def.element_transforms.height.output())

    if (def.parent_context) {
        const parent = def.parent_context.ref()
        const parent_snapshot = def.parent_context.snapshot.output()

        if (parent_snapshot && parent) {
            const parent_rect = parent.getBoundingClientRect()
            const parent_logscale = def.parent_context.accumulator.scale.output()
            const parent_logdescale = def.parent_context.statics.output()
            const parent_scale_width = Math.exp(parent_logscale.width)
            const parent_scale_height = Math.exp(parent_logscale.height)
            const parent_descale_width = Math.exp(parent_logdescale?.scale.width ?? 0)
            const parent_descale_height = Math.exp(parent_logdescale?.scale.height ?? 0)

            return {
                left: (
                    + parent_snapshot.dimensions.left
                    + (
                        + def.element_rect.x
                        - def.element_transforms.left.output() * parent_scale_width
                        - parent_rect.x
                    ) / parent_scale_width
                ),

                top: (
                    + parent_snapshot.dimensions.top
                    + (
                        + def.element_rect.y
                        - def.element_transforms.top.output() * parent_scale_height 
                        - parent_rect.y
                    ) / parent_scale_height
                ),

                width: def.element_rect.width / element_scale_width / parent_scale_width * parent_descale_width,
                height: def.element_rect.height / element_scale_height / parent_scale_height * parent_descale_height,
            }
        }
    }

    return {
        left: def.element_rect.x - def.element_transforms.left.output(),
        top: def.element_rect.y - def.element_transforms.top.output(),
        width: def.element_rect.width / element_scale_width,
        height: def.element_rect.height / element_scale_height,
    }
}
