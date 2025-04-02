import { useAnim } from "#src/hook/anim/index.js"
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js"
import { usePathChainMap } from "#src/hook/path/chainmap.js"
import { useInitChainMap } from "#src/hook/init/chainmap.js"
import type { InitDef } from "#src/initdef/type/InitDef.js"
import type { PathDef } from "#src/pathdef/type/PathDef.js"
import type { PathDef_InferPoint } from "#src/pathdef/type/PathDef_InferPoint.js"
import type * as ac from "@qyu/anim-core"

type UnionKeyof<Src extends Object> = Src extends Src ? keyof Src : never

type UnionValue<Src extends Object, K extends keyof any> = Src extends { [key in K]: infer T } ? T : never

export type UseAnimChainMap_Src_Generic = readonly {
    readonly [K in keyof any]: PathDef | AnimDef
}[]

export type UseAnimChainMap_Src_InferPoint<Src extends UseAnimChainMap_Src_Generic> = {
    [K in UnionKeyof<Src[number]>]: PathDef_InferPoint<UnionValue<Src[number], K>>
}

export type UseAnimChainMap_Src_InferInitDef<Src extends UseAnimChainMap_Src_Generic> = {
    [K in UnionKeyof<Src[number]>]: UnionValue<Src[number], K> extends InitDef<infer P> ? InitDef<P> : never
}

type Src_Generic = UseAnimChainMap_Src_Generic
type Src_InferPoint<Src extends Src_Generic> = UseAnimChainMap_Src_InferPoint<Src>

export const useAnimChainMap = function <Src extends Src_Generic>(src: Src) {
    const pointdef_src: Record<keyof any, InitDef> = {}

    for (let i = 0; i < src.length; ++i) {
        const thread = src[i]!
        const thread_keys = Object.keys(thread)

        for (const key of thread_keys) {
            if (!pointdef_src[key]) {
                // expect first appearance of thread definition to be of AnimDef type
                pointdef_src[key] = thread[key] as AnimDef
            }
        }
    }

    return useAnim(
        useInitChainMap(pointdef_src) as InitDef<ac.AnimChainMap_Point<Src_InferPoint<Src>>>,
        usePathChainMap(src as Src_Generic) as PathDef<ac.AnimChainMap_Point<Src_InferPoint<Src>>>
    )
}
