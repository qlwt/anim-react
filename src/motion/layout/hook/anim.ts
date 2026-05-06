import type { Motion_Layout_Def, Motion_Layout_DefNormalize, Motion_Layout_DefTrack } from "#src/motion/layout/type/def.js"
import * as ac from "@qyu/anim-core"
import * as sc from "@qyu/signal-core"
import * as r from "react"

type AnimatedLayoutDef = (
    | Motion_Layout_DefTrack
    | Motion_Layout_DefNormalize
)

type AnimationPoint = ac.Anim_InferPoint<ReturnType<typeof anim_new>>

const deps_new = function(element_def: Motion_Layout_Def, scheduler: ac.FrameScheduler, signal_restart: sc.ESignal): unknown[] {
    switch (element_def.kind) {
        case "none":
        case "static":
            return [element_def.kind, null, null, null, scheduler, signal_restart]
        case "track":
        case "normalize":
            return [element_def.kind, element_def.id, element_def.anim_translate_config, element_def.anim_scale_config, scheduler, signal_restart]
    }
}

const anim_new = function(element_def: AnimatedLayoutDef) {
    return ac.anim_new_merge([
        ac.anim_new_spring({
            ...element_def.anim_translate_config,

            target: 0,
            effect: element_def.id.transforms.left.input,
        }),

        ac.anim_new_spring({
            ...element_def.anim_translate_config,

            target: 0,
            effect: element_def.id.transforms.top.input,
        }),

        ac.anim_new_spring({
            ...element_def.anim_scale_config,

            target: 0,
            effect: element_def.id.transforms.width.input,
        }),

        ac.anim_new_spring({
            ...element_def.anim_scale_config,

            target: 0,
            effect: element_def.id.transforms.height.input,
        }),
    ] as const)
}

const point_new = function(element_def: AnimatedLayoutDef): AnimationPoint {
    return [
        { state: element_def.id.transforms.left.output(), velocity: 0, },
        { state: element_def.id.transforms.top.output(), velocity: 0, },
        { state: element_def.id.transforms.width.output(), velocity: 0, },
        { state: element_def.id.transforms.height.output(), velocity: 0, },
    ]
}

const point_new_conitnued = function(element_def: AnimatedLayoutDef, old_point: AnimationPoint): AnimationPoint {
    return [
        { state: element_def.id.transforms.left.output(), velocity: old_point[0].velocity, },
        { state: element_def.id.transforms.top.output(), velocity: old_point[1].velocity, },
        { state: element_def.id.transforms.width.output(), velocity: old_point[2].velocity, },
        { state: element_def.id.transforms.height.output(), velocity: old_point[3].velocity, },
    ]
}

export type UseMotionLayoutAnim_Params = {
    readonly signal_restart: sc.ESignal
    readonly scheduler: ac.FrameScheduler
    readonly element_def: Motion_Layout_Def
}

export const useMotionLayoutAnim = function(params: UseMotionLayoutAnim_Params) {
    r.useLayoutEffect((): VoidFunction | void => {
        const element_def = params.element_def

        if (element_def.kind === "track" || element_def.kind === "normalize") {
            let now_point: ac.Anim_InferPoint<ReturnType<typeof anim_new>> = point_new(element_def)

            // restart animation maintaining velocity on signal event
            return sc.signal_listen({
                target: params.signal_restart,

                listener: () => {
                    const emitter = ac.emitter_new_interval({
                        point: now_point,
                        anim: anim_new(element_def),
                        scheduler: params.scheduler,
                    })

                    return () => {
                        emitter.hardstop()

                        now_point = point_new_conitnued(element_def, emitter.point())
                    }
                },

                config: {
                    emit: true,
                },
            })
        }
    }, deps_new(params.element_def, params.scheduler, params.signal_restart))
}
