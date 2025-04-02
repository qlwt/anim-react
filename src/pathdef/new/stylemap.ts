import { inputdef_new_merge } from "#src/inputdef/new/merge.js"
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type { PathDef } from "#src/pathdef/type/PathDef.js"
import type { TransValue } from "#src/transvalue/type/TransValue.js"
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js"
import type { AnimStyleMap_Point } from "#src/type/AnimStyleMap_Point.js"
import type { StyleTarget } from "#src/type/StyleTarget.js"
import { object_new_map } from "#src/util/object/new/map.js"
import * as ac from "@qyu/anim-core"

export type PathDef_New_StyleMap_Properties<TransPath> = {
    readonly [K in string]: TransValue<TransValue_CSSTarget, any, TransPath>
}

export type PathDef_New_StyleMap_Config<ChildPoint, TransPath> = {
    readonly anim_new: (path: TransPath, effect: (state: number) => void) => ac.Anim<ChildPoint>
}

export type PathDef_New_StyleMap_Params<ChildPoint, TransPath> = {
    readonly ref: () => StyleTarget | null
    readonly properties: InputDef<PathDef_New_StyleMap_Properties<TransPath>>
    readonly config: InputDef<PathDef_New_StyleMap_Config<ChildPoint, TransPath>>
}

type Point<ChildPoint> = AnimStyleMap_Point<ChildPoint>
type Params<ChildPoint, TransPath> = PathDef_New_StyleMap_Params<ChildPoint, TransPath>

export const pathdef_new_stylemap = function <ChildPoint, TransPath>(
    params: Params<ChildPoint, TransPath>
): PathDef<Point<ChildPoint>> {
    const { ref, config: config_src, properties: properties_src } = params

    return {
        pathapi: inputdef_new_pipe(
            inputdef_new_merge([properties_src, config_src] as const),
            ([properties, config]) => {
                return ac.anim_new_mergemap(
                    object_new_map(properties, (src_transvalue, property) => {
                        return ac.anim_new_mergemap(
                            object_new_map(src_transvalue, transinstance => {
                                return config.anim_new(
                                    transinstance.path,
                                    transinstance.effect(value => {
                                        ref()?.style.setProperty(property, value)
                                    })
                                )
                            })
                        )
                    })
                )
            }
        )
    }
}
