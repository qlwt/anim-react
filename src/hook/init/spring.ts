import { initdef_new_spring } from "#src/initdef/new/spring.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type * as ac from "@qyu/anim-core"
import * as react from "react"

export const useInitSpring = function(point: InputDef<ac.AnimSpring_Point>) {
    return react.useMemo(
        () => initdef_new_spring(point),
        [point]
    )
}
