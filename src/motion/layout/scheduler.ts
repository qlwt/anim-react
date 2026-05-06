export type Motion_LayoutScheduler = {
    readonly queue_add: (cb: VoidFunction) => void
}

const motion__layout_scheduler_new = function(): Motion_LayoutScheduler {
    let queue = new Array<VoidFunction>()

    const queue_emit = () => {
        const queue_old = queue

        queue = []

        for (let i = queue_old.length - 1; i >= 0; --i) {
            queue_old[i]!()
        }
    }

    return {
        queue_add: cb => {
            queue.push(cb)

            if (queue.length === 1) {
                // was empty
                Promise.resolve().then(queue_emit)
            }
        },
    }
}

export const motion__layout_scheduler = motion__layout_scheduler_new()
