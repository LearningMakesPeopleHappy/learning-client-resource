# sessionmaker类

>  基类: `sqlalchemy.orm.session._SessionClassMethods`

可配置的Session工厂类。

`sessionmaker工厂类`在被初始化时会生成新的`Session工厂类`（即`sessionmaker对象`），并根据此处传入的配置参数来创建它们。

例如：

```python
# 全局范围内的，这里Session是一个sessionmaker对象
Session = sessionmaker(autoflush=False)

# 然后，在局部范围内，使用sessionmaker对象创建一个Session工厂对象：
sess = Session()
```

发送给构造函数本身的任何关键字参数都将覆盖`sessionmaker对象`初始化时传入的配置参数中的关键字：

```python
Session = sessionmaker()

# 将一个session绑定到一个连接
sess = Session(bind=connection)
```

该`sessionmaker对象`还包括一个`configure()`方法，该方法可用于为`Session工厂对象`指定其他关键字参数，该参数将对随后生成的`Session工厂对象`生效。通常在首次使用它之前，应该将一个或多个`Engine`对象与现有的`sessionmaker对象`关联：

```python
# 应用开始
Session = sessionmaker()

# ... 之后
engine = create_engine('sqlite:///foo.db')
Session.configure(bind=engine)

sess = Session()
```

## 方法

### \_\_call\_\_(**local_kw)

使用在初始化`sessionmaker对象`时传入的配置来产生新的`Session工厂对象`。

在Python中，`__call__`方法在一个对象中会像一个构造函数一样被调用：

```python
Session = sessionmaker()
session = Session()  # 调用sessionmaker.__call__()
```

### \_\_init\_\_(bind, class_, autoflush, autocommit, expire_on_commit, info, **kw)

初始化一个新的`sessionmaker对象`。

除`class_`参数以外，此处的所有参数都直接对应于初始化`Session工厂对象`时接收的参数。有关参数的更多详细信息，请参见`Session.__init__()`文档。

**参数**

* **bind=None** - 与新创建的`Session工厂对象`相关联的`Engine`或其他可连接对象。

	* **class_=<class 'sqlalchemy.orm.session.Session'>** - 用于创建新的`Session工厂对象`的类。 默认为`Session`。
	* **autoflush=True** - 与新创建的`Session工厂对象`一起使用的`autoflush`设置。
	* **autocommit=False** - 与新创建的`Session工厂对象`一起使用的`autocommit`设置。
	* **expire_on_commit=True** - 与新创建的`Session工厂对象`一起使用的`expire_on_commit`设置。
	* **info=None** - 可通过`Session.info`获得的可选信息字典。请注意，当为`Session工厂对象`的构造函数操作指定`info`参数时，将更新对应的字段而不是整个替换词典。
	* **\*\*kw** - 所有其他关键字参数都传递给新创建的`Session工厂对象`的构造函数。

### configure(***new_kw*)

（重新）配置当前的`sessionmaker对象`的参数。

例如：

```python
Session = sessionmaker()

Session.configure(bind=create_engine('sqlite://'))
```



## 类方法

### identity_key(orm_util, *args, **kwargs)

【继承来的方法】

返回一个身份密钥。

这是`identity_key()`方法的别名。

### object_session(instance)

【继承来的方法】

返回`instance`对象所属的`Session`。

这是`object_session()`方法的别名。

