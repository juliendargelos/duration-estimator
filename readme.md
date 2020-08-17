# duration-estimator

[![test](https://github.com/juliendargelos/duration-estimator/workflows/test/badge.svg?branch=master)](https://github.com/juliendargelos/duration-estimator/actions?workflow=test)
[![build](https://github.com/juliendargelos/duration-estimator/workflows/build/badge.svg?branch=master)](https://github.com/juliendargelos/duration-estimator/actions?workflow=build)
[![version](https://img.shields.io/github/package-json/v/juliendargelos/duration-estimator)](https://github.com/juliendargelos/duration-estimator)

Agnostic duration estimator for asynchronous tasks. Estimates remaining time using a moving average whose length is configurable.

### Install

Using npm:

```bash
npm install duration-estimator --save
```

Using umd bundle from cdn:

```html
<script src="https://unpkg.com/duration-estimator"></script>
<!-- Globally available as DurationEstimator !-->
```

Using esm bundle from cdn:

```html
<script type="module">
  import { DurationEstimator } from 'https://cdn.skypack.dev/duration-estimator'
</script>
```

### Usage

```typescript
import { DurationEstimator } from 'duration-estimator'

function task (onProgess) {
  // Asynchronous task yielding progress in range 0-1
}

const estimator = new DurationEstimator()

task(progress => console.log(`${estimator.estimate(progress)}ms remaining`))
```

The estimator can be reused after calling `reset()`:

```typescript
estimator.reset() // ready to make estimations for a new task
```

By default, the estimator computes remaining time based on the last 10 samples it got. You can change that by setting the moving average length:

```typescript
new DurationEstimator(20) // Takes the last 20 samples in account
new DurationEstimator(Infinity) // Takes all samples in account
```
