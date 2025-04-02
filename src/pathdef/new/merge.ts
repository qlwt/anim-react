import type { PathDef } from "#src/pathdef/type/PathDef.js";
import type { PathApi_InferPoint } from "#src/pathdef/type/PathDef_InferPoint.js";
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js";
import * as ac from "@qyu/anim-core";

export type PathDef_New_Merge_Src_Generic = readonly PathDef["pathapi"][]

export type PathDef_New_Merge_Src_InferPoint<Src extends PathDef_New_Merge_Src_Generic> = {
    [K in keyof Src]: PathApi_InferPoint<InputDef_InferOutput<Src[K]>>
}

type Src_Generic = PathDef_New_Merge_Src_Generic
type Src_InferPoint<Src extends Src_Generic> = PathDef_New_Merge_Src_InferPoint<Src>

type Src_PathDefMerge<Src extends Src_Generic> = PathDef<ac.AnimMerge_Point<
    Src_InferPoint<Src>
>>

export const pathdef_new_merge = function <Src extends Src_Generic>(src: Src): Src_PathDefMerge<Src> {
    return {
        pathapi: inputdef_new_pipe(
            inputdef_new_merge(src),
            src_os => ac.anim_new_merge(src_os)
        )
    }
}
