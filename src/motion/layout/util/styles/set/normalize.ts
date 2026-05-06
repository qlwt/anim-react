import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import type { Motion_Layout_DefNormalize } from "#src/motion/layout/type/def.js"

export type Motion__Layout_StylesSetNormalize_Params = {
    readonly element: HTMLElement
    readonly element_def: Motion_Layout_DefNormalize
    readonly parent_context: Motion_Layout_CtxState | null
}

export const motion__layout_styles_set_normalize = function(params: Motion__Layout_StylesSetNormalize_Params) {
    const parent_logscale = params.parent_context?.accumulator.scale.output() ?? { width: 0, height: 0 }
    const parent_logdescale = params.parent_context?.statics.output()?.scale ?? { width: 0, height: 0 }

    const translate_left = params.element_def.id.transforms.left.output()
    const translate_top = params.element_def.id.transforms.top.output()

    // reverse scale
    const parent_revscale = {
        width: Math.exp(-parent_logscale.width + parent_logdescale.width),
        height: Math.exp(-parent_logscale.height + parent_logdescale.height),
    }

    params.element.style.setProperty("transform", (
        `translateX(calc(${translate_left}px + ${-params.element_def.origin.x * (1 - parent_revscale.width) * 100}%))`
        + ` translateY(calc(${translate_top}px + ${-params.element_def.origin.y * (1 - parent_revscale.height) * 100}%))`
        + ` scaleX(${parent_revscale.width})`
        + ` scaleY(${parent_revscale.height})`
    ))
}
