# Column类

> 基类: `sqlalchemy.sql.base.DialectKWArgs`, `sqlalchemy.schema.SchemaItem`, `sqlalchemy.sql.expression.ColumnClause`

表示数据库表中的一列。

## 方法

### \_\_eq\_\_(other)

实现`==`运算符。

在列的上下文中，生成子句`a = b`。 如果目标为`None`，则生成`a IS NULL`。

### \_\_init\_\_(*args, **kwargs)

构造一个新的`Column`对象。

**参数**

* **name** - 数据库中表示的此列的名称。该参数可以是第一个位置的参数，也可以通过关键字指定。
    不包含大写字母的名称将被视为不区分大小写的名称，除非它们是保留字，否则将不加引号。具有任意数量的大写字符的名称将被精确引用和发送。请注意，此行为甚至适用于将大写名称标准化为不区分大小写的数据库，例如Oracle。
    名称字段可以在构造时省略，可以在`Column`与`Table`关联之前的任何时间设置。这是为了支持在`declarative`扩展中更方便的用法。

* **type_** - 列的类型，使用实例化的`TypeEngine`子类表示。如果该类型不需要参数，则也可以发送该类型的类，例如：

    ```python
    # use a type with arguments
    Column('data', String(50))
    
    # use no arguments
    Column('level', Integer)
    ```

    `type_`参数可以是第二个位置的参数，也可以由关键字指定。
    如果`type_`为`None`或被省略，它将默认为特殊类型`NullType`。如果并且当使此列使用`ForeignKey`和（或）`ForeignKeyConstraint`引用另一列时，在针对该远程Column对象解析外键的同时，远程引用列的类型也将被复制到该列。 。

* ***args** - 其他位置参数包括各种`SchemaItem`派生的构造，这些构造将用作列的选项。这些包括`Constraint`，`ForeignKey`，`ColumnDefault`，`Sequence`，`Computed`的实例。在某些情况下，可以使用等效的关键字参数，例如`server_default`，`default`和`unique`。

* **autoincrement** - 为整数主键列设置“`auto increment`”语义。默认值是字符串`"auto"`，它表示没有声明默认值的`INTEGER`类型的单列主键应自动接收自动递增语义；所有其他类型的主键列都不会被设置自动递增语义。这包括在创建表的过程中将为此列设置为`PostgreSQL SERIAL`或`MySQL AUTO_INCREMENT`之类的`DDL`，并且假定在调用`INSERT`语句时该列会生成新的整数主键值，方言将检索该值。
    可以将这个参数设置为`True`，以指示作为复合（例如多列）主键一部分的列应具有自动递增语义，但是请注意，主键中只有一列可以具有此设置。也可以将其设置为`True`，以在配置了客户端或服务器默认默认值的列上指示自动递增语义，但是请注意，并非所有方言都可以将所有默认样式作为“自动递增”来容纳。也可以在数据类型为`INTEGER`的单列主键上将其设置为`False`，以禁用该列的自动增量语义。
    此设置只在符合下列条件的列中有效：

    * 派生的整数（即`INT`，`SMALLINT`，`BIGINT`）。

    * 主键的一部分

    * 除非将值指定为'ignore_fk'，否则不要通过ForeignKey引用另一列：

        ```python
        # turn on autoincrement for this column despite
        # the ForeignKey()
        Column('id', ForeignKey('other.id'),
                    primary_key=True, autoincrement='ignore_fk')
        ```

        通常不希望在通过外键引用另一个的列上启用“自动增量”，因为要求该列引用源自其他地方的值。

    该设置对满足上述条件的列具有以下两种影响：

    * 为该列发行的DDL将包含特定于数据库的关键字，这些关键字旨在将该列表示为“自动增量”列，例如MySQL上的AUTO INCREMENT，PostgreSQL上的SERIAL和MS-SQL上的IDENTITY。 它不会为SQLite发出AUTOINCREMENT，因为这是自动递增行为不需要的特殊SQLite标志。
    * 通过使用特定于后端数据库的“自动增量”方法（例如，调用cursor.lastrowid，在INSERT语句中使用RETURNING获取序列生成的值）或使用特殊功能（例如“ SELECT scope_identity（）”。 这些方法高度专用于所使用的DBAPI和数据库，并且变化很大，因此在将autoincrement = True与自定义默认生成功能相关联时应格外小心。

* **default** - 表示列的默认值，可以为常量、可调用Python对象或`ColumnElement`表达式，如果在插入的`VALUES`子句中未指定此列，则将在插入时调用该表达式。 这是将`ColumnDefault`用作位置参数的快捷方式。有关该参数的结构的完整详细信息，请参见该类。
    将此参数与`Column.server_default`进行对比，后者在数据库端创建一个默认生成器。

* **doc** - 可选字符串，可以由ORM使用或类似于Python端的文档属性。此属性不呈现SQL注释； 为此，请使用Column.comment参数。

* **key** - 一个可选的字符串标识符，它将在表格上标识此Column对象。 提供键时，这是引用应用程序中Column的唯一标识符，包括ORM属性映射； 名称字段仅在呈现SQL时使用。