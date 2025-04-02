import { initdef_new_sequence } from "#src/initdef/new/sequence.js"
import type { InitDef } from "#src/initdef/type/InitDef.js"
import { useMemo } from "react"

export type UseInitSequence_Src_Generic = readonly InitDef[]

export type UseInitSequence_Src_InferApi<Src extends UseInitSequence_Src_Generic> = {
    [K in keyof Src]: Src[K]["initapi"]
}

type Src_Generic = UseInitSequence_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UseInitSequence_Src_InferApi<Src>

export const useInitSequence = function <Src extends Src_Generic>(src: Src) {
    const src_initapi = src.map(({ initapi: point }) => point) as Src_InferApi<Src>

    return useMemo(
        () => initdef_new_sequence(src_initapi),
        src_initapi
    )
}
