import { InputDef_type, type InputDef_Dynamic } from "#src/inputdef/type/InputDef.js";
import type { OSignal, Signal_InferO } from "@qyu/signal-core";

export const inputdef_new_dynamic = function <Src extends OSignal<any>>(value: Src): InputDef_Dynamic<Signal_InferO<Src>> {
    return {
        value,

        type: InputDef_type.Dynamic
    }
}
