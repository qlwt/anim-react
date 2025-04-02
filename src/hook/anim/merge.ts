import { useAnim } from "#src/hook/anim/index.js";
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import { usePathMerge } from "#src/hook/path/merge.js";
import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { useInitMerge } from "#src/hook/init/merge.js";
import type { InitDef } from "#src/initdef/type/InitDef.js";
import type { InitDef_InferPoint } from "#src/initdef/type/InitDef_InferPoint.js";
import type * as ac from "@qyu/anim-core";

export type UseAnimMerge_Src_Generic = readonly AnimDef[]

export type UseAnimMerge_Src_InferPoint<Src extends UseAnimMerge_Src_Generic> = {
    [K in keyof Src]: InitDef_InferPoint<Src[K]>
}

type Src_Generic = UseAnimMerge_Src_Generic
type Src_InferPoint<Src extends Src_Generic> = UseAnimMerge_Src_InferPoint<Src>

type Src_PointMerge<Src extends Src_Generic> = ac.AnimMerge_Point<Src_InferPoint<Src>>
type Src_PathDefMerge<Src extends Src_Generic> = PathDef<Src_PointMerge<Src>>
type Src_PointDefMerge<Src extends Src_Generic> = InitDef<Src_PointMerge<Src>>

export const useAnimMerge = function <Src extends Src_Generic>(src: Src) {
    return useAnim(
        useInitMerge(src) as Src_PointDefMerge<Src>,
        usePathMerge(src) as Src_PathDefMerge<Src>
    )
}
