import type { AnimDef } from "#src/hook/anim/type/AnimDef.js";
import type { PathDef } from "#src/pathdef/type/PathDef.js";
import type { InitDef } from "#src/initdef/type/InitDef.js";
import { useMemo } from "react";

export const useAnim = function <Point>(initdef: InitDef<Point>, pathdef: PathDef<Point>): AnimDef<Point> {
    return useMemo(
        () => ({
            pathapi: pathdef.pathapi,
            initapi: initdef.initapi
        }),
        [initdef.initapi, pathdef.pathapi]
    )
}
