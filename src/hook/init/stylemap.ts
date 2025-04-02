import { initdef_new_stylemap, type InitDef_New_StyleMap_Params } from "#src/initdef/new/stylemap.js"
import * as react from "react"

type Params<ChildPoint, ChildInit> = InitDef_New_StyleMap_Params<ChildPoint, ChildInit>

export const useInitStyleMap = function <ChildPoint, ChildInit>(params: Params<ChildPoint, ChildInit>) {
    return react.useMemo(
        () => initdef_new_stylemap(params),
        [params.properties, params.init]
    )
}
