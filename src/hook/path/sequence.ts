import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { pathdef_new_sequence } from "#src/pathdef/new/sequence.js";
import { useMemo } from "react";

export type UsePathSequence_Src_Generic = readonly PathDef[]

export type UsePathSequence_Src_InferApi<Src extends UsePathSequence_Src_Generic> = {
    [K in keyof Src]: Src[K]["pathapi"]
}

type Src_Generic = UsePathSequence_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UsePathSequence_Src_InferApi<Src>

export const usePathSequence = function <Src extends Src_Generic>(src: Src) {
    const src_pathapi = src.map(({ pathapi }) => pathapi) as Src_InferApi<Src>

    return useMemo(
        () => pathdef_new_sequence(src_pathapi),
        src_pathapi
    )
}
