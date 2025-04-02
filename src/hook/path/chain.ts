import type { PathDef } from "#src/pathdef/type/PathDef.js";
import { pathdef_new_chain, type PathDef_New_Chain_Src } from "#src/pathdef/new/chain.js";
import { useMemo } from "react";

export type UsePathChain_Src<ChildPoint> = readonly PathDef<ChildPoint>[]

type Src<ChildPoint> = UsePathChain_Src<ChildPoint>

export const usePathChain = function <ChildPoint>(src: Src<ChildPoint>) {
    const src_path = src.map(({ pathapi }) => pathapi) as PathDef_New_Chain_Src<ChildPoint>

    return useMemo(
        () => pathdef_new_chain(src_path),
        src_path
    )
}
