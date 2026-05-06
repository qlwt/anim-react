import type { Motion_Layout_DefTrack } from "#src/motion/layout/type/def.js"

export type Motion__Layout_StylesSetTrack_Params = {
    readonly element: HTMLElement
    readonly element_def: Motion_Layout_DefTrack
}

export const motion__layout_styles_set_track = function(params: Motion__Layout_StylesSetTrack_Params) {
    const element_id = params.element_def.id

    const translate_left = element_id.transforms.left.output()
    const translate_top = element_id.transforms.top.output()
    const scale_width = Math.exp(element_id.transforms.width.output())
    const scale_height = Math.exp(element_id.transforms.height.output())

    params.element.style.setProperty("transform", (
        `translateX(calc(${translate_left}px + ${-params.element_def.origin.x * (1 - scale_width) * 100}%))`
        + ` translateY(calc(${translate_top}px + ${-params.element_def.origin.y * (1 - scale_height) * 100}%))`
        + ` scaleX(${scale_width})`
        + ` scaleY(${scale_height})`
    ))
}
