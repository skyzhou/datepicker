# Date Picker



* 轻量，压缩后9KB,GZIP后4KB
* 无依赖，不依赖第三方框架，不依赖图片样式，引入datepicker.min.js即可
* 易用，只需将input的type设置为date


## 截图

![screenshot](https://raw.github.com/skyzhou/datepicker/master/screenshot/screenshot.png)

1、引入datepicker.min.js

```html

<script src="datepicker.min.js"> </script>

```

2、设置input的type为date

```html
<input type="date"/>
```

3、获取输入的时间

```js
var element = document.getElementById("你的输入元素id");

//时间戳
var timestamp = element.getAttribute("timestamp")

//字符串
var str = element.value;
```

## 设置起始时间
禁止选择指定时间之前的日期

```html
<input type="date" begin="1411546602913"/>
```

## 设置结束时间
禁止选择指定时间之后的日期

```html
<input type="date" end="1411546602913"/>
```

## 时间组合
前面选择的结果作为后续选择器的起始时间，靠后选择的结果作为之前选择器的结束时间

```html
<input type="date" group="groupname"/>
至
<input type="date" group="groupname"/>
```

## 重新初始化
当页面结构非直出或页面结构发生改变时，通知组件重新初始化

```js
var datepicker = require("datepicker");
datepicker.trigger();
```

或者

```js
qdp.trigger();
```

## 监听日期选中事件
1、在input标签上添加cid属性
```html
<input type="date" cid="yourcidvalue"/>
```
2、添加监听日期选择事件的回调函数
```js
var datepicker = require("datepicker");
datepicker.change("yourcidvalue", function(){
	//your code
})
```

## License

MIT

