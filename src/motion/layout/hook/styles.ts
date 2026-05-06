import { CmpMoiton_LayoutCtx } from "#src/motion/layout/component/ctx.js"
import type { Motion_Layout_Def } from "#src/motion/layout/type/def.js"
import { motion__layout_styles_set_normalize } from "#src/motion/layout/util/styles/set/normalize.js"
import { motion__layout_styles_set_track } from "#src/motion/layout/util/styles/set/track.js"
import * as sc from "@qyu/signal-core"
import * as r from "react"

export type UseMotionLayoutStyles_Params = {
    readonly element_def: Motion_Layout_Def
    readonly element_ref: () => HTMLElement | null
}

export const useMotionLayoutStyles = function(params: UseMotionLayoutStyles_Params) {
    const parent_context = r.useContext(CmpMoiton_LayoutCtx)

    r.useLayoutEffect((): VoidFunction | void => {
        const element = params.element_ref()
        const element_def = params.element_def

        if (element) switch (element_def.kind) {
            case "track": {
                return sc.signal_listen({
                    target: sc.osignal_new_merge([
                        element_def.id.transforms.left,
                        element_def.id.transforms.top,
                        element_def.id.transforms.width,
                        element_def.id.transforms.height,
                    ] as const),

                    listener: () => {
                        motion__layout_styles_set_track({
                            element,
                            element_def,
                        })
                    },

                    config: {
                        emit: true,
                    },
                })
            }
            case "normalize": {
                if (parent_context) {
                    return sc.signal_listen({
                        target: sc.osignal_new_merge([
                            parent_context.accumulator.scale,
                            parent_context.statics,
                            element_def.id.transforms.left,
                            element_def.id.transforms.top,
                        ] as const),

                        listener: () => {
                            motion__layout_styles_set_normalize({
                                element,
                                element_def,
                                parent_context,
                            })
                        },

                        config: {
                            emit: true,
                        },
                    })
                } else {
                    return sc.signal_listen({
                        target: sc.osignal_new_merge([
                            element_def.id.transforms.left,
                            element_def.id.transforms.top,
                        ] as const),

                        listener: () => {
                            motion__layout_styles_set_normalize({
                                element,
                                element_def,
                                parent_context: null,
                            })
                        },

                        config: {
                            emit: true,
                        },
                    })
                }

                break
            }
        }
    }, [params.element_def, params.element_ref, parent_context])
}
