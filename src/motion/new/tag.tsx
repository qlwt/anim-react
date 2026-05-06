import type { UseAnimStyleMap_Properties } from "#src/hook/anim/stylemap.js"
import { useAnimStyleMapSpring } from "#src/hook/anim/stylemap_spring.js"
import type { AnimStyleMapSpring_TransInit } from "#src/hook/init/stylemap_spring.js"
import { useInputDynamicSet } from "#src/hook/input/dynamic_set.js"
import type { AnimStyleMapSpring_TransPath, UsePathStyleMapSpring_ConfigDefault } from "#src/hook/path/stylemap_spring.js"
import { useRunAnimInterval } from "#src/hook/run-anim/interval.js"
import { CmpMoiton_LayoutCtx } from "#src/motion/layout/component/ctx.js"
import { useMotionLayoutCtxState } from "#src/motion/layout/hook/ctxstate.js"
import { useMotionLayoutMotion } from "#src/motion/layout/hook/motion.js"
import type { Motion_Layout_Def } from "#src/motion/layout/type/def.js"
import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js"
import { motion__layout_id_new_local } from "#src/motion/layout/util/id/new/local.js"
import { prop_motion_layout_def_deps } from "#src/util/prop/motion_layout_def/deps.js"
import { prop_motion_layout_def_parse } from "#src/util/prop/motion_layout_def/parse.js"
import type { PropMotionLayoutDef_Raw } from "#src/util/prop/motion_layout_def/type/raw.js"
import { useRefMerge } from "#src/util/ref/hook/merge.js"
import * as ac from "@qyu/anim-core"
import * as r from "react"

const useLayoutDef = function(element_layout: PropMotionLayoutDef_Raw): Motion_Layout_Def {
    const id_new_cached = r.useMemo(
        () => {
            let saved: Motion_Layout_Id | null = null

            return () => saved ||= motion__layout_id_new_local()

        },
        // restart every time when layout switches to the one that does not carry an id
        [
            Boolean(element_layout) !== false
            && element_layout !== "none"
            && !(typeof element_layout === "object" && element_layout?.kind === "none")
        ]
    )

    return r.useMemo(() => {
        return prop_motion_layout_def_parse({
            raw: element_layout,
            id_new: id_new_cached,
        })
    }, prop_motion_layout_def_deps(element_layout))
}

export type Motion_NewTag_Props<Tag extends keyof HTMLElementTagNameMap> = (
    & r.JSX.IntrinsicElements[Tag]
    & {
        readonly scheduler?: ac.FrameScheduler
        readonly layout?: PropMotionLayoutDef_Raw
        readonly anim_style_config?: UsePathStyleMapSpring_ConfigDefault
        readonly anim_style?: UseAnimStyleMap_Properties<AnimStyleMapSpring_TransInit, AnimStyleMapSpring_TransPath>
    }
)

const fallback_config: UsePathStyleMapSpring_ConfigDefault = {
    natfreq: 1e-2,
    dampratio: 0.5,
}

export const motion_new_tag = function <Tag extends keyof HTMLElementTagNameMap>(tag: Tag) {
    return r.memo(r.forwardRef<HTMLElementTagNameMap[Tag] | null, Motion_NewTag_Props<Tag>>((props, f_ref) => {
        const l_ref = r.useRef<HTMLElementTagNameMap[Tag] | null>(null)
        const ref = useRefMerge([l_ref, f_ref])

        const layout_def = useLayoutDef(props.layout)
        const ctxstate_layout = useMotionLayoutCtxState(layout_def, r.useCallback(() => l_ref.current, [l_ref]))

        useMotionLayoutMotion({
            element_def: layout_def,
            element_context: ctxstate_layout,
            element_ref: r.useCallback(() => l_ref.current, [l_ref]),
            scheduler: props.scheduler ?? ac.fscheduler_new_universal(),
        })

        useRunAnimInterval({
            spread: true,
            scheduler: props.scheduler,

            src: useAnimStyleMapSpring({
                ref: r.useCallback(() => l_ref.current, []),
                properties: useInputDynamicSet(props.anim_style ?? {}, [props.anim_style]),
                config: useInputDynamicSet(props.anim_style_config ?? fallback_config, [props.anim_style_config]),
            }),
        })

        if (ctxstate_layout) {
            return <CmpMoiton_LayoutCtx.Provider value={ctxstate_layout}>
                {r.createElement(tag, {
                    ...props,

                    ref: ref,
                    layout: undefined,
                    scheduler: undefined,
                    anim_style: undefined,
                    anim_style_config: undefined,
                }, props.children)}
            </CmpMoiton_LayoutCtx.Provider>
        } else {
            return r.createElement(tag, {
                ...props,

                ref: ref,
                layout: undefined,
                scheduler: undefined,
                anim_style: undefined,
                anim_style_config: undefined,
            }, props.children)
        }
    }))
}
