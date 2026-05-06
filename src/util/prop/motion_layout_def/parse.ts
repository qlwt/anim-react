import type { Motion_Layout_AnimConfig, Motion_Layout_Def, Motion_Layout_DefStatic_Scale, Motion_Layout_Origin } from "#src/motion/layout/type/def.js"
import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js"
import { motion__layout_id_new_global } from "#src/motion/layout/util/id/new/global.js"
import type { PropMotionLayoutDef_Raw, PropMotionLayoutDef_Origin, PropMotionLayoutDef_Scale, PropMotionLayoutDef_Scale_Object } from "#src/util/prop/motion_layout_def/type/raw.js"

const fallback_origin: Motion_Layout_Origin = { x: 0.5, y: 0.5 }
const fallback_scale: Motion_Layout_DefStatic_Scale = { x: 1, y: 1 }

const fallback_anim_scale_config: Motion_Layout_AnimConfig = {
    dampratio: 1,
    natfreq: 1e-2,

    precision: {
        velocity: 1e-3,
        displacement: 1e-3,
    },
}

const fallback_anim_translate_config: Motion_Layout_AnimConfig = {
    dampratio: 1,
    natfreq: 1e-2,
}

const id_new_auto = function(id: string | Motion_Layout_Id | undefined | null, id_new: () => Motion_Layout_Id): Motion_Layout_Id {
    if (typeof id === "string") {
        return motion__layout_id_new_global(id)
    }

    if (id) {
        return id
    }

    return id_new()
}

const origin_parse = function(origin_raw: PropMotionLayoutDef_Origin | undefined | null): Motion_Layout_Origin {
    if (typeof origin_raw === "number") {
        return { x: origin_raw, y: origin_raw, }
    }

    if (origin_raw) {
        return {
            ...fallback_origin,
            ...origin_raw,
        }
    }

    return fallback_origin
}

const scale_parse = function(scale_raw: PropMotionLayoutDef_Scale | undefined | null): Motion_Layout_DefStatic_Scale {
    if (typeof scale_raw === "number") {
        const scale_log = Math.log(scale_raw)

        return {
            x: scale_log,
            y: scale_log,
        }
    }

    if (scale_raw) {
        return {
            x: Math.log((scale_raw as PropMotionLayoutDef_Scale_Object).x ?? fallback_scale.x),
            y: Math.log((scale_raw as PropMotionLayoutDef_Scale_Object).x ?? fallback_scale.y),
        }
    }

    return fallback_scale
}

export type PropMotionLayoutDef_Parse_Params = {
    readonly raw: PropMotionLayoutDef_Raw
    readonly id_new: () => Motion_Layout_Id
}

export const prop_motion_layout_def_parse = function(params: PropMotionLayoutDef_Parse_Params): Motion_Layout_Def {
    if (!params.raw) {
        return { kind: "none" }
    }

    if (params.raw === true || params.raw === "track") {
        return {
            kind: "track",
            id: params.id_new(),
            origin: fallback_origin,

            anim_scale_config: fallback_anim_scale_config,
            anim_translate_config: fallback_anim_translate_config,
        } satisfies Motion_Layout_Def
    }

    switch (params.raw) {
        case "normalize":
            return {
                kind: params.raw,
                id: params.id_new(),
                origin: fallback_origin,

                anim_scale_config: fallback_anim_scale_config,
                anim_translate_config: fallback_anim_translate_config,
            } satisfies Motion_Layout_Def
        case "none":
            return {
                kind: "none"
            }
    }

    switch (params.raw.kind) {
        case "none":
            return params.raw satisfies Motion_Layout_Def
        case "track":
            return {
                kind: params.raw.kind,
                origin: origin_parse(params.raw.origin),
                id: id_new_auto(params.raw.id, params.id_new),

                anim_scale_config: params.raw.anim_scale_config ?? fallback_anim_scale_config,
                anim_translate_config: params.raw.anim_translate_config ?? fallback_anim_translate_config,
            } satisfies Motion_Layout_Def
        case "normalize":
            return {
                kind: params.raw.kind,
                origin: origin_parse(params.raw.origin),
                id: id_new_auto(params.raw.id, params.id_new),

                anim_scale_config: params.raw.anim_scale_config ?? fallback_anim_scale_config,
                anim_translate_config: params.raw.anim_translate_config ?? fallback_anim_translate_config,
            } satisfies Motion_Layout_Def
        case "static":
            return {
                kind: params.raw.kind,
                scale: scale_parse(params.raw.scale),
                id: id_new_auto(params.raw.id, params.id_new),
            } satisfies Motion_Layout_Def
    }
}
