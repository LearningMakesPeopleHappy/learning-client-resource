# 实现strStr()

## 题目

实现 strStr() 函数。

给定一个 haystack 字符串和一个 needle 字符串，在 haystack 字符串中找出 needle 字符串出现的第一个位置 (从0开始)。如果不存在，则返回  -1。

> **测试**
>
> haystack = "hello", needle = "ll" - 2
>
> haystack = "aaaaa", needle = "bba" - 1

## 思路

### 正向遍历逐字比较



#### 时间复杂度



#### 空间复杂度



#### 代码

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (!needle) return 0;
    let i = 0;
    const needleLen = needle.length;
    let len = haystack.length - needleLen;
    for (; i <= len; i++) {
        for (let j = 0; j < needleLen; j++) {
            if (haystack[i + j] !== needle[j]) {
                break;
            } else if (j === needleLen - 1) {
                return i;
            }
        }
    }

    return -1;
};
```



### 正向遍历整句比较



#### 时间复杂度



#### 空间复杂度



#### 代码

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if (!needle) return 0;
    if (haystack.length < needle.length) return -1;
    
    const needleLen = needle.length;
    const len = haystack.length - needle.length;
    for (let i = 0; i <= len; i++) {
        if (haystack.substring(i, i + needleLen) === needle) {
            return i
        }
    }

    return -1;
};
```

