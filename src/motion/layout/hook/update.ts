import { CmpMoiton_LayoutCtx } from "#src/motion/layout/component/ctx.js"
import { motion__layout_scheduler } from "#src/motion/layout/scheduler.js"
import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import type { Motion_Layout_Def } from "#src/motion/layout/type/def.js"
import type { Motion_Layout_Id_Dimensions } from "#src/motion/layout/type/id.js"
import { motion__layout_dimensions_new_current } from "#src/motion/layout/util/dimensions/new/current.js"
import { motion__layout_dimensions_new_next } from "#src/motion/layout/util/dimensions/new/next.js"
import { motion__layout_styles_set_auto } from "#src/motion/layout/util/styles/set/auto.js"
import * as sc from "@qyu/signal-core"
import * as r from "react"

export type UseMotionLayoutUpdate_Params = {
    readonly element_def: Motion_Layout_Def
    readonly element_ref: () => HTMLElement | null
    readonly element_context: Motion_Layout_CtxState | null

    readonly controls_anim_restart: VoidFunction
}

export const useMotionLayoutUpdate = function(params: UseMotionLayoutUpdate_Params) {
    const parent_context = r.useContext(CmpMoiton_LayoutCtx)

    r.useLayoutEffect(() => {
        let interrupted = false

        const element_def = params.element_def
        const element = params.element_ref()

        if (element_def.kind === "none" || !element || !params.element_context) { return }

        const element_snapshot = element_def.id.snapshot.output()

        if (element_snapshot && (element_def.kind === "track" || element_def.kind === "normalize")) {
            // current position of an element based on spanshots
            const element_current = motion__layout_dimensions_new_current({
                element_snapshot: element_snapshot,
                element_context: params.element_context,
            })

            // will be executed after the parent's callbacks
            motion__layout_scheduler.queue_add(() => {
                if (interrupted) { return }

                // ensure sync between the styles and the state
                motion__layout_styles_set_auto({
                    parent_context,
                    element,
                    element_def: params.element_def,
                })

                const element_rect = element.getBoundingClientRect()

                const parent_logscale = parent_context?.accumulator.scale.output() ?? { width: 0, height: 0, }
                const parent_scale = { width: Math.exp(parent_logscale.width), height: Math.exp(parent_logscale.height), }
                const element_scale_width = Math.exp(element_def.id.transforms.width.output())
                const element_scale_height = Math.exp(element_def.id.transforms.height.output())

                // position current element would take if no transforms were applied to itself nor any of its parents
                const element_next = motion__layout_dimensions_new_next({
                    parent_context: parent_context,
                    element_rect: element_rect,
                    element_transforms: element_def.id.transforms,
                })

                // position current element would take if no transforms were applied to itself, but parent's transforms preserved
                const element_corrected = {
                    left: element_rect.x - element_def.id.transforms.left.output() * parent_scale.width,
                    top: element_rect.y - element_def.id.transforms.top.output() * parent_scale.height,
                    width: element_rect.width / element_scale_width,
                    height: element_rect.height / element_scale_height,
                } satisfies Motion_Layout_Id_Dimensions

                // update everything
                sc.batcher.batch_sync(() => {
                    element_def.id.snapshot.input({
                        parent_context: parent_context,
                        dimensions: element_next,
                    })

                    element_def.id.transforms.left.input((element_current.left - element_corrected.left) / parent_scale.width)
                    element_def.id.transforms.top.input((element_current.top - element_corrected.top) / parent_scale.height)

                    if (element_def.kind === "track") {
                        if (element_corrected.width === 0) {
                            element_def.id.transforms.width.input(0)
                        } else {
                            if (element_current.width === 0) {
                                element_def.id.transforms.width.input(Math.log(1 / element_corrected.width))
                            } else {
                                element_def.id.transforms.width.input(Math.log(element_current.width / element_corrected.width))
                            }
                        }

                        if (element_corrected.height === 0) {
                            element_def.id.transforms.height.input(0)
                        } else {
                            if (element_current.height === 0) {
                                element_def.id.transforms.height.input(Math.log(1 / element_corrected.height))
                            } else {
                                element_def.id.transforms.height.input(Math.log(element_current.height / element_corrected.height))
                            }
                        }
                    }
                })

                // restart animation from new state
                params.controls_anim_restart()
            })
        } else {
            // will be executed after parent's callback
            motion__layout_scheduler.queue_add(() => {
                if (interrupted) { return }

                // ensure sync between the styles and the state
                motion__layout_styles_set_auto({
                    element_def: element_def,
                    parent_context: parent_context,
                    element,
                })

                // no animation needed
                element_def.id.snapshot.input({
                    parent_context,

                    dimensions: motion__layout_dimensions_new_next({
                        parent_context,
                        element_transforms: element_def.id.transforms,
                        element_rect: element.getBoundingClientRect(),
                    }),
                })
            })
        }

        return () => {
            interrupted = true
        }
    })
}
