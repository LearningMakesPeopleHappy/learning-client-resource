# Script标签详解

## 属性

HTML4.01定义的6种属性：

* **async**：可选。异步加载脚本。只对外部脚本文件（即`src`引入文件）有效。
* **charset**：可选。通过`src`属性指定的代码的字符集。这个属性大多数情况下会被忽略。
* **defer**：可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件（即`src`引入文件）有效。
* **language**：已废弃。
* **src**：要执行代码的外部文件地址。
* **type**：编写代码使用的脚本语言的内容类型（也可以看作`MIME`类型）。对于JavaScript文件，服务器一般返回`application/x-javascript`。值：
    * **text/javascript**：默认值，不推荐使用。但习惯上仍然使用这个值。
    * **text/ecmascript**：不推荐使用。
    * **application/javascript**：非IE可用。
    * **application/ecmascript**：非IE可用。

## 使用

### 页面中嵌入代码

只需指定`type`属性为`text/javascript`，然后将JavaScript代码放在元素内部。

```html
<script>
    function hello() {
        alert('hello');
    }
</script>
```
包含在Script标签内部的代码会从上到下依次解析，内部所有代码解析完毕之前，页面中的其余内容都不会被浏览器加载或显示。

> 注意：内嵌JavaScript代码中千万必要出现`</script>`的字样，否则就表示结束Script标签，字符串也不行。

### 外部JavaScript文件

指定`type`属性为`text/javascript`，将`src`属性设置为外部的JavaScript文件的链接。

```html
<script type="text/javascript" src="myjavascript.js"></script>
```

在解析外部JavaScript代码的过程中，页面中的其余内容都不会被浏览器加载或显示。

> 注意：Script标签不可以省略结束部分的`</script>`。

> 注意：使用外部JavaScript文件的时候，如果在Script标签中写入内嵌代码，则内嵌代码会被忽略。

> 提示：`src`属性中的`.js`扩展名不是必须的。如果没有扩展名，则服务器返回的`MIME`类型必须正确。

### 外部文件的优势

* **可维护性**：把所有JavaScript文件都放在一个文件夹下，方便维护。并且独立的JavaScript文件方便开发人员将精力集中在编写JavaScript上。
* **可缓存**：多个页面使用同一个JavaScript文件只需下载一次。

## 位置

传统做法是将Script标签放置在Head标签中。但是这意味着，需要等待所有JavaScript代码下载并执行完毕之后才会显示页面内容。

为了避免长时间显示空白页面，现在都会将Script标签放在Body标签的最后。

> 虽然说有`defer`属性可以让JavaScript文件延迟到`</html>`标签后再执行，并且HTML5标准中规定了按照顺序加载，并且是在`DOMContentLoaded`事件之前执行完毕。但是现在的浏览器中并不会一定按照延迟顺序执行，也不一定会在`DOMContentLoaded`事件之前执行。所以仍然建议将Script标签放在Body标签的最后。

**特殊说明**

`async`属性虽然说会异步下载外部的JavaScript文件，但是并不会保证下载完毕的执行顺序和下载顺序一致。所以最好需要保证设置`async`属性的多个JavaScript文件之间没有互相依赖。

`async`属性设置的JavaScript文件一定会在页面的`load`事件前执行，但是不能保证在`DOMContentLoaded`事件前后执行。所以建议异步加载JavaScript文件的过程中不要操作DOM。


## Noscript标签

当页面中不支持JavaScript（或者禁用了JavaScript）时用来显示内容。Noscript标签中可以包含任何Body标签中的HTML元素——Script标签除外。