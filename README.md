https://jarforjs.github.io/ajax/
# 第一章
## jQuery对象转成DOM对象
> jQuery提供两种方法将一个jQuery对象转换成DOM对象,即[index]和get(index)

- jQuery对象是一个数组对象,可以通过[index]的方法得到相应的DOM对象

- 另一种方法是jQuery本身提供的,通过get(index)方法得到相对应的DOM对象

## DOM对象转成jQuery对象
> 对于一个DOM对象,只需要用$()把DOM对象包装起来,就可以获得一个jQuery对象


```
平常用到的jQuery对象都是通过$()函数制造出来的,$()函数就是一个jQuery对象的制造工厂
```

# 第二章
## 过滤选择器可分为:
> 基本选择器
- #id、.class、element(标签)、*、selector1,selector2，selector3
> 层次选择器
- $('ancestor descendant')后代
- $('parent > child')子
- $('prev + next')紧接在prev后的next元素
- $('prev~siblings')
> 基本过滤选择器
- :first、:last、:not(selector)、:even、:odd、:eq(index)等于,:gt(index)大于、:lt(index)小于、:header标题元素、:animated正在执行动画的所有元素(索引从0开始)、:focus选取当前获得焦点元素
>>>>>>> e9deee3266ec05b1b4e9a4ea4c94a4a446acf303
> 内容过滤
- :contains(text)、:empty(不含有子元素或者空文本)、:has(selector)、:parent
> 可见性过滤
- :hidden不可见、:visible可见
> 属性过滤
- [attribute]拥有属性、[attribute=value]拥有属性为value，!不等于、^开头、$结尾、*含有、$([tittle|='en'])等于en或以en为前缀（该字符串后跟一个连字符'-'）的元素、$([tittle~='en'])tittle用空格分隔的值中间包含字符en的元素、[selector1][selector2][selector3]
> 子元素过滤
- :nth-child(index/even/odd/equation)(eq(index)只匹配一个元素,而:nth-child将为每一个父元素匹配子元素,index从1开始.而eq的index是从0开始)
- :first-child(:first只返回单个元素而:first-child将为每个父元素匹配第一个子元素)
- :last-child(同上)
- :only-child(如果某个元素是父元素中唯一的一个子元素,才会被匹配)
> 表单对象属性过滤
- :enabled
- :disabled
- :checked(input:checked)
- :selected(select option:selected)
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

# 第三章
## jQuery中的DOM操作
> 插入节点
- append(匹配元素内后置)、prepend(匹配元素内前置)、appendTo(将匹配元素内后置)、prependTo(将匹配元素内前置)、after(匹配元素后插入)、insertAfter(将匹配元素后插入)、before(匹配元素前插入)、insertBefore(将匹配元素前插入)
> 删除节点
- remove():这个方法返回一个指向已被删除的节点的引用,因此可以再以后再使用,**可以传递一个参数来选择性的删除元素**
- detach():这个方法不会把匹配的元素从jQuery对象中删除，因而可以再将来再使用这些匹配的元素。与remove()不同的是，所有绑定的事件、附加的数据等都会被保留下来
- empty():并不是删除节点而是清空元素中所有后代节点
> 复制节点
- clone():**可以传递一个参数true,意味着复制元素的同时也复制元素中所绑事件**
> 替换节点
- replaceWith():将
- replaceAll()
