import type { PathDef } from "#src/pathdef/type/PathDef.js";
import type { PathApi_InferPoint } from "#src/pathdef/type/PathDef_InferPoint.js";
import { inputdef_new_merge } from "#src/inputdef/new/merge.js";
import { inputdef_new_mergemap } from "#src/inputdef/new/mergemap.js";
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js";
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js";
import * as ac from "@qyu/anim-core";

type UnionKeyof<Src extends Object> = Src extends Src ? keyof Src : never

type UnionValue<Src extends Object, K extends keyof any> = Src extends { [key in K]: infer T } ? T : never

export type PathDef_New_ChainMap_Src_Generic = readonly {
    readonly [K in keyof any]: PathDef["pathapi"]
}[]

export type PathDef_New_ChainMap_Src_InferPoint<Src extends PathDef_New_ChainMap_Src_Generic> = {
    [K in UnionKeyof<Src[number]>]: PathApi_InferPoint<InputDef_InferOutput<UnionValue<Src[number], K>>>
}

type Src_Generic = PathDef_New_ChainMap_Src_Generic
type Src_InferPoint<Src extends Src_Generic> = PathDef_New_ChainMap_Src_InferPoint<Src>
type Src_PathDefChainMap<Src extends Src_Generic> = PathDef<ac.AnimChainMap_Point<Src_InferPoint<Src>>>

export const pathdef_new_chainmap = function <Src extends Src_Generic>(src: Src): Src_PathDefChainMap<Src> {
    return {
        pathapi: inputdef_new_pipe(
            inputdef_new_merge(src.map(
                src_pathapimap => inputdef_new_mergemap(src_pathapimap)
            )),
            src_o => {
                return ac.anim_new_chainmap(src_o) as ac.Anim<ac.AnimChainMap_Point<Src_InferPoint<Src>>>
            }

        )
    }
}
