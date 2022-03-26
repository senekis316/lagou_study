const PENDING = 'pending'
const FULFILLED = 'fullfilled'
const REJECTED = 'rejected'

class MyPromise {
    constructor (executor) {
        try {
            executor(this.resolve, this.reject)
        } catch(e) {
            this.reject(e)
        }
    }
    status = PENDING
    value = undefined
    reason = undefined
    successCallback = []
    failCallback = []
    resolve = value => {
        if (this.status != PENDING) return
        this.status = FULFILLED
        this.value = value
        while (this.successCallback.length) {
            this.successCallback.shift()()
        }
    }
    reject = reason => {
        if (this.status != PENDING) return
        this.status = REJECTED
        this.reason = reason
        while (this.failCallback.length) {
            this.failCallback.shift()()
        }
    }
    then (successCallback, failCallback) {
        successCallback = successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback : reason => { throw reason }
        let promise = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let res = successCallback(this.value)
                        resolvePromise(promise, res, resolve, reject)
                    } catch (e) {
                        reject(e)
                    } 
                }, 0)
            } else if (this.status === REJECTED){
                setTimeout(() => {
                    try {
                        let res = failCallback(this.reason)
                        resolvePromise(promise, res, resolve, reject)
                    } catch (e) {
                        reject(e)
                    } 
                }, 0)
            } else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let res = successCallback(this.value)
                            resolvePromise(promise, res, resolve, reject)
                        } catch (e) {
                            reject(e)
                        } 
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let res = failCallback(this.reason)
                            resolvePromise(promise, res, resolve, reject)
                        } catch (e) {
                            reject(e)
                        } 
                    }, 0)
                })
            }
        })
        return promise
    }
    finally (callback) {
        return this.then(value => { 
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    } 
    catch (failCallback) {
        return this.then(undefined, failCallback)
    }
    static all (array) {
        let result = []
        let index = 0
        function addData (key, value) {
            result[key] = value
            index++
            if (index === array.length) {
                resolve(result);
            }
        }
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < array.length; i++) {
                let current = array[i]
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), reason => reject(reason))
                } else {    
                    addData(i, array[i])
                }
            }
        })
    }
    static resolve (value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }
}

function resolvePromise(promise, value, resolve, reject) {
    if (promise === value) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (value instanceof MyPromise) {
        value.then(resolve, reject)
    } else {
        resolve(value)
    }
}

function other() {
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('p1')
        }, 2000)
    })
}

let promise = new MyPromise((resolve, reject) => {
    reject('失败')
})

//MyPromise.resolve(100).then(value => console.log(value))

promise.finally(() => {
    console.log('finally')
    return other()
})
.then(value => console.log(value), 
reason => console.log(reason))
.catch(reason => console.log(reason))






