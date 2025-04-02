import { inputdef_new_static } from "#src/inputdef/new/static.js";
import type { InputDef_Static } from "#src/inputdef/type/InputDef.js";
import * as react from "react"

export const useInputConstant = function <T>(value: T): InputDef_Static<T> {
    return react.useMemo(() => inputdef_new_static(value), [])
}
