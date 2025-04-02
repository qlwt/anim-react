import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { pathdef_new_sequence_strict } from "#src/pathdef/new/sequence_strict.js";
import { useMemo } from "react";

export type UsePathSequenceStrict_Src_Generic = readonly PathDef[]

export type UsePathSequenceStrict_Src_InferApi<Src extends UsePathSequenceStrict_Src_Generic> = {
    [K in keyof Src]: Src[K]["pathapi"]
}

type Src_Generic = UsePathSequenceStrict_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UsePathSequenceStrict_Src_InferApi<Src>

export const usePathSequenceStrict = function <Src extends Src_Generic>(src: Src) {
    const src_pathapi = src.map(({ pathapi }) => pathapi) as Src_InferApi<Src>

    return useMemo(
        () => pathdef_new_sequence_strict(src_pathapi),
        src_pathapi
    )
}

