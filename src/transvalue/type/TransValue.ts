export type TransValue_Instance<Target = any, Init = any, Path = any> = {
    readonly init: Init
    readonly path: Path
    readonly effect: (target: Target) => (state: number) => void
}

export type TransValue<Target = any, Init = any, Path = any> = {
    [K: string]: TransValue_Instance<Target, Init, Path>
}
