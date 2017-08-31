<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
// {
//   let a = 1;
//   var b = 2;
// }
// console.log(b);//2
// console.log(a);//a is not defined

// for(let i = 0;i<10;i++){

// }
// console.log(i);//i is not defined

//对比用var和let声明变量i
// var a = [];
// for (var i =0;i<10;i++){
//   a[i] = function(){
//     console.log(i);
//     console.log(a);
//   }
// }
// console.log(a);//[f,f,f,f,f,f,f,f,f,f]
// a[6]();//10

//变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6。
// var a = [];
// for (let i =0;i<10;i++){
//   a[i] = function(){
//     console.log(i);
//   }
// }
// console.log(a);//[f,f,f,f,f,f,f,f,f,f]
// a[6]();//6

//for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
// for(let i=0;i<3;i++){
//   let i = 'abc';
//   console.log(i);//abc
// }
//上面代码正确运行，输出了abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域。

//不存在变量提升
//var的情况
// console.log(foo);//输出undefined
// var foo=2;

// //let的情况
// console.log(bar);//报错ReferenceError
// let bar=4;

//ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

//总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

// if (true) {
//   // TDZ开始
//   tmp = 'abc'; // ReferenceError
//   console.log(tmp); // ReferenceError

//   let tmp; // TDZ结束
//   console.log(tmp); // undefined

//   tmp = 123;
//   console.log(tmp); // 123
// }

//上面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”。

//“暂时性死区”也意味着typeof不再是一个百分之百安全的操作。
// console.log(typeof y); // 不存在的y也是undefined
// let x;
// console.log(typeof x); // undefined

function a(){
  let a = 1;
  var a = 10;
}





















































































































export default {
  name: 'letConst',
  data () {
    return {
      msg: 'Welcome to China!'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>