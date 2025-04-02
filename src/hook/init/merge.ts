import { initdef_new_merge } from "#src/initdef/new/merge.js"
import type { InitDef } from "#src/initdef/type/InitDef.js"
import { useMemo } from "react"

export type UseInitMerge_Src_Generic = readonly InitDef[]

export type UseInitMerge_Src_InferApi<Src extends UseInitMerge_Src_Generic> = {
    [K in keyof Src]: Src[K]["initapi"]
}

type Src_Generic = UseInitMerge_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UseInitMerge_Src_InferApi<Src>

export const useInitMerge = function <Src extends Src_Generic>(src: Src) {
    const src_initapi = src.map(({ initapi: point }) => point) as Src_InferApi<Src>

    return useMemo(
        () => initdef_new_merge(src_initapi),
        src_initapi
    )
}
