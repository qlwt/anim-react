import { initdef_new_pipe, type InitDef_New_Pipe_Params } from "#src/initdef/new/pipe.js";
import { useMemo } from "react";

export const useInitPipe = function <PointSrc, PointOut>(params: InitDef_New_Pipe_Params<PointSrc, PointOut>) {
    return useMemo(
        () => initdef_new_pipe(params),
        [params.src.initapi, params.config]
    )
}
