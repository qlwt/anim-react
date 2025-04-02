import * as s from "@qyu/signal-core"

export enum InputDef_type {
    Static,
    Dynamic
}

interface Template_InputDef<Type extends InputDef_type> {
    readonly type: Type
}

interface Template_InputDefDynamic<T> extends Template_InputDef<InputDef_type.Dynamic> {
    readonly value: s.OSignal<T>
}

interface Template_InputDefStatic<T> extends Template_InputDef<InputDef_type.Static> {
    readonly value: () => T
}

export type InputDef_Dynamic<T = any> = Template_InputDefDynamic<T>
export type InputDef_Static<T = any> = Template_InputDefStatic<T>

export type InputDef<T = any> = (
    | InputDef_Dynamic<T>
    | InputDef_Static<T>
)
