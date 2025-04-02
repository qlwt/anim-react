import { useAnim } from "#src/hook/anim/index.js";
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import { usePathSequenceStrict } from "#src/hook/path/sequence_strict.js";
import { useInitSequenceStrict } from "#src/hook/init/sequence_strict.js";
import type { InitDef } from "#src/initdef/type/InitDef.js";
import type { InitDef_InferPoint } from "#src/initdef/type/InitDef_InferPoint.js";
import type { PathDef } from "#src/pathdef/type/PathDef.js";
import type * as ac from "@qyu/anim-core";

export type UseAnimSequenceStrict_Src_Generic = readonly AnimDef[]

export type UseAnimSequenceStrict_Src_InferPoint<Src extends UseAnimSequenceStrict_Src_Generic> = {
    [K in keyof Src]: InitDef_InferPoint<Src[K]>
}

type Src_Generic = UseAnimSequenceStrict_Src_Generic
type Src_InferPointValue<Src extends Src_Generic> = UseAnimSequenceStrict_Src_InferPoint<Src>

type Src_PointSequenceStrict<Src extends Src_Generic> = ac.AnimSequenceStrict_Point<Src_InferPointValue<Src>>
type Src_PathDefSequenceStrict<Src extends Src_Generic> = PathDef<Src_PointSequenceStrict<Src>>
type Src_PointDefSequenceStrict<Src extends Src_Generic> = InitDef<Src_PointSequenceStrict<Src>>

export const useAnimSequenceStrict = function <Src extends Src_Generic>(src: Src) {
    return useAnim(
        useInitSequenceStrict(src) as Src_PointDefSequenceStrict<Src>,
        usePathSequenceStrict(src) as Src_PathDefSequenceStrict<Src>
    )
}
