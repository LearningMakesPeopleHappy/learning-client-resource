# observe

尝试为某个值创建一个观察者实例，如果成功观察到该观察者，则返回新的观察者，如果该值已有一个观察者，则返回现有的观察者。

```javascript
function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) { // 不是对象，或者是虚拟Dom就不创建观察者
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) { // 如果值对象本身就有观察者，那么就使用之前的观察者。
    ob = value.__ob__
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() && // 不是服务端渲染
    (Array.isArray(value) || isPlainObject(value)) && // 是数组或者纯对象
    Object.isExtensible(value) && // 给定的对象是否可以添加新的属性和方法。（识别对象）
    !value._isVue // 不是Vue实例
  ) {
    ob = new Observer(value) // 初始化一个观察者
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

