'use strict'

let expect = require('expect.js'),
    lazy   = require('./index.js')


describe('yzal', () => {

    // ----------------------------------------------------------------
    // Strict
    // ----------------------------------------------------------------

	describe('in strict mode (using ===)', () => {

		it('should compute the value only once', done => {

			let [count, x, y] = [0, 3, 5]

			let a = lazy({
				deps: () => [x, y],
				calc:  k => { count++; return x+y },
				strict: true
			})

			let value1 = a(),
			    value2 = a()

			expect(value1).to.equal(8)
			expect(value2).to.equal(8)
			expect(count).to.equal(1)

			done()
		})

		it('should not re-compute the value if the references have not changed', done => {

			let [count, x, y] = [0, {value:3}, {value:5}]

			let a = lazy({
				deps: () => [x, y],
				calc:  k => { count++; return x.value + y.value },
				strict: true
			})

			let value1 = a()
			x.value = 99
			let value2 = a()

			expect(value1).to.equal(8)
			expect(value2).to.equal(8)
			expect(count).to.equal(1)

			done()
		})

		it('should re-compute the value if the references have changed', done => {

			let [count, x, y] = [0, {value:3}, {value:5}]

			let a = lazy({
				deps: () => [x, y],
				calc:  k => { count++; return x.value + y.value },
				strict: true
			})

			let value1 = a()
			x = {value:3}
			let value2 = a()

			expect(value1).to.equal(8)
			expect(value2).to.equal(8)
			expect(count).to.equal(2)

			done()
		})

		it('should compute deep lazy dependencies correctly', done => {

			let [count, x, y, z] = [0, 3, 5, 7]

			let a = lazy({
				deps: () => [x, y],
				calc: (x, y) => { count++; return x + y },
				strict: true
			})

			let b = lazy({
				deps: () => [x, z],
				calc: (x, y) => { count++; return x * z },
				strict: true
			})

			let c = lazy({
				deps: () => [a(), b()],
				calc: (a, b) => { count++; return a + b },
				strict: true
			})

			let value1 = c()
			expect(value1).to.equal(29)
			expect(count).to.equal(3)

            y = 0
            value1 = c()
            expect(value1).to.equal(24)
            expect(count).to.equal(5)

			done()
		})
	})



    // ----------------------------------------------------------------
    // Loose
    // ----------------------------------------------------------------

	describe('in loose mode (uses "deep" equality)', () => {

		it('should compute the value only once', done => {

			let [count, x, y] = [0, [1,2,3], [4,5,6]]

			let a = lazy({
				deps: () => [x, y],
				calc:  k => { count++; return [...x, ...y] }
			})

			let value1 = a(),
			    value2 = a()

			expect(value1).to.eql([1,2,3,4,5,6])
			expect(value2).to.eql([1,2,3,4,5,6])
			expect(count).to.equal(1)

			done()
		})

		it('should re-compute the value when values have changed but not the reference', done => {

			let [count, x, y] = [0, [1,2,3], [4,5,6]]

			let a = lazy({
				deps: () => { return [x, y]},
				calc:  k => { count++; return [...x, ...y] }
			})

			let value1 = a()
			x[1] = 99
			let value2 = a()

			expect(value1).to.eql([1,2,3,4,5,6])
			expect(value2).to.eql([1,99,3,4,5,6])
			expect(count).to.equal(2)

			done()
		})

		it('should not re-compute the value when the reference has changed but not the values', done => {

			let [count, x, y] = [0, [1,2,3], [4,5,6]]

			let a = lazy({
				deps: () => [x, y],
				calc:  k => { count++; return [...x, ...y] }
			})

			let value1 = a()
			x = [1,2,3]
			let value2 = a()

			expect(value1).to.eql([1,2,3,4,5,6])
			expect(value2).to.eql([1,2,3,4,5,6])
			expect(count).to.equal(1)

			done()
		})

		it('should compute deep lazy dependencies correctly', done => {

			let [count, x, y, z] = [0, [1,2,3], [4,5,6], [7,8,9]]

			let a = lazy({
				deps: () => [x, y],
				calc: (x, y) => { count++; return [...x, ...y] },
			})

			let b = lazy({
				deps: () => [x, z],
				calc: (x, y) => { count++; return [...x, ...z] },
			})

			let c = lazy({
				deps: () => [a(), b()],
				calc: (a, b) => { count++; return [...a, ...b] },
			})

			let value1 = c()
			expect(value1).to.eql([1,2,3,4,5,6,1,2,3,7,8,9])
			expect(count).to.equal(3)

            x[0] = 99
            value1 = c()
            expect(value1).to.eql([99,2,3,4,5,6,99,2,3,7,8,9])
            expect(count).to.equal(6)

			done()
		})
	})	
})