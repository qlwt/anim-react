import type { InputDef_Static } from "#src/inputdef/type/InputDef.js";
import { InputDef_type } from "#src/inputdef/type/InputDef.js";

export const inputdef_new_static = function <T>(value: T): InputDef_Static<T> {
    return {
        value: () => value,
        type: InputDef_type.Static
    }
}
