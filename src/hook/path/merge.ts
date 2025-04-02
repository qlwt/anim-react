import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { pathdef_new_merge } from "#src/pathdef/new/merge.js";
import { useMemo } from "react";

export type UsePathMerge_Src_Generic = readonly PathDef[]

export type UsePathMerge_Src_InferApi<Src extends UsePathMerge_Src_Generic> = {
    [K in keyof Src]: Src[K]["pathapi"]
}

type Src_Generic = UsePathMerge_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UsePathMerge_Src_InferApi<Src>

export const usePathMerge = function <Src extends Src_Generic>(src: Src) {
    const src_pathapi = src.map(({ pathapi }) => pathapi) as Src_InferApi<Src>

    return useMemo(
        () => pathdef_new_merge(src_pathapi),
        src_pathapi
    )
}
