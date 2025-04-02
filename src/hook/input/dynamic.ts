import { inputdef_new_dynamic } from "#src/inputdef/new/dynamic.js";
import type { InputDef_Dynamic } from "#src/inputdef/type/InputDef.js";
import * as sc from "@qyu/signal-core";
import * as react from "react";

export const useInputDynamic = function <T>(signal: sc.OSignal<T>): InputDef_Dynamic<T> {
    return react.useMemo(
        () => inputdef_new_dynamic(signal),
        [signal]
    )
}
