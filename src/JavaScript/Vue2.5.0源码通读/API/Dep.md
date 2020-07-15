# Dep

一个`Dep`实例是一个可观察的对象，可以有多个订阅它的指令。

## 类方法

### target: ?Watcher

当前正在评估（evaluated）的目标观察者。这在全局范围内是唯一的，因为随时可能有且只有一位观察者受到评估。

默认值为`null`。

## 类内部变量

### uid: number

用于对`Dep`的`id`属性自增。

### targetStack: Array\<Watcher>

存储需要评估的目标观察者。

## 属性

### id: number

自增属性。这个属性是唯一标识符，整个网页中的所有`Dep`实例的`id`均不一样。

### sub: Array\<Watcher>

默认值为`[]`。

## 方法

### addSub(sub: Watcher)

```javascript
addSub (sub: Watcher) {
    this.subs.push(sub) // 添加一个观察者
}
```



### removeSub(sub: Watcher)

```javascript
removeSub (sub: Watcher) {
    remove(this.subs, sub) // 删除一个观察者
}
```



### depend()

```javascript
depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
}
```



### notify()

触发更新通知。

```javascript
notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
    }
}
```



## 操作Dep类的方法

### pushTarget(_target: Watcher)

```javascript
function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target) // 如果当前有正在评估的目标观察者，那么就将_target推入栈中。
  Dep.target = _target // 并将_target放到开始评估的位置。
}
```

### function popTarget()

```javascript
function popTarget () {
  Dep.target = targetStack.pop() // 从栈顶获取一个目标观察者
}
```



