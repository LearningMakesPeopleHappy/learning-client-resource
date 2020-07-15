# Observer

附加到每个观察对象的Observer类。 附加后，观察者将目标对象的属性键转换为用于收集依赖性并调度更新的getter / setter。

## 构造函数

```javascript
constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this) // 将当前的观察对象设置到值中。
    if (Array.isArray(value)) { // 如果值是数组
        const augment = hasProto // 是否可以使用__proto__
            ? protoAugment
            : copyAugment
        augment(value, arrayMethods, arrayKeys) // 改造一下数组中的方法，使其可以支持响应式。
        this.observeArray(value) // 遍历监听数组的所有元素。
    } else { // 值不是数组
        this.walk(value) // 遍历监听对象的所有属性。
    }
}
```



## 属性

### value: any

当前值。

### dep: Dep

当前观察者的可观察对象。

### vmCount: number

以该对象为根$data的vm数。

## 方法

### walk(obj: Object)

遍历每个属性并将它们转换为getter / setter。 仅当值类型为Object时才应调用此方法。

```javascript
walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i], obj[keys[i]])
    }
}
```

### observeArray(items: Array\<any>)

观察数组中的所有元素。

```javascript
observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i])
    }
}
```

