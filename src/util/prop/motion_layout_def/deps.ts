import type { PropMotionLayoutDef_Raw } from "#src/util/prop/motion_layout_def/type/raw.js"

export const prop_motion_layout_def_deps = function(layout: PropMotionLayoutDef_Raw): unknown[] {
    if (typeof layout === "object" && layout !== null) {
        switch (layout.kind) {
            case "none": {
                return [
                    layout.kind,
                    null,
                    null,
                    null,
                    null,
                    null
                ]

                break
            }
            case "track": {
                return [
                    layout.kind,
                    layout.id,
                    typeof layout.origin === "number" ? layout.origin : layout.origin?.x,
                    typeof layout.origin === "number" ? layout.origin : layout.origin?.y,
                    null,
                    null
                ]

                break
            }
            case "normalize": {
                return [
                    layout.kind,
                    layout.id,
                    typeof layout.origin === "number" ? layout.origin : layout.origin?.x,
                    typeof layout.origin === "number" ? layout.origin : layout.origin?.y,
                    null,
                    null
                ]

                break
            }
            case "static": {
                return [
                    layout.kind,
                    layout.id,
                    null,
                    null,
                    typeof layout.scale === "number" ? layout.scale : layout.scale?.x,
                    typeof layout.scale === "number" ? layout.scale : layout.scale?.x,
                ]

                break
            }
        }
    }

    return [
        layout,
        null,
        null,
        null,
        null,
        null
    ]
}
