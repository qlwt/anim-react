import type { AnimDef } from "#src/hook/anim/type/AnimDef.js"
import { inputdef_listen } from "#src/inputdef/listen.js"
import * as ac from "@qyu/anim-core"
import * as sc from "@qyu/signal-core"
import * as react from "react"

export type UseRunAnimInterval_Params<Point> = {
    readonly src: AnimDef<Point>
    readonly scheduler: ac.FrameScheduler

    readonly spread?: boolean
    readonly batch?: null | ((callback: VoidFunction) => void)
}

export const useRunAnimInterval = function <Point>(params: UseRunAnimInterval_Params<Point>): void {
    const { src, scheduler, spread = false, batch = sc.batcher.batch_sync } = params

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

            return inputdef_listen({
                src: src.initapi,

                listener: initapi => {
                    let interrupted = false

                    if (spread) {
                        if (!init_point) {
                            init_point = initapi.init()
                            last_point = init_point
                        } else {
                            const update = initapi.next(init_point, last_point)

                            init_point = update.ipoint
                            last_point = update.lpoint
                        }
                    } else {
                        if (!init_point || initapi.changed(init_point)) {
                            init_point = initapi.init()
                            last_point = init_point
                        }
                    }

                    const cleanup = inputdef_listen({
                        src: src.pathapi,

                        listener: (anim): VoidFunction | void => {
                            if (interrupted) { return }

                            const emitter = ac.emitter_new_interval({ scheduler, anim, point: last_point, batch })

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
        [src.initapi, src.pathapi, scheduler, spread]
    )
}
