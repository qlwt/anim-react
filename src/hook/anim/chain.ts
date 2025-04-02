import { useAnim } from "#src/hook/anim/index.js"
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js"
import { usePathChain } from "#src/hook/path/chain.js"
import { useInitChain } from "#src/hook/init/chain.js"
import type { PathDef } from "#src/pathdef/type/PathDef.js"

export const useAnimChain = function <ChildPoint>(src: readonly [AnimDef<ChildPoint>, ...PathDef<ChildPoint>[]]) {
    return useAnim(
        useInitChain(src[0]),
        usePathChain(src)
    )
}
