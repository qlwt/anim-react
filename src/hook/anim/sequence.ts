import { useAnim } from "#src/hook/anim/index.js";
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import { usePathSequence } from "#src/hook/path/sequence.js";
import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { useInitSequence } from "#src/hook/init/sequence.js";
import type { InitDef } from "#src/initdef/type/InitDef.js";
import type { InitDef_InferPoint } from "#src/initdef/type/InitDef_InferPoint.js";
import type * as ac from "@qyu/anim-core";

export type UseAnimSequence_Src_Generic = readonly AnimDef[]

export type UseAnimSequence_Src_InferPoint<Src extends UseAnimSequence_Src_Generic> = {
    [K in keyof Src]: InitDef_InferPoint<Src[K]>
}

type Src_Generic = UseAnimSequence_Src_Generic
type Src_InferPointValue<Src extends Src_Generic> = UseAnimSequence_Src_InferPoint<Src>

type Src_PointSequence<Src extends Src_Generic> = ac.AnimSequence_Point<Src_InferPointValue<Src>>
type Src_PathDefSequence<Src extends Src_Generic> = PathDef<Src_PointSequence<Src>>
type Src_PointDefSequence<Src extends Src_Generic> = InitDef<Src_PointSequence<Src>>

export const useAnimSequence = function <Src extends Src_Generic>(src: Src) {
    return useAnim(
        useInitSequence(src) as Src_PointDefSequence<Src>,
        usePathSequence(src) as Src_PathDefSequence<Src>
    )
}
