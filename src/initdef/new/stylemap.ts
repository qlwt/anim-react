import type { InitDef } from "#src/initdef/type/InitDef.js"
import { inputdef_new_merge } from "#src/inputdef/new/merge.js"
import { inputdef_new_pipe } from "#src/inputdef/new/pipe.js"
import type { InputDef } from "#src/inputdef/type/InputDef.js"
import type { TransValue } from "#src/transvalue/type/TransValue.js"
import type { TransValue_CSSTarget } from "#src/transvalue/type/TransValue_CSSTarget.js"
import type { AnimStyleMap_Point } from "#src/type/AnimStyleMap_Point.js"
import { object_new_map } from "#src/util/object/new/map.js"

export type InitDef_New_StyleMap_Properties<Init> = {
    readonly [K in string]: TransValue<TransValue_CSSTarget, Init, any>
}

export type InitDef_New_StyleMap_Init<ChildPoint, TransInit> = {
    readonly point_new: (init: TransInit) => ChildPoint
    readonly point_eq: (a: ChildPoint, b: ChildPoint) => boolean
}

export type InitDef_New_StyleMap_Params<ChildPoint, TransInit> = {
    readonly properties: InputDef<InitDef_New_StyleMap_Properties<TransInit>>

    readonly init: InputDef<InitDef_New_StyleMap_Init<ChildPoint, TransInit>>
}

type Point<ChildPoint> = AnimStyleMap_Point<ChildPoint>
type Properties<TransInit> = InitDef_New_StyleMap_Properties<TransInit>
type Params<ChildPoint, TransInit> = InitDef_New_StyleMap_Params<ChildPoint, TransInit>

type Changed_Map_Params<ChildPoint, TransInit> = {
    readonly ipoint_map: Point<ChildPoint>[string]
    readonly properties_map: Properties<TransInit>[string]
    readonly init: InitDef_New_StyleMap_Init<ChildPoint, TransInit>
}

// just to split long function
const changed_new_map = function <ChildPoint, TransInit>(params: Changed_Map_Params<ChildPoint, TransInit>): boolean {
    const { ipoint_map, properties_map, init } = params

    const ipoint_keys = Object.keys(ipoint_map)

    if (ipoint_keys.length === Object.keys(properties_map).length) {
        for (const ipoint_key of ipoint_keys) {
            const properties_child = properties_map[ipoint_key]
            const ipoint_child = ipoint_map[ipoint_key]!

            if (properties_child) {
                const src_point = init.point_new(properties_child.init)

                if (!init.point_eq(ipoint_child, src_point)) {
                    return true
                }

                continue
            }

            return true
        }

        return false
    }

    return true
}

export const initdef_new_stylemap = function <ChildPoint, Init>(params: Params<ChildPoint, Init>): InitDef<Point<ChildPoint>> {
    const { properties: properties_src, init: init_src } = params

    return {
        initapi: inputdef_new_pipe(
            inputdef_new_merge([properties_src, init_src] as const),

            ([properties, init]) => ({
                init: () => {
                    return object_new_map(properties, transvalue => {
                        return object_new_map(transvalue, transinstance => {
                            return init.point_new(transinstance.init)
                        })
                    })
                },

                changed: ipoint => {
                    const ipoint_props = Object.keys(ipoint)

                    // if amount of props did not change
                    if (Object.keys(properties).length === ipoint_props.length) {
                        for (const ipoint_prop of ipoint_props) {
                            const ipoint_map = ipoint[ipoint_prop]!
                            const properties_map = properties[ipoint_prop]

                            if (!properties_map || changed_new_map({ init, ipoint_map, properties_map })) {
                                continue
                            }

                            return true
                        }

                        return false
                    }

                    return true
                },

                next: (ipoint, lpoint) => {
                    let change = false

                    const update_ipoint: Point<ChildPoint> = {}
                    const update_lpoint: Point<ChildPoint> = {}

                    const properties_keys = Object.keys(properties)

                    // if amount of properties changed - mark as changed
                    if (Object.keys(ipoint).length !== properties_keys.length) {
                        change = true
                    }

                    // iterate and compare each property
                    for (const properties_key of properties_keys) {
                        update_ipoint[properties_key] = {}
                        update_lpoint[properties_key] = {}

                        const lpoint_map = lpoint[properties_key]
                        const ipoint_map = ipoint[properties_key]
                        const properties_map = properties[properties_key]!
                        const update_ipoint_map = update_ipoint[properties_key]!
                        const update_lpoint_map = update_lpoint[properties_key]!

                        // if no property set on initial map - mark changed and setup continuation
                        if (!ipoint_map) {
                            change = true

                            const src_prop_keys = Object.keys(properties_map)

                            for (const src_prop_key of src_prop_keys) {
                                const point = init.point_new(properties_map[src_prop_key]!.init)

                                update_ipoint[properties_key]![src_prop_key] = point
                                update_lpoint[properties_key]![src_prop_key] = point
                            }

                            continue
                        }

                        const properties_map_keys = Object.keys(properties_map)

                        // if amount of property children changed - mark change as true
                        if (properties_map_keys.length !== Object.keys(ipoint_map).length) {
                            change = true
                        }

                        // compare each member of property map and setup continuation
                        for (const properties_map_key of properties_map_keys) {
                            const ipoint_map_point = ipoint_map[properties_map_key]
                            const properties_map_point = init.point_new(properties_map[properties_map_key]!.init)

                            // if not present on ipoint - mark change and add definition
                            if (!ipoint_map_point) {
                                change = true

                                update_ipoint_map[properties_map_key] = properties_map_point
                                update_lpoint_map[properties_map_key] = properties_map_point

                                continue
                            }

                            // if point did not change - setup continuation without restart
                            if (init.point_eq(properties_map_point, ipoint_map_point)) {
                                update_ipoint_map[properties_map_key] = properties_map_point
                                // bang lpoint_map under an assumption lpoint will have the same structure as ipoint
                                update_lpoint_map[properties_map_key] = lpoint_map![properties_map_key]!

                                continue
                            }

                            // if point did change - restart
                            {
                                change = true

                                update_ipoint[properties_key]![properties_map_key] = properties_map_point
                                update_lpoint[properties_key]![properties_map_key] = properties_map_point

                                continue
                            }
                        }
                    }

                    return {
                        change,

                        ipoint: update_ipoint,
                        lpoint: update_lpoint
                    }
                }
            })
        )
    }
}
