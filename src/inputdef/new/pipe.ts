import { inputdef_new_static } from "#src/inputdef/new/static.js";
import { inputdef_new_dynamic } from "#src/inputdef/new/dynamic.js";
import { InputDef_type, type InputDef } from "#src/inputdef/type/InputDef.js";
import * as sc from "@qyu/signal-core";

export const inputdef_new_pipe = function <O, OT>(
    src: InputDef<O>,
    otransformer: sc.SignalPipe_OTransformer<O, OT>
): InputDef<OT> {
    if (src.type === InputDef_type.Static) {
        return inputdef_new_static(otransformer(src.value()))
    }

    return inputdef_new_dynamic(
        sc.osignal_new_pipe(src.value, otransformer)
    )
}
