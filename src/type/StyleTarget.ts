export type StyleTarget = {
    readonly style: {
        readonly setProperty: (property: string, value: string | null) => void
    }
}
