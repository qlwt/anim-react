import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import * as ac from "@qyu/anim-core";

export type PathDef_New_Pipe_Params<PointSrc, PointOut> = {
    readonly src: PathDef<PointSrc>
    readonly config: InputDef<ac.AnimNewPipe_Config<PointSrc, PointOut>>
}

export const pathdef_new_pipe = function <PointSrc, PointOut>(params: PathDef_New_Pipe_Params<PointSrc, PointOut>): PathDef<PointOut> {
    const { src, config } = params

    return {
        pathapi: inputdef_new_pipe(
            inputdef_new_merge([src.pathapi, config] as const),
            ([pathapi_o, config_o]) => ac.anim_new_pipe({
                src: pathapi_o,
                config: config_o
            })
        )
    }
}
