import type { Motion_Layout_CtxState } from "#src/motion/layout/type/ctx.js"
import * as r from "react"

export const CmpMoiton_LayoutCtx = r.createContext<Motion_Layout_CtxState | null>(null)
