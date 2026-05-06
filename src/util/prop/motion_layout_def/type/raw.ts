import type { Motion_Layout_AnimConfig } from "#src/motion/layout/type/def.js"
import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js"

export type PropMotionLayoutDef_Scale_Object = {
    readonly x?: number
    readonly y?: number
}

export type PropMotionLayoutDef_Scale = (
    | number
    | PropMotionLayoutDef_Scale_Object
)

export type PropMotionLayoutDef_Origin_Object = {
    readonly x?: number
    readonly y?: number
}

export type PropMotionLayoutDef_Origin = (
    | number
    | PropMotionLayoutDef_Origin_Object
)

export type PropMotionLayoutDef_LayoutNone = {
    readonly kind: "none"
}

export type PropMotionLayoutDef_LayoutNormalize = {
    readonly kind: "normalize"
    readonly id?: Motion_Layout_Id | string
    readonly origin?: PropMotionLayoutDef_Origin
    readonly anim_scale_config?: Motion_Layout_AnimConfig
    readonly anim_translate_config?: Motion_Layout_AnimConfig
}

export type PropMotionLayoutDef_LayoutStatic = {
    readonly kind: "static"
    readonly id?: Motion_Layout_Id | string
    readonly scale: PropMotionLayoutDef_Scale
}

export type PropMotionLayoutDef_LayoutFull = {
    readonly kind: "track"
    readonly id?: Motion_Layout_Id | string
    readonly origin?: PropMotionLayoutDef_Origin
    readonly anim_scale_config?: Motion_Layout_AnimConfig
    readonly anim_translate_config?: Motion_Layout_AnimConfig
}

export type PropMotionLayoutDef_Raw = (
    | boolean
    | null
    | undefined
    | PropMotionLayoutDef_LayoutNone
    | PropMotionLayoutDef_LayoutFull
    | PropMotionLayoutDef_LayoutStatic
    | PropMotionLayoutDef_LayoutNormalize
    | PropMotionLayoutDef_LayoutNone["kind"]
    | PropMotionLayoutDef_LayoutFull["kind"]
    | PropMotionLayoutDef_LayoutNormalize["kind"]
)
