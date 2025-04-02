import { initdef_new_sequence_strict } from "#src/initdef/new/sequence_strict.js"
import type { InitDef } from "#src/initdef/type/InitDef.js"
import { useMemo } from "react"

export type UseInitSequenceStrict_Src_Generic = readonly InitDef[]

export type UseInitSequenceStrict_Src_InferApi<Src extends UseInitSequenceStrict_Src_Generic> = {
    [K in keyof Src]: Src[K]["initapi"]
}

type Src_Generic = UseInitSequenceStrict_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UseInitSequenceStrict_Src_InferApi<Src>

export const useInitSequenceStrict = function <Src extends Src_Generic>(src: Src) {
    const src_initapi = src.map(({ initapi: point }) => point) as Src_InferApi<Src>

    return useMemo(
        () => initdef_new_sequence_strict(src_initapi),
        src_initapi
    )
}
