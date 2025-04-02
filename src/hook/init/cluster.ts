import { initdef_new_cluster } from "#src/initdef/new/cluster.js";
import type { InitDef } from "#src/initdef/type/InitDef.js";
import * as react from "react"

export const useInitCluster = function <ChildPoint>(src: InitDef<ChildPoint>) {
    return react.useMemo(
        () => initdef_new_cluster(src),
        [src.initapi]
    )
}
