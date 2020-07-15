# create_engine(*args, **kwargs)

创建一个新的`Engine`实例。

标准的调用形式是将URL作为第一个位置参数发送，通常是指示数据库dialect和连接参数的字符串：

```python
engine = create_engine("postgresql://scott:tiger@localhost/test")
```

然后，可以在其后跟随其他关键字参数，从而在反悔的`Engine`及其Dialect和Pool上建立各种选项：

```python
engine = create_engine("mysql://scott:tiger@hostname/dbname",
                            encoding='latin1', echo=True)
```

URL的字符串形式为`driver[+driver]://user:password@host/dbname[?key=value..]`，其中`driver`是数据库名称，例如`mysql`，`oracle`，`postgresql`等，以及驱动程序DBAPI的名称，例如`psycopg2`，`pyodbc`，`cx_oracle`等。或者，URL可以是`URL`的实例。

`**kwargs`采取了多种选择，这些选择都指向其适当的组件。参数可能指定`Engine`，底层`Driver`以及`Pool`。 设定`driver`也接受该`driver`唯一的关键字参数。在这里，我们描述大多数`create_engine()`用法通用的参数。

建立之后，一旦调用`Engine.connect()`或调用依赖于此的方法（如`Engine.execute()`），新的`Engine`对象将请求来自底层`Pool`的连接。收到请求后，`Pool`将建立第一个实际的DBAPI连接。`create_engine()`调用本身不会直接建立任何实际的DBAPI连接。

**参数**

* **case_sensitive=True** - 如果为`False`，则结果列名称将以不区分大小写的方式匹配，即`row['SomeColumn']`。
* **connect_args** - 选项字典，这个字典将作为附加关键字参数直接传递到DBAPI的`connect()`方法中。请参见[自定义DBAPI connect()参数]()中的示例。
* **convert_unicode=False** - 如果设置为`True`，则不管单个字段的`String`类型的设置为`False`，都会导致所有`String`数据类型的行为就像`String.convert_unicode`标志已设置为`True`一样。 这样会导致所有基于字符串的列直接容纳Python Unicode对象，就像数据类型是Unicode类型一样。

