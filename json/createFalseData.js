/*
var nameStr = "赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜";//0-31
var nameStr2 = "一二三四五六七八九";//0-8
function getRandom(n, m) {
    return Math.round(Math.random() * (m - n) + n);
}
var arr = [];
for (var i = 1; i <= 86; i++) {
    var obj = {};
    obj["num"] = i < 10 ? "00" + i : "0" + i;
    obj["name"] = nameStr[getRandom(0, 31)] + nameStr2[getRandom(0, 8)] + nameStr2[getRandom(0, 8)];
    obj["sex"] = getRandom(0, 1);
    obj["score"] = getRandom(59, 100);
    arr.push(obj);
}
console.log(JSON.stringify(arr));*/


/*
var nameStr="赵钱孙李周吴郑王";
var nameStr1="一二三四五六七八九";
function getRandom(n,m) {
    return Math.round(Math.random()*(m-n)+n);
}

var arr=[];
for(var i=1;i<=86;i++){
    var obj={};
    obj["num"]=i<10?"00"+i:"0"+i;
    obj['name']=nameStr[getRandom(0,7)]+nameStr1[getRandom(0,8)];
    obj["sex"]=getRandom(0,1);
    obj["score"]=getRandom(59,100);
    arr.push(obj);
}

console.log(JSON.stringify(arr));*/
var nameStr="赵钱孙李周吴郑王";
var nameStr1="一二三四五六七八九";

function getRan(n,m) {
    return Math.round(Math.random()*(m-n)+n);
}

var str=[];

for(var i=1;i<86;i++){
    var obj={};
    obj["num"]=i<10?"00"+i:"0"+i;
    obj["name"]=nameStr[getRan(0,7)]+nameStr1[getRan(0,8)];
    obj["sex"]=getRan(0,1);
    obj["score"]=getRan(59,99);
    str.push(obj);
}

console.log(JSON.stringify(str));