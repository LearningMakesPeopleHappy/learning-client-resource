# VNode

## 构造函数

```javascript
constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.functionalContext = undefined
    this.functionalOptions = undefined
    this.functionalScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
}
```



## 属性

### tag: string | void

###  data: VNodeData | void

###  children: ?Array\<VNode>

###  text: string | void

###  elm: Node | void

###  ns: string | void

###  context: Component | void

在此组件的范围内渲染。

###  key: string | number | void

###  componentOptions: VNodeComponentOptions | void

###  componentInstance: Component | void

组件实例。

###  parent: VNode | void

组件占位节点

###  raw: boolean

【内部】包含原始HTML？ （仅服务器）

###  isStatic: boolean

【内部】悬挂的静态节点。

###  isRootInsert: boolean

【内部】输入过渡检查所必需

###  isComment: boolean

【内部】空解释占位符？

 ### isCloned: boolean

【内部】是克隆的节点？

###  isOnce: boolean

【内部】是一个v-once节点？

###  asyncFactory: Function | void

【内部】异步组件工厂函数。

###  asyncMeta: Object | void

【内部】

###  isAsyncPlaceholder: boolean

【内部】

###  ssrContext: Object | void

【内部】

###  functionalContext: Component | void

【内部】功能节点的真实上下文vm

###  functionalOptions: ?ComponentOptions

【内部】用于SSR缓存

###  functionalScopeId: ?string

【内部】功能范围ID支持

## 操作VNode的方法

### createEmptyVNode(text: string = ''): VNode

创建一个空的VNode。

```javascript
const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```

### createTextVNode(val: string | number): VNode

创建一个文本VNode。

```javascript
function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```

### cloneVNode(vnode: VNode, deep?: boolean): VNode

优化的浅拷贝。

用于静态节点和插槽节点，因为它们可以在多个渲染中重复使用，拷贝它们可以避免在DOM操作依赖于它们的elm引用时出错。

```javascript
/**
 * 优化的浅拷贝。
 * 用于静态节点和插槽节点，因为它们可以在多个渲染中重复使用，拷贝它们可以避免在DOM操作依赖于它们的elm引用时出错。
 * @param {*} vnode 虚拟DOM
 * @param {*} deep 是否深拷贝
 */
function cloneVNode (vnode: VNode, deep?: boolean): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.isCloned = true
  if (deep && vnode.children) {
    cloned.children = cloneVNodes(vnode.children)
  }
  return cloned
}
```

### cloneVNodes(vnodes: Array\<VNode>, deep?: boolean): Array\<VNode>

批量拷贝VNode。

```javascript
function cloneVNodes (vnodes: Array<VNode>, deep?: boolean): Array<VNode> {
  const len = vnodes.length
  const res = new Array(len)
  for (let i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep)
  }
  return res
}
```

