import { inputdef_new_dynamic } from "#src/inputdef/new/dynamic.js";
import type { InputDef_Dynamic } from "#src/inputdef/type/InputDef.js";
import * as sr from "@qyu/signal-react";
import * as react from "react";

export const useInputDynamicSet = function <T>(value: T, deps?: unknown[]): InputDef_Dynamic<T> {
    const signal = sr.useSignalValue(value, deps)

    return react.useMemo(
        () => inputdef_new_dynamic(signal),
        [signal]
    )
}
