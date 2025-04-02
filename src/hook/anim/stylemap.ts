import { useAnim } from "#src/hook/anim/index.js";
import { useInitStyleMap } from "#src/hook/init/stylemap.js";
import { usePathStyleMap } from "#src/hook/path/stylemap.js";
import type { InitDef_New_StyleMap_Init } from "#src/initdef/new/stylemap.js";
import type { InputDef } from "#src/inputdef/type/InputDef.js";
import type { PathDef_New_StyleMap_Config } from "#src/pathdef/new/stylemap.js";
import type { TransValue } from "#src/transvalue/type/TransValue.js";
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js";
import type { StyleTarget } from "#src/type/StyleTarget.js";

export type UseAnimStyleMap_Properties<TransInit, TransPath> = {
    [K: string]: TransValue<TransValue_CSSTarget, TransInit, TransPath>
}

export type UseAnimStyleMap_Params<ChildPoint, TransInit, TransPath> = {
    readonly ref: () => StyleTarget | null
    readonly properties: InputDef<UseAnimStyleMap_Properties<TransInit, TransPath>>
    readonly init: InputDef<InitDef_New_StyleMap_Init<ChildPoint, TransInit>>
    readonly config: InputDef<PathDef_New_StyleMap_Config<ChildPoint, TransPath>>
}

type Params<ChildPoint, TransInit, TransPath> = UseAnimStyleMap_Params<ChildPoint, TransInit, TransPath>

export const useAnimStyleMap = function <ChildPoint, TransInit, TransPath>(params: Params<ChildPoint, TransInit, TransPath>) {
    return useAnim(
        useInitStyleMap(params),
        usePathStyleMap(params)
    )
}
