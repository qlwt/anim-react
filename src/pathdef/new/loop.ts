import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import * as ac from "@qyu/anim-core";
import { anim_new_loop } from "@qyu/anim-core";

export type PathDef_New_Loop_Params<ChildPoint> = AnimDef<ChildPoint>

type PathDefLoop<ChildPoint> = PathDef<ac.AnimLoop_Point<ChildPoint>>

export const pathdef_new_loop = function <ChildPoint>(animdef: PathDef_New_Loop_Params<ChildPoint>): PathDefLoop<ChildPoint> {
    const { pathapi, initapi } = animdef

    return {
        pathapi: inputdef_new_pipe(
            inputdef_new_merge([pathapi, initapi] as const),
            ([pathapi_o, initapi_o]) => anim_new_loop({
                src: pathapi_o,
                point: initapi_o.init(),
            })
        )
    }
}
