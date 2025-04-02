import { useAnim } from "#src/hook/anim/index.js";
import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import { useInitCluster } from "#src/hook/init/cluster.js";

export const useAnimCluster = function <ChildPoint>(src: AnimDef<ChildPoint>): AnimDef<ChildPoint> {
    return useAnim(
        useInitCluster(src),
        src
    )
}
