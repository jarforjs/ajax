# ajax 
## jQuery对象转成DOM对象

> jQuery提供两种方法将一个jQuery对象转换成DOM对象,即[index]和get(index)

- jQuery对象是一个数组对象,可以通过[index]的方法得到相应的DOM对象

- 另一种方法是jQuery本身提供的,通过get(index)方法得到相对应的DOM对象

## DOM对象转成jQuery对象
> 对于一个DOM对象,只需要用$()把DOM对象包装起来,就可以获得一个jQuery对象


```
平常用到的jQuery对象都是通过$()函数制造出来的,$()函数就是一个jQuery对象的制造工厂
```