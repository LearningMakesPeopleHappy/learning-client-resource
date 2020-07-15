# relationship()

提供两个映射的类之间的关系。

这对应于父子关系或关联表关系。构造的类是`RelationshipProperty`的实例。

在经典映射中使用的典型的`relationship()`：

```python
mapper(Parent, properties={
  'children': relationship(Child)
})
```

`relationship()`接受的某些参数可选地接受可调用函数，该函数在被调用时会产生所需的值。父`Mapper`在“映射器初始化”时调用可调用对象，这仅在首次使用映射器时发生，并假定在所有映射都已构建之后。这可用于解决声明顺序和其他依赖项问题，例如，如果在同一文件的“父项”下面声明了“子项”：

```python
mapper(Parent, properties={
    "children":relationship(lambda: Child,
                        order_by=lambda: Child.id)
})
```

使用声明式扩展时，声明式初始化器允许将字符串参数传递给`relationship()`。 这些字符串参数使用声明式类注册作为名称空间，转换为可调用的字符串，将字符串转换为Python代码。这允许通过其字符串名称自动查找相关类，并且无需在声明相关类之前将相关类导入本地模块空间。但是仍然需要在实际使用相关映射之前，将出现这些相关类的模块导入应用程序中的任意位置，否则当`relationship()`尝试解析对字符串的引用时，将引发查找相关类错误。字符串解析类的示例如下：

```python
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Parent(Base):
    __tablename__ = 'parent'
    id = Column(Integer, primary_key=True)
    children = relationship("Child", order_by="Child.id")
```

**参数**

* **argument** - 表示关系目标的映射类或实际`Mapper`实例。
    `relationship.argument`也可以作为可调用函数传递，该函数在映射器初始化时进行评估，并且在使用声明式时可以作为字符串名称传递。
* **secondary=None** - 对于多对多关系，指定中间表，并且通常是`Table`的实例。在不太常见的情况下，该参数也可以指定为`Alias`构造函数，甚至是`Join`构造函数。
    `relationship.secondary`也可以作为可调用函数传递，该函数在映射器初始化时进行评估。当使用声明式时，它也可能是一个字符串参数，指出与父映射表相关联的MetaData集合中存在的表的名称。
    如果没有在任何直接类映射中以其他方式表示中间的`Table`，通常会使用`relationship.secondary`关键字参数。 如果“次要”表也被显式映射到其他地方（例如，在关联对象中），则应考虑应用`relationship.viewonly`标志，以使该`relationship()`不用于可能与关联对象模式的持久性操作冲突的持久性操作。 
* **active_history=False** - 如果为`True`，则表示如果尚未加载多对一引用的“先前”值，则应在替换时加载该值。 通常，简单多对一的历史跟踪逻辑只需要知道“新”值即可执行刷新。 此标志可用于使用get_history（）的应用程序，这些应用程序也需要知道属性的“上一个”值。
* **backref=None** - 指示要放置在相关映射器类上的属性的字符串名称，它将在另一个方向上处理此关系。 配置映射器时，将自动创建另一个属性。 也可以作为backref（）对象传递，以控制新关系的配置。
* **back_populates=None** - 带有字符串名称，并且具有与Relationship.backref相同的含义，只不过补充属性不是自动创建的，而是必须在另一个映射器上显式配置。 补充属性还应指示Relationship.back_populate到此关系，以确保正常运行。