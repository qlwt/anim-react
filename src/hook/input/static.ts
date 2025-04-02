import { inputdef_new_static } from "#src/inputdef/new/static.js";
import type { InputDef_Static } from "#src/inputdef/type/InputDef.js";
import * as react from "react"

export const useInputStatic = function <T>(value: T, deps?: any[]): InputDef_Static<T> {
    const rinput = react.useMemo(() => inputdef_new_static(value), [value])

    return react.useMemo(
        () => rinput,
        deps ? [true, ...deps] : [false, rinput]
    )
}
