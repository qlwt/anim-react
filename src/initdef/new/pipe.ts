import type { InitDef } from "#src/initdef/type/InitDef.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import type * as ac from "@qyu/anim-core"
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";

export type InitDef_New_Pipe_Params<PointSrc, PointOut> = {
    readonly src: InitDef<PointSrc>
    readonly config: InputDef<ac.AnimNewPipe_Config<PointSrc, PointOut>>
}

export const initdef_new_pipe = function <PointSrc, PointOut>(params: InitDef_New_Pipe_Params<PointSrc, PointOut>): InitDef<PointOut> {
    const { src, config } = params

    return {
        initapi: inputdef_new_pipe(
            inputdef_new_merge([src.initapi, config] as const),

            ([src_o, config_o]) => ({
                init: () => config_o.pipeo(src_o.init()),

                changed: ipoint => {
                    return src_o.changed(config_o.pipei(ipoint))
                },

                next: (ipoint, lpoint) => {
                    const ipoint_piped = config_o.pipei(ipoint)
                    const lpoint_piped = config_o.pipei(lpoint)
                    const update = src_o.next(ipoint_piped, lpoint_piped)

                    return {
                        change: update.change,
                        ipoint: config_o.pipeo(update.ipoint),
                        lpoint: config_o.pipeo(update.lpoint)
                    }
                }
            })
        )
    }
}
