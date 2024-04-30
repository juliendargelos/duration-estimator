export class DurationEstimator {
  public progress: number = 0
  public samples: number[] = []
  public length: number
  public time?: number

  public constructor(length = 10) {
    this.length = length
  }

  public get speed(): number {
    const length = this.samples.length
    return length
      ? this.samples.reduce((speed, sample) => speed + sample) / length
      : 0
  }

  public get estimation(): number {
    return (1 - this.progress) / this.speed
  }

  public reset(): this {
    this.progress = 0
    this.time = undefined
    this.samples.splice(0)
    return this
  }

  public update(progress: number): this {
    if (this.time === undefined) {
      this.progress = progress
      this.time = Date.now()
    } else {
      const delta = Date.now() - this.time

      if (delta) {
        this.time += delta
        this.samples.push((progress - this.progress) / delta)
        this.samples.splice(this.length)
        this.progress = progress
      }
    }

    return this
  }

  public estimate(progress: number): number {
    return this.update(progress).estimation
  }
}
