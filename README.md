# Introduction

Yzal (Lazy written backwards) is a function that allows you to implement complete computation dependency trees with little effort.
It acts a bit like a "lazy" spreadsheet in that if a value C depends on A and B, C will only get calculated on first call or 
if B or C have changed.

# Installation

    npm i --save yzal

# Example

```js

let lazy = require('yzal')

let foo = {a:1, b:2},
    bar = {a:5, b:3}

let a = lazy({
	      deps: () => [foo.a, bar.a],
		  calc: (x, y) => x + y   // Some long computation
	    }),

	b = lazy({
	      deps: () => [foo.b, bar.b],
		  calc: (x, y) => x * y   // Some long computation
		}),

	c = lazy({
		  deps: () => [a(), b()],  // Lazy dependencies!
		  calc: (a,b) => ({a, b})  // Another long computation
		})

// Will compute a,b then c
console.log('c=', c())    

// Will used cached value for c
console.log('c=', c())

// Will re-compute a then c
foo.a = 3
console.log('c=', c())

```

# Strict Mode

In normal mode, dependencies are compared using deep equality. This can be wastefull
and expensive if the source data is very large. Ideally, you are using immutable
source, which can be compared using === instead.

## Example

```js

let someHugeArray = [...]

let c = lazy({
	      deps: () => someHugeArray,
		  calc: (arr) => arr.reduce((acc, val) => { /* some expensive function */ }, {}),
		  strict: true
	    }),

// Will compute c
console.log('c=', c())    

// Will used cached value for c because
// reference to someHugeArray has not changed
someHugeArray[0] = 0
someHugeArray[123456] = 0
console.log('c=', c())

// Will re-compute c because the reference has changed
someHugeArray = [...someHugeArray]
console.log('c=', c())




# License

The MIT License (MIT)

Copyright (c) 2015 Eric Methot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
	