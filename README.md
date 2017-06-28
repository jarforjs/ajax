## jQuery对象转成DOM对象
> jQuery提供两种方法将一个jQuery对象转换成DOM对象,即[index]和get(index)

- jQuery对象是一个数组对象,可以通过[index]的方法得到相应的DOM对象

- 另一种方法是jQuery本身提供的,通过get(index)方法得到相对应的DOM对象

## DOM对象转成jQuery对象
> 对于一个DOM对象,只需要用$()把DOM对象包装起来,就可以获得一个jQuery对象


```
平常用到的jQuery对象都是通过$()函数制造出来的,$()函数就是一个jQuery对象的制造工厂
```

## 过滤选择器可分为:
> 基本过滤
- :first、:last、:not(selector)、:even、:odd、:eq(index)等于,:gt(index)大于、:lt(index)小于、:header标题元素、:animated正在执行动画的所有元素(索引从0开始)
> 内容过滤
- :contains(text)、:empty(不含有子元素或者空文本)、:has(selector)、:parent
> 可见性过滤
- :hidden不可见、:visible可见
> 属性过滤
- [attribute]拥有属性、[attribute=value]拥有属性为value，!不等于、^开头、$结尾、*含有、[selector1][selector2][selector3]
> 子元素过滤
- :nth-child(index/even/odd/equation)(eq(index)只匹配一个元素,而:nth-child将为每一个父元素匹配子元素,index从1开始.而eq的index是从0开始)
- :first-child(:first只返回单个元素而:first-child将为每个父元素匹配第一个子元素)
- :last-child(同上)
- :only-child(如果某个元素是父元素中唯一的一个子元素,才会被匹配)
> 表单对象属性过滤
- :enabled
- :disabled
- :checked
- :selected
>> 表单选择器
- :input(所有\<input>、\<select>、\<textarea>、\<button>)
```
注意:$('#form1 :input').length与$('#form1 input').length的区别.一个是所有,而后者不包括<select>、<textarea>、<button>只是input
```
- :text、:password、:radio、:checkbox、:submit、:image、:reset、:button、:file、:hidden
# 选择器中含有空格的注意事项
```
虽然一个空格，却截然不同的效果:
因为后代选择器和过滤选择器的不同所以导致结果截然不同.
var $t_a = $('.test :hidden');带空格
以上代码是选取class为test元素里面的隐藏元素
var $t_b = $('.test:hidden');不带空格
选取隐藏的class为test的元素
```