import { DurationEstimator } from '../src'

const EPSILON = 90

function task(
  duration: number,
  callback: (progress: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const time = performance.now()

    const tick = () => {
      const progress = Math.min(1, (performance.now() - time) / duration)
      Math.random() <= Math.random() && callback(progress)
      progress === 1 ?  resolve() : requestAnimationFrame(tick)
    }

    tick()
  })
}

test('estimates correct remaining time for arbitrary tasks', async () => {
  const [estimator] = await Promise.all(new Array(10).fill(0).map(async () => {
    const estimator = new DurationEstimator()
    const duration = Math.random() * 500 + 500

    // First estimation always returns infinity
    expect(estimator.estimate(0)).toBe(Infinity)

    await task(duration, (progress) => {
      const estimation = estimator.estimate(progress)

      if (estimator.samples.length < estimator.length) return

      const delta = Math.abs(estimation - (1 - progress) * duration)
      expect(delta).toBeLessThanOrEqual(EPSILON)
    })

    // Last estimation should return 0
    expect(estimator.estimate(1)).toBe(0)

    return estimator
  }))

  estimator.reset()

  expect(estimator.progress).toBe(0)
  expect(estimator.time).toBe(undefined)
  expect(estimator.samples.length).toBe(0)
})
