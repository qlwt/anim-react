import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { pathdef_new_chainmap } from "#src/pathdef/new/chainmap.js";
import { useMemo } from "react";

type UnionKeyof<Src extends Object> = Src extends Src ? keyof Src : never

type UnionValue<Src extends Object, K extends keyof any> = Src extends { [key in K]: infer T } ? T : never

export type UsePathChainMap_Src_Generic = readonly {
    readonly [K in keyof any]: PathDef
}[]

export type UsePathChainMap_Src_InferApi<Src extends Src_Generic> = {
    [J in keyof Src]: {
        [K in UnionKeyof<Src[J]>]: UnionValue<Src[J], K>["pathapi"]
    }
}

type Src_Generic = UsePathChainMap_Src_Generic
type Src_InferApi<Src extends Src_Generic> = UsePathChainMap_Src_InferApi<Src>

export const usePathChainMap = function <Src extends Src_Generic>(src: Src) {
    const src_mapped = src.map(threads => Object.entries(threads).map(
        ([key, thread]) => [key, thread.pathapi] as const
    ))

    return useMemo(
        () => pathdef_new_chainmap(
            src_mapped.map(entries => Object.fromEntries(entries)) as Src_InferApi<Src>
        ),
        src_mapped.flat(2)
    )
}
