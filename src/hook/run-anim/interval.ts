import type { AnimDef } from "#src/hook/anim/type/AnimDef.js"
import { InputDef_type } from "#src/inputdef/type/InputDef.js"
import * as ac from "@qyu/anim-core"
import * as sc from "@qyu/signal-core"
import * as react from "react"

export type UseRunAnimInterval_Hooks = {
    readonly tick_before?: VoidFunction
    readonly tick_after?: VoidFunction
    readonly init?: VoidFunction
    readonly adapt?: VoidFunction
    readonly finish?: VoidFunction
}

export type UseRunAnimInterval_Controls = {
    readonly adapt?: sc.ESignal
    readonly restart?: sc.ESignal
}

export type UseRunAnimInterval_Params<Point> = {
    readonly src: AnimDef<Point>

    readonly spread?: boolean
    readonly scheduler?: ac.FrameScheduler
    readonly hooks?: UseRunAnimInterval_Hooks
    readonly controls?: UseRunAnimInterval_Controls
    readonly batch?: null | ((callback: VoidFunction) => void)
}

export const useRunAnimInterval = function <Point>(params: UseRunAnimInterval_Params<Point>): void {
    const {
        src,
        controls,
        spread = false,
        batch = sc.batcher.batch_sync,
        scheduler = ac.fscheduler_new_universal(),
    } = params

    const ref_hooks = react.useRef(params.hooks)

    react.useEffect(() => {
        ref_hooks.current = params.hooks
    }, [params.hooks])

    react.useEffect(
        //  for initdef:
        //      initialize point
        //      for pathdef:
        //          create emitter
        //      cleanup:
        //          terminate emitter
        //          update last point
        //  cleanup:
        //      cleanup pathdef
        () => {
            let init_point: Point
            let last_point: Point
            let restart_lastid: Symbol | {} | null = controls?.restart?.id() ?? null

            return sc.signal_listen({
                config: {
                    emit: true,
                },

                target: sc.esignal_new_merge([
                    params.controls?.restart ?? null,
                    src.initapi.type === InputDef_type.Dynamic ? src.initapi.value : null,
                ].filter(n => n !== null)),

                listener: () => {
                    const initapi = src.initapi.type === InputDef_type.Static ? src.initapi.value() : src.initapi.value.output()

                    let interrupted = false

                    if (spread) {
                        if (!init_point) {
                            init_point = initapi.init()
                            last_point = init_point

                            ref_hooks.current?.init?.()
                        } else {
                            const update = initapi.next(init_point, last_point)

                            init_point = update.ipoint
                            last_point = update.lpoint

                            if (update.change) {
                                ref_hooks.current?.init?.()
                            }
                        }
                    } else {
                        if (!init_point || restart_lastid !== (controls?.restart?.id() ?? null) || initapi.changed(init_point)) {
                            init_point = initapi.init()
                            last_point = init_point

                            ref_hooks.current?.init?.()
                        }
                    }

                    const cleanup = sc.signal_listen({
                        config: {
                            emit: true,
                        },

                        target: sc.esignal_new_merge([
                            params.controls?.adapt ?? null,
                            src.pathapi.type === InputDef_type.Dynamic ? src.pathapi.value : null,
                        ].filter(n => n !== null)),

                        listener: (): VoidFunction | void => {
                            if (interrupted) { return }

                            const anim = src.pathapi.type === InputDef_type.Static ? src.pathapi.value() : src.pathapi.value.output()

                            ref_hooks.current?.adapt?.()

                            const emitter = ac.emitter_new_interval({
                                anim,
                                batch,
                                scheduler,
                                point: last_point,

                                hooks: {
                                    finish: () => ref_hooks.current?.finish?.(),
                                    tick_after: () => ref_hooks.current?.tick_after?.(),
                                    tick_before: () => ref_hooks.current?.tick_before?.(),
                                },
                            })

                            return () => {
                                emitter.softstop()

                                last_point = emitter.point()
                            }
                        }
                    })

                    return () => {
                        interrupted = true

                        cleanup()
                    }
                }
            })
        },
        [src.initapi, src.pathapi, scheduler, spread, controls?.adapt, controls?.restart]
    )
}
