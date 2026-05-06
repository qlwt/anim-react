import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js"
import * as ac from "@qyu/anim-core"

export type Motion_Layout_Origin = {
    readonly x: number,
    readonly y: number
}

export type Motion_Layout_AnimConfig = Omit<ac.AnimNewSpring_Config, "target" | "effect">

export type Motion_Layout_DefTrack = {
    readonly kind: "track"
    readonly id: Motion_Layout_Id
    readonly origin: Motion_Layout_Origin
    readonly anim_scale_config: Motion_Layout_AnimConfig
    readonly anim_translate_config: Motion_Layout_AnimConfig
}

export type Motion_Layout_DefNormalize = {
    readonly kind: "normalize"
    readonly id: Motion_Layout_Id
    readonly origin: Motion_Layout_Origin
    readonly anim_scale_config: Motion_Layout_AnimConfig
    readonly anim_translate_config: Motion_Layout_AnimConfig
}

export type Motion_Layout_DefStatic_Scale = {
    readonly x: number,
    readonly y: number
}

export type Motion_Layout_DefStatic = {
    readonly kind: "static"
    readonly id: Motion_Layout_Id
    readonly scale: Motion_Layout_DefStatic_Scale
}

export type Motion_Layout_DefNone = {
    readonly kind: "none"
}

export type Motion_Layout_Def = (
    | Motion_Layout_DefNone
    | Motion_Layout_DefTrack
    | Motion_Layout_DefStatic
    | Motion_Layout_DefNormalize
)
