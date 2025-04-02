import type { PathDef } from "#src/pathdef/type/PathDef.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import { pathdef_new_pipe } from "#src/pathdef/new/pipe.js";
import * as ac from "@qyu/anim-core";
import { useMemo } from "react";

export type UsePathPipe_Params<PointSrc, PointOut> = {
    readonly src: PathDef<PointSrc>
    readonly config: InputDef<ac.AnimNewPipe_Config<PointSrc, PointOut>>
}

export const usePathPipe = function <PointSrc, PointOut>(
    params: UsePathPipe_Params<PointSrc, PointOut>
): PathDef<PointOut> {
    return useMemo(
        () => pathdef_new_pipe(params),
        [params.src.pathapi, params.config]
    )
}
