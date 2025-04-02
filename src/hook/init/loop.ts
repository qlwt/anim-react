import { initdef_new_loop, type InitDef_New_Loop_Params } from "#src/initdef/new/loop.js";
import { useMemo } from "react";

export const useInitLoop = function <ChildPoint>(params: InitDef_New_Loop_Params<ChildPoint>) {
    return useMemo(
        () => initdef_new_loop(params),
        [params.src.initapi, params.init]
    )
}
