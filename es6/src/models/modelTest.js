export var webName="百度";
export let url='www.baidu.com';
export const year=2017;
export function add(a,b){
    return a+b;
}
//写了default之后,就不能all.User了
export class User{
    constructor(){
        console.log('User被创建了')
    }
}
// export{
//     webName,
//     url,
//     year
// }

//require和import的区别
//从理解上,require是赋值过程而import是解构过程
//import是编译时不像require是运行时的,他必须放在文件的开头,而且使用的格式也是确定的,不容置疑.他不会将整个模块运行后赋值给某个变量,而是选择import的接口进行编译,这样在性能上比require要好很多.