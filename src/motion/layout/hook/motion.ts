import { useMotionLayoutAnim } from "#src/motion/layout/hook/anim.js"
import { useMotionLayoutStyles } from "#src/motion/layout/hook/styles.js"
import { useMotionLayoutUpdate } from "#src/motion/layout/hook/update.js"
import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import type { Motion_Layout_Def } from "#src/motion/layout/type/def.js"
import * as ac from "@qyu/anim-core"
import * as sc from "@qyu/signal-core"
import * as r from "react"

export type UseLayoutMotion_Params = {
    readonly scheduler: ac.FrameScheduler
    readonly element_def: Motion_Layout_Def
    readonly element_ref: () => HTMLElement | null
    readonly element_context: Motion_Layout_CtxState | null
}

export const useMotionLayoutMotion = function (params: UseLayoutMotion_Params) {
    const [anim_restart_signal, anim_restart_fire] = r.useMemo(() => sc.esignal_new_manual(), [])

    useMotionLayoutAnim({
        element_def: params.element_def,
        scheduler: params.scheduler,
        signal_restart: anim_restart_signal
    })

    useMotionLayoutStyles({
        element_def: params.element_def,
        element_ref: params.element_ref,
    })

    useMotionLayoutUpdate({
        element_def: params.element_def,
        element_ref: params.element_ref,
        element_context: params.element_context,
        controls_anim_restart: anim_restart_fire,
    })
}
