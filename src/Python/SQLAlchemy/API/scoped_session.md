# scoped_session类

提供Session对象的作用域管理。

有关教程，请参见[上下文/本地线程Session]()。

## 方法

### \_\_call\_\_(**kw)

返回当前Session，如果不存在，则使用`scoped_session.session_factory`创建它。

**参数**

* **\*\*kw** - 如果不存在现有的Session，则`kw`参数将传递给`scoped_session.session_factory`可调用对象。如果存在`Session`并传递了`kw`参数，则会引发`InvalidRequestError`。

### \_\_init\_\_(session_factory, scopefunc)

构造一个新的`scoped_session`。

**参数**

* **session_factory** - 创建新的Session实例的工厂对象。 这通常是（但不一定是）`sessionmaker`的实例。
* **scopefunc=None** - 可选函数，用于定义当前范围。 如果未传递，`scoped_session`对象将采用“thread-local”作用域，并将使用Python的`threading.local()`来维护当前`Session`。如果传递，该函数应返回可哈希的令牌；此令牌将用作字典中的键，以便存储和检索当前`Session`。

### configure(**kwargs)

重新配置此`scoped_session`使用的`sessionmaker`。

参见`sessionmaker.configure()`。

### query_property(query_cls)

返回一个类属性，该属性会在调用时针对该类和当前`Session`生成一个`Query`对象。

例如：

```python
Session = scoped_session(sessionmaker())

class MyClass(object):
    query = Session.query_property()

# after mappers are defined
result = MyClass.query.filter(MyClass.name=='foo').all()
```

默认情况下提供的是`Session`的配置查询类的实例。要覆盖和使用自定义实现，请提供一个可调用的`query_cls`。 该可调用对象将以该类的映射器作为位置参数和Session关键字参数进行调用。

对放置在类上的查询属性的数量没有限制。

### remove()

释放当前`Session`（如果存在）。

这将首先在当前`Session`上调用`Session.close()`方法，该方法释放后仍然保留所有现有的事务/连接资源；具体来说，transactions会回滚。`Session`然后被释放。 在同一范围内再次使用时，`scoped_session`将产生一个新的`Session对象`。

## 属性

### session_factory = None

提供给`__init__`的`session_factory`存储在此属性中，以后可以访问。 当需要新的非作用域的`Session`或与数据库的`Connection`时，这很有用。

