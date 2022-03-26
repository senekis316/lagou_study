function concat (str) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(str), 10))
}

concat('hello')
    .then(str => concat(str + ' lagou'))
    .then(str => concat(str + ' I ❤️ u'))
    .then(str => console.log(str))

// --------------------------------------------------------------------------------

const fp = require('lodash/fp')

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

//练习1:
fp.flowRight(fp.prop('in_stock'), fp.last)

//练习2:
fp.flowRight(fp.prop('name'), fp.first)

//练习3:
let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
fp.flowRight(_average, fp.map(car => car.dollar_value))

//练习4:
var names = ['Hello World', 'Hello Yuansheng']
let _underscore = fp.replace(/\W+/g, '_')
let sanitizeName = fp.flowRight(fp.map(_underscore), fp.map(fp.toLower))

//----------------------------------------------------

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
        return this.isNothing() ? this : Maybe.of(fn(this._value))
    }
}

// 练习1:
let maybe = Maybe.of([5, 6, 1])
let ex1 = (num) => fp.map(fp.add(num));
console.log(maybe.map(ex1(2)))

// 练习2:
let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
let ex2 = (xs) => xs.map(fp.first)._value
console.log(ex2(xs))

// 练习3:
let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Alert' }
let ex3 = (key, value) => fp.first(safeProp(key, value)._value)
console.log(ex3('name', user))

// 练习4:
let ex4 = num => Maybe.of(num).map(parseInt)
console.log(ex4(2))







