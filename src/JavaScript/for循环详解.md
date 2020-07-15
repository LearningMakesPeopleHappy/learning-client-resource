# for循环详解

## 标准

### 语法：

```javascript
for (initialization; expression; post-loop-expression) statement
```

* **initialization**：初始化表达式。
* **expression**：控制表达式。
* **post-loop-expression**：循环后表达式。
* **statement**：执行代码。多行代码需要使用大括号`{}`包含。

举例：

```javascript
var count = 10;
for (var i = 0; i < count; i++) {
    // do something ...
}
```

```javascript
var count = 10;
var i;
for (i = 0; i < count; i++) {
    // do something ...
}
```

上面两种是等价的。

### 省略模式

for循环的 初始化表达式，控制表达式，循环后表达式 都是可以省略的，并且可以全部省略，也可以部分省略。这里只给出几个特殊的：

```javascript
// 无限循环
for (;;) {
    // do something
}

// 类while循环
var count = 10;
var i = 0;
for (; i < count; ) {
    // do something ...
    i++;
}
```

### 注意

因为JavaScript中没有块级作用域，所以在for循环中定义的变量在for循环外依然可以使用。

```javascript
var count = 10;
for (var i = 0; i < count; i++) {
    var j = 100;
    // do something ...
}

console.log(i); // 10
console.log(j); // 100
```

### 特殊

### for-in

语法：

```javascript
for (property in expression) statement
```

* **property**：对象的属性名。返回的顺序没有保证。如果对象的属性名对应的属性值为`null`或`undefined`，在ECMAScript 5中将不会执行下面的循环体。但是在之前的ECMAScript标准中会报错。
* **expression**：对象（数组也是对象）。

示例：

```javascript
for (var propName in window) {
    console.log(propName);
}
```

### for-of

ECMAScript 6中引入的新语法。

```javascript
for (value in expression) statement
```
* **value**：数组的一个值。
* **expression**：数组。

> 注意：只可以对数组使用。

## label

`lable`语句其实是JavaScript的一个语句，但一般使用在for循环中，所以拿到这里来说。

`label`语句可以对代码添加标签。以便之后的`break`和`continue`使用。

```javascript
var count = 10;
start: for (var i = 0; i < count; i++) {
    // do something ...
}
```

## break和continue

### break

跳出当前循环，不再执行当前训话，而是执行循环之后的代码。

```javascript
var count = 10;
for (var i = 0; i < count; i++) {
    console.log(i);
    if (i > 5) {
        break;
    }
}

console.log('finished');

/// 0, 1, 2, 3, 4, 5, 6, finished,
```

### continue

跳出当前循环，回到循环的条件语句上，继续执行。

```javascript
var count = 10;
for (var i = 0; i < count; i++) {
    console.log(i);
    if (i === 5) {
        continue;
    }
}

console.log('finished');

/// 0, 1, 2, 3, 4, 6, 7, 8, 9, finished,
```

### 使用label

使用`label`语句可以在多层嵌套循环中，让`break`语句以及`continue`语句跳出回到对应的循环中。

```javascript
var count = 10;
start:
for (var i = 0; i < count; i++) {
    for (var j = 0; l < count; j++) {
        if (i === 5 && j === 5) {
            break start;
        }
    }
}
```

上面的代码，会在`i === 5`并且`j === 5`时退出两层循环。即，`break`语句配合`label`语句，会直接跳出`label`语句对应的那层循环。

```javascript
var count = 10;
start:
for (var i = 0; i < count; i++) {
    for (var j = 0; l < count; j++) {
        if (i === 5 && j === 5) {
            continue start;
        }
    }
}
```

上面的代码，会在`i === 5`并且`j === 5`时回到第一层循环，并且处理变量`i`之后继续执行第一层循环的代码。即，`continue`语句配合`label`语句，会直接跳回到`label`语句对应的那层循环的变量代码处。