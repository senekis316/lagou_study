const todos = {
    life: ['吃饭','睡觉','打豆豆'],
    learn: ['语文','数学','外语'],
    work: ['喝茶'],
    [Symbol.iterator]: function * () {
        const all = [...this.life, ...this.learn, ...this.work]
        for (const item of all) {
            yield item
        }
    }
}

for (const item of todos) {
    console.log(item)
}
