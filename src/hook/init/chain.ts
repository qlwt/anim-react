import { initdef_new_chain } from "#src/initdef/new/chain.js";
import type { InitDef } from "#src/initdef/type/InitDef.js";
import * as react from "react";

export const useInitChain = function <ChildPoint>(src: InitDef<ChildPoint>) {
    return react.useMemo(() => initdef_new_chain(src), [src.initapi])
}
