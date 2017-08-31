export {webName,url,year,add,User} from '../models/modelTest'

export default class Student{
    constructor(){
        console.log('Student被创建了')
    }
}

//子类继承父类之后,父类中有default的话就会报错
//而子类如果要用default的话,在import时也要像之前父类那样明示,直接调用