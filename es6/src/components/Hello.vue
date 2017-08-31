<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <input type="file" name="fileInput" id="fileInput" v-on:change="showImg">

    <img :src="buffer" alt="">
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
//model
//es6导入语法import
// import {webName,url,year} from '../models/modelTest';
//或者*
// import * as all from '../models/modelTest';
//用了default之后,导入时就得明示了
// import User, * as all from '../models/modelTest';

//继承
import Student,* as all from '../models/modelChild';


//es5导入语法require
//let all = require('../models/modelTest');

var that;
function arryBufferToBase64(buffer){
  var binary='';
  var bytes=new Uint8Array(buffer);
  var len=bytes.byteLength;
  for(var i =0;i<len;i++){
    binary+=String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
export default {
  name: 'hello',
  data () {
    return {
      buffer:'',
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){
    that=this;
  },
  methods:{
    showImg:function(){
      var fileInput=document.getElementById('fileInput');
      var file=fileInput.files[0];
      var reader=new FileReader;
      reader.readAsArrayBuffer(file);
      reader.onload=function(){
        var arrayBuffer=reader.result;
        let arrayBase=arryBufferToBase64(arrayBuffer);
        that.buffer='data:image/png;base64,'+arrayBase;
      }
    }
  }
}
function studyEs6(){
    //数组
  //let [a,b,c,d]=['aa','bb',77,,44];
//   let [a,b,[c,d]]=['aa','bb',[77,],44];
//   console.log(c)

    //对象
//   let obj=new Object();
//   obj.uid=111;
//   obj.uname='张三';
//   obj.arr=['aa','bb'];
//   let uid,uname,arr,a,b,c;
//   //({uid,uname}=obj);//一定要有小括号,不然会把{}当代码段
//   ({arr:[a,b,c='ccc']}=obj);//一定要有小括号,不然会把{}当代码段
//   console.log(c);

    //字符串
    // let [a,b,c,d]='中国人民';
    // console.log(c)

    //函数参数解构
//     analysis(obj);

// }

// function analysis({uid,uname}){
//     console.log(uid);
//     console.log(uname);
// }


//Symbol()
//新增的一个数据类型,表示绝不重复
// let a=Symbol(3);
// let b=Symbol(3);
// console.log(a==b);
// console.log(a.toString());//==>Symbol(3)


//set
//他与数组非常相似,但是set数据解构成员都是唯一的,set中只能添加一个NaN
// var set=new Set([1,2,3,4,5,6,7,7]);
// for(var elem of set){
//     console.log(elem);
// }
//set的添加
// var set=new Set();
// for(let i =0;i<10;i++){
//     set.add(i);
// }
// for(var elem of set){
//     console.log(elem)
// }
// var set=new Set();
// [1,2,3,3,3,4,4,1,12,3,5,6,7].map(function(elem){
//     // console.log(elem);//es5中的数组遍历方法,打印结果全打印
//     set.add(elem);//将值添加到了set数组中,并且过滤了重复项
// })

// for(var elem of set){
//     console.log(elem);
// }
//扩展运算符
// var set = new Set([1,2,3,4,5,6,7,0,1]);
// console.log(set);//==>Set(6)
// set.delete(3);//删除
// set.clear();//清空
// var arr = [...set];//扩展运算符(...)内部使用了for...of循环
// console.log(arr);//==>[1,2,3,4,5,6]

// set.forEach(function(value,key){
//     console.log(value+'='+key);//发现value跟key是一样的
// })

// //包含
// console.log(set.has(8));
// //数量
// console.log(set.size);

// let a = new Set([1,2,3,4]);
// let b = new Set([3,4,5,6]);
//求并集
// let union= new Set([...a,...b]);
// console.log(union);
// console.log([...union]);
//求交集
// let intersect=[...a].filter(function(elem){
//     return b.has(elem);
// })
// let intersect=[...a].filter(x=>b.has(x));
// console.log(intersect);
//求差集
// let difference=[...a].filter(function(elem){
//     return !b.has(elem);
// })
// console.log(difference);

//WeakeSet
//它与Set十分相似,对象的值也不能是重复的,与Set不同的是:
//1.weakset的成员只能是对象
//2.作为weakset成员的对象都是弱引用,即垃圾回收机制不考虑weakset对该对象的引用,也就是说,如果其他对象都不在引用该对象,那么垃圾回收机制会自动回收该对象所占用的内存,不考虑该对象还存在于weakset之中,这个特点意味着,无法引用weakset的成员,因此weakset是不可遍历的
//3.使用weakset存储对象实力的好处是:由于是对对象实例的引用,不会被计入内存回收机制,所以删除实例的时候,不用考虑weakset,也不会出现内存泄漏
//4weakset不能取值,也不能显示,只能用来表示是否有重复的对象

//1
// var weakset=new WeakSet();
// // weakset.add(5);//=>报错
// var num=new Number(5);
// weakset.add(num);
// console.log(weakset)

// var weakset=new WeakSet();
// let aObj={a:'aa'};
// let bObj=new String('你好');
// let cObj=new Number(8);
// weakset.add(aObj);
// weakset.add(bObj);
// weakset.add(cObj);
// // console.log(weakset.has(bObj));//=>ture
// // weakset.delete(cObj);
// // console.log(weakset.has(cObj));//=>false
// //弱引用
// aObj=null;
// console.log(weakset.has(aObj));//=>false

// Map和WeakMap是es6新增的数据解构
//他们本质与对象一样,都是键值对的集合,不同点是,他们的键可以是各种类型的数值,而Object的键只能是字符串类型或者Symbol类型值,他们是更为完善的Hash解构
//map
// let objKey1={};
// let objKey2={};
// let obj=new Object();
// obj[objKey1]=33;
// obj[objKey2]=66;
// obj['aaa']='bbb';
// //Object的for in循环
// for(let key in obj){
//     console.log(key);
// }

//weakmap
// weakmap解构与map解构基本类似
//区别是他只接受对象作为键名,不接受其他类型的值作为键名,键名是对象的弱引用,当对象被回收后,weakmap自动移除对应的键值对,有助于防止内存泄漏
// var wm=new WeakMap();
// var obj=new Object();
// wm.set(obj,'对象1');
// console.log(wm.get(obj));//对象1
// console.log(wm.has(obj));//true
// // //删除
// // wm.delete(obj);
// // console.log(wm.get(obj));//undefined
// // console.log(wm.has(obj));//false
// obj=null;
// console.log(wm.get(obj));//undefined
// console.log(wm.has(obj));//false
//与weakset一样,不可遍历,没有size

//遍历器
// let arr=['百度网','www.baidu.com','中国'];
// let it=arr[Symbol.iterator]();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
//我们可以做一个循环器
// for(;;){//相当于while true,比普通的for循环快4倍
//     let elem=it.next();
//     if(elem.done)break;
//     console.log(elem.value);
// }
//for of的循环器
// for(let elem of arr){
//     console.log(elem);
// }
// for(let elem in arr){
//     console.log(arr[elem]);
// }
//展开运算符
// console.log(...arr);

//某些类数组(对象)的遍历器
// let obj={
//     data:['aa','bb','cc',4,5,6],
//     [Symbol.iterator](){
//         const self=this;
//         let index=0;
//         return{
//             next(){
//                 if(index<self.data.length){
//                     return{
//                         value:self.data[index++],
//                         done:false
//                     };
//                 }else{
//                     return {value:undefined,done:true};
//                 }
//             }
//         }
//     }
// }
// let it=obj[Symbol.iterator]();
// console.log(it.next().value)
// console.log(it.next().value)
// console.log(it.next().value)
// console.log(it.next().value)
// console.log(it.next().value)
// console.log(it.next().value)

//generator是es6新增的一种异步编程方案
//他是一种新的语法结构,是一个遍历器对象生成器,它内部封装多个状态,非常适合用于异步操作!

//generator函数语法和普通的function函数类似,但是有三个不同点
//1.function关键字和函数名称之间有一个星号(*)
//2.函数体内可以用yield语句
//3.函数调用后不会立即执行,返回的是一个遍历器对象

//一个generator函数
// function*yuanku(){
//     yield '百度';
//     yield '北京海淀';
//     yield 'www.baidu.com';
//     return 'end';
// }
//内部函数使用yield语句定义不同的状态,return可以定义一个状态
// let y=yuanku();//调用此函数,并不会立即执行它其中的代码,而是返回一个遍历器对象
// console.log(y.next());//返回一个具有Value和done属性的对象
// console.log(y.next());
// console.log(y.next());
// console.log(y.next());


//yield语句的返回值和yield后面的表达式返回值是两个概念
// function*yuanku(){
//     //当yield参与表达式
//     console.log('aaa='+(yield '百度'));
//     yield '北京海淀';
//     yield 'www.baidu.com';
//     return 'end';
// }
// let y=yuanku();
// console.log(y.next());
// console.log(y.next('我是注入的值'));
// console.log(y.next());
// console.log(y.next());

// function*yuankuk(num){
//     let x=2*(yield num);
//     console.log('x='+x);
//     let y=yield x*3;
//     console.log('y='+y);
//     console.log(x,y);
// }
// var g= yuanku(5);
// console.log(g.next());//{value:5,done:false}第一个next传值无意义,因为上面没有yield

// // console.log(g.next());//{value:undefined,done:false}x=NaN
// console.log(g.next(3));//x=6{value:18,done:false}
// console.log(g.next(3));//y=3 6 3 {value:undefined,done:true}

//异步方法实例
// var func=function(time){
//     setTimeout(function(){
//         console.log(time,'hello');
//     },time)
// }

// var gen=function*(){
//     var f1=yield func(3000);
//     console.log('f1:',f1);
//     var f2=yield func(1000);
//     console.log('f2:',f2);
// }

// let y=gen();
// y.next();
// y.next();
// y.next();
// // y.next(3000);
// // y.next(1000);

//异步回调来进行异步操作
//如果我要先执行3秒的
//遍历器y放外边申明,实际在里面嵌套,当我执行完第一个步的时候,我再执行next()(异步不会阻塞流程,如果不用这种方式,肯定会1秒的先执行再执行3秒的,让我们的逻辑混乱)
//所以用next()的方式来控制异步的步调,使得异步的表达符合常理
//每一个yield语句定义不同的状态,他也是一个代码执行暂停标识,他在普通函数中不能使用,会报错
//调用generator函数可以返回一个遍历器对象,要想访问generator函数中的每一个状态,需要使用遍历器对象调用Next()方法
//next()一个主要功能,就是从暂停状态继续下一段代码的执行
//next()还有一个重要的功能,那就是可以接受一个参数,次参数作为上一个yield语句的返回值
//虽然当代吗执行到yield语句的时候,能够将其后面的表达式的值作为对象的value属性值,但是默认情况下yield语句没有返回值,或者说他的返回值是undefined
// let y;
// var func=function(time){
//     setTimeout(function(){
//         console.log(time,'hello');
//         y.next(time);
//     },time)
// }

// var gen=function*(){
//     var f1=yield func(3000);
//     console.log('f1:',f1);
//     var f2=yield func(1000);
//     console.log('f2:',f2);
// }
// y=gen();
// y.next();

//promise
// let param;
// function p1(){
//     return new Promise(function(resolve,reject){
//         setTimeout(function(){
//             param='p1的成功信息';
//             console.log('aaaa');
//             resolve('p1成功')
//         },3000)
//     })
// }

// function p2(){
//     return new Promise(function(resolve,reject){
//         setTimeout(function(){
//             console.log('接收上一次参数:'+param);
//             param='p2的失败信息'
//             console.log('bbbb');
//             reject(123)
//             // resolve('p2成功')
//         },2000)
//     })
// }

// function p3(){
//     return new Promise(function(resolve,reject){
//         setTimeout(function(){
//             console.log('接收上一次参数:'+param)
//             console.log('cccc');
//             resolve('p3成功')
//         },1000)
//     })
// }
// function p4(){
//     return new Promise(function(resolve,reject){
//         setTimeout(function(){
//             console.log('dddd');
//             resolve('p4成功')
//         },500)
//     })
// }

// p1().then(p2).then(p3).then(p4).then(function(data){
//     console.log('成功信息:'+data);
// }).catch(function(err){
//     console.log('错误信息:'+err);
//     if(err===123){
//         p3().then(p4).then(function(data){
//     console.log('成功信息:'+data);
// })
//     }
// });

//1.generator利用yield暂停定义不同状态,依靠next()来控制异步的步调
//2.promise通过状态的改变:pending=>resolved或者pending=>rejected
//resolved时调用then继续流程,当状态为rejected时使用catch捕获到错误保证程序顺利完成

//async
// var sleep = function(time){
//     return new Promise(function(resolve,reject){
//         //console.log('执行');
//         setTimeout(function(){
//             resolve('执行成功');
//             //reject('执行失败')
//         },time);
//     })
// }

// var start = async function(){
//     console.log('start');
//     await sleep(3000).then(function(data){
//         console.log(data)
//     }).catch(function(err){
//         console.log(err)
//     });
//     console.log('end');
// }
//成功信息可以接收
// var start = async function(){
//     console.log('start');
//     let result = await sleep(3000);
//     console.log('end:' + result);
// }
//捕获错误信息
// var start = async function(){
//     try{
//         console.log('start');
//         let result = await sleep(3000);
//         console.log('end:' + result);
//     }catch(err){
//         console.log(err);
//     }
// }
// let 一到十 = [1,2,3,4,5,6,7,8,9,0];
// var start = async function(){
//     console.log('start');
//     //console.log(一到十.length);
//     //for (let i = 0;i<一到十.length;i++){
//     for(let i of 一到十){;
//         await sleep(1000);
//         console.log(`当前是第${i}次等待...`);
//     }
//     console.log('end')
// }
//async/await是目前最简单的异步解决方案
//async表示是一个async函数,await只能在async函数中运行,否侧就报错
//await表示在这里等待promise返回结果了再继续执行
//await后面跟着的应该是一个promise对象(当然其他返回值也没关系,只是会立即执行,那样的话就没有意义了)

//关于获得返回值:await等待的虽然是promise对象,但不必写.then(...),直接可以得到返回值
// start()



//箭头函数
// function func(){
//     return 'hello'
// }
// console.log(func());//=>hello

//没有参数
// let func = () =>'hello';
// console.log(func());

//有参数
// function cheng(a=3){
//     return a*a;
// }
// console.log(cheng());
// let cheng=(a=3)=>a*a;
// console.log(cheng())

//多参数
// function add(a,b){
//     return a+b;
// }
// let add = (a,b) => a + b;
// console.log(add(3,9));

//没有返回值的写法
// function add(a,b){
//     console.log(a+b);
// }
// let add = (a,b) => {console.log(a + b)};
// // console.log(add(3,9));//=>先输出12,然后是undefined,所以就不用console.log了
// add(3,9)

//多行
// function add(a,b){
//     console.log(a+b);
//     return a+b;
// }
// console.log(add(4,7));
// let add = (a,b)=>{
//     console.log(a+b);
//     return a+b;
// }
// console.log(add(4,7));
//如果箭头表达式仅仅就是简化了函数的命名,我们为什么要改变原来的习惯而去使用它呢?
//箭头函数内部没有constructor方法,也没有prototype,所以不支持new操作.它对this的操作与普通函数不一样,箭头函数的this始终指向函数定义时的this,而非执行时.

// var obj ={
//     x:1,
//     func:function(){console.log(this.x)},
//     test:function(){
//         setTimeout(function(){
//             console.log(this);//this指针转化为全局了
//             this.func();
//         },1000);
//     }
// }
// obj.test();
//弹出[object Window],并且this下没有func这个方法
//改为箭头函数;
// var obj = {
//     x: 123,
//     func: function() {
//         console.log(this, 3);
//         console.log(this.x)
//     },
//     test: function() {
//         console.log(this, 1);
//         setTimeout(() => {
//             console.log(this, 2);
//             this.func();
//         }, 100);
//     }
// }
// obj.test();
// var obj={
//     x:121,
//     func:function(){console.log(this.x)},
//     test:function(){
//         setTimeout(()=>{this.func()},100);
//     }
// }
// obj.test();

//class
//以前的类的写法
// function Person(name,id){
//     this.name=name;
//     this.id=id;
//     this.sayName=function(){
//         console.log(this.name);
//     }
// }
// let p=new Person('张三',17);
// p.sayName();
//es6中的写法
// class Person{
//     constructor(name,id,age){
//         this.name = name;
//         this.age = age;
//         this.id = id;
//         this.friends = ['shlby','court'];
//     }
//     sayName(){
//         console.log(this.name);
//     }
//     sayName(name){//这样写会覆盖
//         this.name = name;//体会一下有这一行和没这一行的区别
//         console.log(name,1);
//         console.log(this.name,2);
//     }
// }
// let person = new Person('张三',17,30);
// person.sayName('李四');

//静态方法
// class Point{
//     constructor(x,y){
//         this.x=x;
//         this.y=y;
//     }
//     static distance(a,b){
//         const dx=a.x-b.x;
//         const dy=a.y-b.y;
//         return Math.sqrt(dx*dx+dy*dy);
//     }
// }
// const p1=new Point(5,5);
// const p2=new Point(10,10);
// console.log(Point.distance(p1,p2));
// //es6明确规定class内部只有静态方法,没有静态属性,但可以用另外方式解决
// Point.len=99;
// console.log(Point.len);

//单例模式
// class Cache {
//     constructor() {
//         this.id = 123;
//         this.name = '王五';
//     }

//     static getInstance() {//静态方法
//         if (!Cache.instance) {
//             console.log('创建');
//             Cache.instance = new Cache();
//         }
//         return Cache.instance;
//     }
// }
// let cache = Cache.getInstance();
// console.log(cache.name);
// cache.name = '李四';//静态属性
// let cache1 = Cache.getInstance();
// let cache2 = Cache.getInstance();
// let cache3 = Cache.getInstance();
// console.log(cache3.name);

//继承
// class Animal{
//     constructor(name){
//         this.name=name;
//     }
//     speak(){
//         console.log(this.name+'makes a noise.')
//     }
// }

// class Dog extends Animal{
//     speak(){
//         console.log(this.name+'汪汪');
//     }
// }
// let dog=new Dog('狗');
// dog.speak();
//类中的属性(this.id)必须被constructor包裹
//类中的方法不用谢function直接-方法名-小括号-大括号
//类有静态方法:在方法前加static.调用的时候直接类名点方法.
//类没有静态属性,如果要给它静态属性可以Person.prop=prop这种方法给
//类可以继承,子类继承父类用extends

//proxy
// class Register{}
// let r = new Register();
// let p = new Proxy(r,{
//     get:function(target,key){
//         return target[key];
//     },
//     set:function(target,key,value){
//         if(key==='id'){
//             if(value===110){
//                 target['suffix']=',此人是逃犯';
//             }else{
//                 target['suffix']='';
//             }
//         }
//         if(key==='name'){
//             value+=target['suffix'];
//         }
//         return target[key]=value;
//         // return Reflect.set(target,key,value)
//     }
// })
// p.id=110;
// p.name='abc';
// console.log(p.name);

// p.id=310;
// p.name='王伟';
// console.log(p.name);

//decorator
/**@author ghb
 */
// function chooseCourse(target){
//     target.course='物理';
// }
// function setStudy(target){
//     target.study=function(){
//         console.log('学习'+this.course)
//     }
// }
// function chooseCourse(courseName){
// 	return function(target){
// 		target.courseName=courseName;
// 	}
// }
// function classroom(roomName){
// 	return function(target){
// 		target.study=function(){
// 			console.log('在'+roomName+'学习'+target.courseName);
// 		}
// 	}
// }
// // @chooseCourse('化学')
// // @classroom('第三课堂')
// class Student{
// 	@chooseCourse('化学')
// 	exam(){
// 		console.log('考试,考'+this.courseName);
// 	}
// }
// //Student.study();
// let student=new Student;
// student.exam();

//修饰器只能用于类和类的方法,不能用于函数,会导致函数提升而发生错误
//proxy模式是在编译的时候确定的,而decorator修饰器模式是在程序运行的时候确定的

//model
// console.log('webName:'+all.webName);
// console.log('url:'+all.url);
// console.log('year:'+all.year);
// console.log('add:'+all.add(3,5))
// //用了default之后,就不需要用all.User了
// // let user = new all.User();
// let user = new all.User();
// let student = new Student();

//二进制数组







































}
 studyEs6()
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
