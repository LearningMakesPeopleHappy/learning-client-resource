# defineReactive

```javascript
function defineReactive (
  obj: Object, // 要设置新属性的对象
  key: string, // 新属性的名称
  val: any, // 新属性的值
  customSetter?: ?Function, // 自定义setter
  shallow?: boolean // 是否是浅层响应
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key) // 检查一下属性的描述符
  if (property && property.configurable === false) {
    // 如果是不可修改的属性那么就不设置。
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get // 如果之前有定义过属性的getter方法就获取一下
  const setter = property && property.set // 如果之前有定义过属性的setter方法就获取一下

  let childOb = !shallow && observe(val) // 不是浅层响应，并且值是对象就获取一个值的观察者。注意，只有对象才有观察者。
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val // 如果之前有定义过属性的getter方法就先调用一下。
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val // 如果之前有定义过属性的getter方法就先调用一下，获取到旧的值。
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) { // 新旧值相等则不处理
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter() // 调用自定义setter
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal) // 不是浅层响应，并且新值是对象，就拿到它的观察者。
      dep.notify() // 触发更新通知
    }
  })
}
```

