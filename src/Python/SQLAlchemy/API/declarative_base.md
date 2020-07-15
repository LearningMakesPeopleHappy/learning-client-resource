# declarative_base(bind, metadata, mapper, cls, name, constructor, class_registry, metaclass)

为声明性类定义构造一个基类。

将为新的基类提供一个元类，该元类生成适当的`Table`对象，并根据该类以及该类的任何子类中声明性提供的信息进行适当的`mapper()`调用。

**参数**

- **bind=None** – 一个可选的`Connectable`，将在`MetaData`实例上分配`bind`属性。
- **metadata=None** – 可选的`MetaData`实例。 由基类的子类隐式声明的所有`Table`对象将共享此`MetaData`。 如果未提供，则将创建一个`MetaData`实例。 `MetaData`实例将通过生成的声明性基类的`meta`属性提供。
- **mapper=None** – 一个可选的可调用对象，默认为`mapper()`。 将用于将子类映射到`Table`中。
- **cls=<class 'object'>** – 默认为`object`。一种类型，用作生成的声明性基类的基础。可以是一个类或一个类组成的元组。
- **name='Base'** – 默认为`Base`。生成的类的显示名称。不需要对此进行自定义，但是可以提高追溯和调试的清晰度。
- **constructor=<function _declarative_constructor>** – 默认为`_declarative_constructor()`，这是一个初始化实现，用于为实例的已声明字段和关系分配`**kwarg`。如果提供`None`，那么将不提供`__init__`，并且初始化将通过常规Python语义退回到`cls.__init__`。
- **class_registry=None** – 可选字典，当字符串名称用于标识`Relationship()`及其它内部的类时，它将用作类名->映射类的注册表。允许两个或多个声明性基类共享相同的类名注册表，以简化基类间的关系。
- **metaclass=<class 'sqlalchemy.ext.declarative.api.DeclarativeMeta'>** – 默认为`DeclarativeMeta`。 一个可兼容的元类或`__metaclass__`，可用作生成的声明性基类的元类型。

