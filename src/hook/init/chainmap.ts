import { initdef_new_chainmap } from "#src/initdef/new/chainmap.js";
import type { InitDef } from "#src/initdef/type/InitDef.js";
import { useMemo } from "react";

export type UseInitChainMap_Src_Generic = {
    readonly [K in keyof any]: InitDef
}

export type UseInitChainMap_Src_InferApi<Src extends UseInitChainMap_Src_Generic> = {
    [K in keyof Src]: Src[K]["initapi"]
}

type Src_Generic = UseInitChainMap_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UseInitChainMap_Src_InferApi<Src>

export const useInitChainMap = function <Src extends Src_Generic>(src: Src) {
    // get .point from every pointdef
    const src_point = Object.entries(src).map(([thread, { initapi: point }]) => [thread, point])

    return useMemo(
        () => initdef_new_chainmap<Src_InferApi<Src>>(Object.fromEntries(src_point)),
        src_point.flat()
    )
}
