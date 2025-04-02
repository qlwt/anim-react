import { pathdef_new_loop, type PathDef_New_Loop_Params } from "#src/pathdef/new/loop.js";
import { useMemo } from "react";

export const usePathLoop = function <ChildPoint>(animdef: PathDef_New_Loop_Params<ChildPoint>) {
    return useMemo(
        () => pathdef_new_loop(animdef),
        [animdef.pathapi, animdef.initapi]
    )
}
