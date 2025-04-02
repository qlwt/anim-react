import type { PathDef } from "#src/pathdef/type/PathDef.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import { pathdef_new_line } from "#src/pathdef/new/line.js";
import * as ac from "@qyu/anim-core";
import { useMemo } from "react";

type PathDefLine = PathDef<ac.AnimLine_Point>

export const usePathLine = function(config: InputDef<ac.AnimNewLine_Config>): PathDefLine {
    return useMemo(
        () => pathdef_new_line(config),
        [config]
    )
}
