import { initdef_new_line } from "#src/initdef/new/line.js"
import type { InitDef } from "#src/initdef/type/InitDef.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type * as ac from "@qyu/anim-core"
import * as react from "react"

type PointDefLine = InitDef<ac.AnimLine_Point>

export const useInitLine = function(point: InputDef<ac.AnimLine_Point>): PointDefLine {
    return react.useMemo(
        () => initdef_new_line(point),
        [point]
    )
}
