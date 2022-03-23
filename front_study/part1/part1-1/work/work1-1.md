1.谈谈你是如何理解 JS 异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务?

(1) JS的异步编程, 本质上使用了浏览器的多线程, 实现了多任务的并行执行

(2) EventLoop是JS中的事件循环机制, JS会通过EventLoop去监听消息队列, 将消息队列中的任务按顺序进行执行

(3) 消息队列用于存放异步任务的地方, 同步代码执行完成后, EventLoop会从消息队列中取出任务进行执行.

(4) 异步任务可以分为微任务和宏任务, 微任务可以在被创建后, 直接开始执行, 而宏任务被创建后, 必须放入事件队列的末尾, 排队执行.
目前绝大多数异步调用都是作为宏任务进行调度执行的, 而JS中的Promise & MutationObserver, Node中的process.nextTick会作为微任务进行调度执行.


2.将下面异步代码使用Promise方式改进

setTimeout(function() {
    var a = 'hello'
    setTimeout(function () {
        var b = 'lagou'
        setTimeout(function () {
            var c = 'I ❤️ u'
            console.log(a + b + c)
        }, 10)
    }, 10)
}, 10)

解答:

function concat (str) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(str), 10))
}

concat('hello')
    .then(str => concat(str + ' lagou'))
    .then(str => concat(str + ' I ❤️ u'))
    .then(str => console.log(str))

### 												模块一

#### 函数式编程与JS异步编程、手写Promise

##### 简答题

##### 一、谈谈你是如何理解JS异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？

JS异步编程: JS异步编程, 本质上使用了浏览器的多线程, 实现了多任务的并行执行

EventLoop: 是JS中的事件循环机制, JS会通过EventLoop去监听消息队列, 将消息队列中的任务按顺序进行执行

消息队列: 用于存放异步任务的地方, 同步代码执行完成后, EventLoop会从消息队列中取出任务进行执行.

微任务与宏任务: 异步任务可以分为微任务和宏任务, 微任务可以在被创建后, 直接开始执行, 而宏任务被创建后, 必须放入事件队列的末尾, 排队执行.
目前绝大多数异步调用都是作为宏任务进行调度执行的, 而JS中的Promise & MutationObserver, Node中的process.nextTick会作为微任务进行调度执行.

​		

##### 代码题

#### 一、将下面异步代码使用Promise的方式改进

```javascript
setTimeout(function() {
    var a = 'hello'
    setTimeout(function() {
        var b = 'lagou'
        setTimeout(function() {
            var c = 'I ♥ U'
            console.log(a + b + c)
        }, 10)
    }, 10)
}, 10)
```

```javascript
答：

function concat (str) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(str), 10))
}

concat('hello')
    .then(str => concat(str + ' lagou'))
    .then(str => concat(str + ' I ❤️ u'))
    .then(str => console.log(str))

```



#### 二、基于以下代码完成下面的四个练习

```javascript
const fp = require('lodach/fp')

const cars = [
    {
        name: 'Ferrari FF', 
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: 'Spyker C12 Zagato',
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: 'Jaguar XKR-S',
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false
    },
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true
    },
    {
        name: 'Pagani Huayra',
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false
    },
]
```

#####  练习1：使用函数组合fp.flowRight() 重新实现下面这个函数

```javascript
let isLastInStock = function (cars) {
    // 获取最后一条数据
    let last_car = fplast(cars)
    // 获取最后一条数据的in_stock属性值
    return fp.prop('in_stock', last_car)
}
```
```javascript
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
```



##### 练习2：使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

```javascript
let firstCarName = fp.flowRight(fp.prop('name'), fp.first)
```



##### 练习3：使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现

```javascript
let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
} // <- 无需改动
let averageDollarValue = function (cars) {
    let dollar_values = fp.map(function (car) {
        return car.dollar_value
    }, cars)
    return _average(dollar_values)
}
```

```javascript
let averageDollarValue = fp.flowRight(_average, fp.map(car => car.dollar_value))
```



##### 练习4：使用flowRight写一个sanitizeNames()函数，返回一个下划线的小写字符串，把数组中的name转换为这种形式。例如：

sanitizeNames(["Hello World"]) => ["hello_world"]

```javascript
let _underScore = fp.replace(/\W+/g, '_') // <-- 无需改动，并在sanitizeNames中使用它
```

```javascript
let sanitizeName = fp.flowRight(fp.map(_underscore), fp.map(fp.toLower))
```



#### 三、基于下面提供的代码，完成后续的四个练习

```javascript
// support.js
class Container {
    static of(value) {
        return new Container(value)
    }
    
    constructor(value) {
        this._value = value;
    }
    
    map(fn) {
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of(x) {
        return new Maybe(x)
    }
    
    isNothing() {
        return this._value === null || this._value === undefined
    }
    
    constructor(x) {
        this._value = x
    }
    
    map(fn) {
        return this.isNothing() ? this : Maybe.fo(fn(this._value))
    }
}

module.exports = { Maybe, Container }


```

###### 练习1：使用fp.add(x, y)和fp.map(f, x)创建一个能让functor里的值增加的函数ex1

```javascript
// app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1])
let ex1 = () => {
    // 你需要实现的函数。。。
}
```

```javascript
let ex1 = (num) => fp.map(fp.add(num));
console.log(maybe.map(ex1(2)))
```



###### 练习2：实现一个函数ex2，能够使用fp.fitst获取列表的第一个元素

```javascript
app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let sx = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    // 你需要实现的函数。。。
}
```

```javascript
let ex2 = (xs) => xs.map(fp.first)._value
console.log(ex2(xs))
```



###### 练习3：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母

```javascript
// app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let safeProp = fp.curry(function  (x, o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert'}
let ex3 = () => {
    // 你需要实现的函数。。。
}
```

```javascript
let ex3 = (key, value) => fp.first(safeProp(key, value)._value)
console.log(ex3('name', user))
```



##### 练习4： 使用Maybe重写ex4，不要有if语句

```javascript
// app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let ex4 = function (n) {
    if (n) {
        return parseInt(n)
     }
}
```

```javascript
let ex4 = num => Maybe.of(num).map(parseInt)
console.log(ex4(2))
```



#### 四、手写实现MyPromise源码

##### 要求 ：尽可能还原Promise中的每一个API，并通过注释的方式描述思路和原理。

```javascript
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

module.exports = MyPromise

```



