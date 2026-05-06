import { CmpMoiton_LayoutCtx } from "#src/motion/layout/component/ctx.js"
import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import type { Motion_Layout_Def } from "#src/motion/layout/type/def.js"
import type { Motion_Layout_Id } from "#src/motion/layout/type/id.js"
import * as sc from "@qyu/signal-core"
import * as r from "react"

const position_new = function(element_id: Motion_Layout_Id) {
    return sc.osignal_new_pipe(
        sc.osignal_new_memo(sc.osignal_new_pipeflat(
            element_id.snapshot,
            self_snapshot => {
                if (self_snapshot) {
                    const parent = self_snapshot.parent_context

                    if (parent) {
                        const parent_snapshot = self_snapshot.parent_context.snapshot.output()

                        if (parent_snapshot) {
                            return sc.osignal_new_pipe(
                                sc.osignal_new_mergemap({
                                    self_translate_left: element_id.transforms.left,
                                    self_translate_top: element_id.transforms.top,

                                    parent_statics: parent.statics,
                                    parent_scale: parent.accumulator.scale,
                                    parent_position: parent.accumulator.position,
                                } as const),
                                payload => ({
                                    kind: "child" as const,

                                    payload,
                                    self_snapshot,
                                    parent_snapshot: parent_snapshot
                                } as const)
                            )
                        }
                    }

                    return sc.osignal_new_pipe(
                        sc.osignal_new_mergemap({
                            self_translate_left: element_id.transforms.left,
                            self_translate_top: element_id.transforms.top,
                        } as const),
                        payload => ({
                            kind: "isolated" as const,

                            payload,
                            self_snapshot,
                        } as const)
                    )
                }

                return null
            }
        ), null),
        state => {
            if (state === null) {
                return {
                    left: 0,
                    top: 0,
                }
            }

            switch (state.kind) {
                case "child":
                    return {
                        left: (
                            + state.payload.parent_position.left
                            + (
                                + state.self_snapshot.dimensions.left
                                + state.payload.self_translate_left
                                - state.parent_snapshot.dimensions.left
                            ) * Math.exp(state.payload.parent_scale.width)
                        ),

                        top: (
                            + state.payload.parent_position.top
                            + (
                                + state.self_snapshot.dimensions.top
                                + state.payload.self_translate_top
                                - state.parent_snapshot.dimensions.top
                            ) * Math.exp(state.payload.parent_scale.height)
                        ),
                    }
                case "isolated":
                    return {
                        left: state.self_snapshot.dimensions.left + state.payload.self_translate_left,
                        top: state.self_snapshot.dimensions.top + state.payload.self_translate_top,
                    }
            }
        },
    )
}

export const useMotionLayoutCtxState = function(layout_def: Motion_Layout_Def, ref: () => HTMLElement | null) {
    const parent_context = r.useContext(CmpMoiton_LayoutCtx)

    return r.useMemo<Motion_Layout_CtxState | null>(() => {
        switch (layout_def.kind) {
            case "none":
                return null
            case "static":
                return {
                    ref: ref,
                    snapshot: layout_def.id.snapshot,

                    statics: sc.osignal_new_pipe(
                        sc.osignal_new_pipeflat(
                            layout_def.id.snapshot,
                            snapshot => snapshot?.parent_context?.statics ?? null
                        ),
                        parent_statics => {
                            if (parent_statics) {
                                return {
                                    scale: {
                                        width: parent_statics.scale.width + layout_def.scale.x,
                                        height: parent_statics.scale.height + layout_def.scale.y,
                                    }
                                }
                            }

                            return {
                                scale: {
                                    width: layout_def.scale.x,
                                    height: layout_def.scale.y,
                                }
                            }
                        }
                    ),

                    accumulator: {
                        position: position_new(layout_def.id),

                        scale: (parent_context?.accumulator.scale
                            ? sc.osignal_new_pipe(
                                parent_context?.accumulator.scale,
                                parent_scale => {
                                    return {
                                        width: layout_def.scale.x + parent_scale.width,
                                        height: layout_def.scale.y + parent_scale.height,
                                    }
                                }
                            )
                            : sc.signal_new_value({
                                width: layout_def.scale.x,
                                height: layout_def.scale.y,
                            })
                        ),
                    },
                }
            case "normalize":
                return {
                    ref: ref,
                    snapshot: layout_def.id.snapshot,

                    statics: sc.osignal_new_pipeflat(
                        layout_def.id.snapshot,
                        snapshot => snapshot?.parent_context?.statics ?? null
                    ),

                    accumulator: {
                        position: position_new(layout_def.id),

                        scale: sc.osignal_new_pipe(
                            sc.osignal_new_pipeflat(
                                layout_def.id.snapshot,
                                snapshot => snapshot?.parent_context?.statics ?? null
                            ),
                            statics => {
                                if (statics) {
                                    return statics.scale
                                }

                                return {
                                    width: 0,
                                    height: 0,
                                }
                            }
                        ),
                    },
                }
            case "track":
                return {
                    ref: ref,
                    snapshot: layout_def.id.snapshot,

                    statics: sc.osignal_new_pipeflat(
                        layout_def.id.snapshot,
                        snapshot => snapshot?.parent_context?.statics ?? null
                    ),

                    accumulator: {
                        position: position_new(layout_def.id),

                        scale: sc.osignal_new_pipe(
                            sc.osignal_new_memo(sc.osignal_new_pipeflat(
                                layout_def.id.snapshot,
                                self_snapshot => {
                                    if (self_snapshot) {
                                        const parent = self_snapshot.parent_context

                                        if (parent) {
                                            return sc.osignal_new_pipe(
                                                sc.osignal_new_mergemap({
                                                    self_scale_width: layout_def.id.transforms.width,
                                                    self_scale_height: layout_def.id.transforms.height,

                                                    parent_scale: parent.accumulator.scale,
                                                } as const),
                                                payload => ({
                                                    kind: "child" as const,

                                                    payload,
                                                } as const)
                                            )
                                        }

                                        return sc.osignal_new_pipe(
                                            sc.osignal_new_mergemap({
                                                self_scale_width: layout_def.id.transforms.width,
                                                self_scale_height: layout_def.id.transforms.height,
                                            } as const),
                                            payload => ({
                                                kind: "isolated" as const,

                                                payload,
                                            } as const)
                                        )
                                    }

                                    return null
                                }
                            ), null),
                            state => {
                                if (state === null) {
                                    return {
                                        width: 0,
                                        height: 0,
                                    }
                                }

                                switch (state.kind) {
                                    case "child":
                                        return {
                                            width: state.payload.self_scale_width + state.payload.parent_scale.width,
                                            height: state.payload.self_scale_height + state.payload.parent_scale.height,
                                        }
                                    case "isolated":
                                        return {
                                            width: state.payload.self_scale_width,
                                            height: state.payload.self_scale_height,
                                        }
                                }
                            },
                        ),
                    },
                }
        }
    }, [layout_def.kind, layout_def.kind !== "none" && layout_def.id, parent_context])
}
