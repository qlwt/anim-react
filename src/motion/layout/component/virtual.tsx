import { CmpMoiton_LayoutCtx } from "#src/motion/layout/component/ctx.js"
import { useMotionLayoutCtxState } from "#src/motion/layout/hook/ctxstate.js"
import { useMotionLayoutMotion } from "#src/motion/layout/hook/motion.js"
import type { Motion_Layout_Def } from "#src/motion/layout/type/def.js"
import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js"
import { motion__layout_id_new_local } from "#src/motion/layout/util/id/new/local.js"
import { prop_motion_layout_def_deps } from "#src/util/prop/motion_layout_def/deps.js"
import { prop_motion_layout_def_parse } from "#src/util/prop/motion_layout_def/parse.js"
import type { PropMotionLayoutDef_Raw } from "#src/util/prop/motion_layout_def/type/raw.js"
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

export type CmpMotion_LayoutVirtual_Props = {
    readonly scheduler?: ac.FrameScheduler
    readonly layout: PropMotionLayoutDef_Raw
    readonly target: () => HTMLElement | null
    readonly children?: r.ReactNode
}

export const CmpMotion_LayoutVirtual = r.memo<CmpMotion_LayoutVirtual_Props>(props => {
    const layout_def = useLayoutDef(props.layout)
    const ctxstate_layout = useMotionLayoutCtxState(layout_def, props.target)

    useMotionLayoutMotion({
        element_def: layout_def,
        element_ref: props.target,
        element_context: ctxstate_layout,
        scheduler: props.scheduler ?? ac.fscheduler_new_universal(),
    })

    if (ctxstate_layout) {
        return <CmpMoiton_LayoutCtx.Provider value={ctxstate_layout}>
            {props.children}
        </CmpMoiton_LayoutCtx.Provider>
    } else {
        return props.children
    }
})
