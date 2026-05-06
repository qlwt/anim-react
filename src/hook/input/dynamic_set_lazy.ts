import { inputdef_new_dynamic } from "#src/inputdef/new/dynamic.js";
import type { InputDef_Dynamic } from "#src/inputdef/type/InputDef.js";
import * as sc from "@qyu/signal-core";
import * as r from "react";

export const useInputDynamicSetLazy = function <T>(value: () => T, deps?: unknown[]): InputDef_Dynamic<T> {
    const ref_first = r.useRef<boolean>(true)
    const signal = r.useMemo(() => sc.signal_new_value(value()), [])

    r.useLayoutEffect(() => {
        if (ref_first.current === true) {
            ref_first.current = false

            return
        }

        sc.batcher.batch_microtask(() => {
            signal.input(value())
        })
    }, deps)

    return r.useMemo(
        () => inputdef_new_dynamic(signal),
        [signal]
    )
}
