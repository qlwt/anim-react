import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import type { Motion_Layout_Def } from "#src/motion/layout/type/def.js"
import { motion__layout_styles_set_normalize } from "#src/motion/layout/util/styles/set/normalize.js"
import { motion__layout_styles_set_track } from "#src/motion/layout/util/styles/set/track.js"

export type Motion__Layout_StyleSetAuto_Params = {
    readonly element: HTMLElement
    readonly element_def: Motion_Layout_Def
    readonly parent_context: Motion_Layout_CtxState | null
}

export const motion__layout_styles_set_auto = function(params: Motion__Layout_StyleSetAuto_Params) {
    switch (params.element_def.kind) {
        case "track": {
            if (params.element_def.kind === "track") {
                motion__layout_styles_set_track({
                    element_def: params.element_def,
                    element: params.element,
                })
            }

            break
        }
        case "normalize": {
            if (params.parent_context) {
                motion__layout_styles_set_normalize({
                    element: params.element,
                    element_def: params.element_def,
                    parent_context: params.parent_context,
                })
            }

            break
        }
    }
}
