/*var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function (request, response) {
    //解析客户端请求的url地址
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname;
    var query = urlObj.query;

    //如果客户端请求的是静态资源文件,html/css/js/图片/音视频,我们把文件中的内容获取到,并且返回给客户端进行渲染
    var reg = /\.(HTML|JS|CSS)/i;
    if (reg.test(pathname)) {
        //获取请求文件的后缀名
        var suffix = reg.exec(pathname)[1].toUpperCase();
        //根据后缀名获取MIME的值
        var suffixType = "text/plain";
        switch (suffix) {
            case "HTML":
                suffixType = "text/html";
                break;
            case "JS":
                suffixType = "text/javascript";
                break;
            case "CSS":
                suffixType = "text/css";
                break;
        }
        //读取对应文件中的代码,并且返回给客户端
        var conFile = fs.readFileSync("." + pathname, "utf-8");
        response.writeHead(200, {"content-type": suffixType + ";charset=utf-8;"});
        response.end(conFile);
        return;
    }


    //编写数据请求的接口:/getData?n=2,n是当前页.首先把n获取到,读取page.json中全部内容,然后把n这一页对应的那10条数据都获取到
    if (pathname === "/getData") {
        var n = query["n"];

        //获取全部的数据
        var con = fs.readFileSync("./json/json.json", "utf8");
        con = JSON.parse(con);

        //在全部的数据中把n这一页对应的数据获取到
        var arr = [];
        for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
            if (i > con.length - 1) {
                break;
            }
            console.log(con[i]);
            var curData = con[i];
            arr.push(curData);
        }

        //把获取的数据返回给客户端
        response.writeHead(200, {"content-type": "application/json;charset=utf-8;"});
        response.end(JSON.stringify({
            total: Math.ceil(con.length / 10),
            data: arr
        }));
        return;
    }


    response.writeHead(404);
    response.end("file not found");
}).listen(80, function () {
    console.log("server is start!!!listening on 65534 port!");
});*/
/*
var http=require("http");
var url=require("url");
var fs=require("fs");
var server=http.createServer(function (request, response) {
    //解析客户端请求的url地址
    var urlObj=url.parse(request.url,true);
    var pathname=urlObj.pathname;
    var query=urlObj.query;
    
    var reg=/\.(HTML|CSS|JS)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase();
        var suffixType="text/plain";
        switch (suffix){
            case "HTML":
                suffixType="text/html";
                break;
            case "CSS":
                suffixType="text/css";
                break;
            case "JS":
                suffixType="text/javascript";
                break;
        }
        var conFile=fs.readFileSync("."+pathname,"utf-8");
        response.writeHead(200,{"content-type":suffixType+";charset=utf-8;"});
        response.end(conFile);
        return;
    }
*/
/*var http=require("http");
var fs=require("fs");
var url=require("url");
var server=http.createServer(function (request, response) {
    var urlObj=url.parse(request.url,true);
    var pathname=urlObj.pathname,query=urlObj.query;
    var reg=/\.(HTML|CSS|JS)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase();
        var suffixType="text/plain";
        switch (suffix){
            case "HTML":
                suffixType="text/html";
                break;
            case "CSS":
                suffixType="text/css";
                break;
            case "JS":
                suffixType="text/javascript";
                break;
        }
        var conFile=fs.readFileSync("."+pathname,"utf-8");
        response.writeHead(200,{"content-type":suffixType+";charset=utf-8;"});
        response.end(conFile);
        return;
    }*/
/*
    if(pathname==="/getData"){
        var n=query["n"];

        var con=fs.readFileSync("./json/json.json","utf-8");
        //将接收的json字符串转化了json对象
        con=JSON.parse(con);

        var arr=[];
        for(var i=(n-1)*10;i<n*10-1;i++){
            if(i>con.length){
                break;
            }
            var curData=con[i];
            arr.push(curData);
        }
        response.writeHead(200,{"content-type":"application/json;charset=utf-8;"});
        response.end(JSON.stringify({
            total:Math.ceil(con.length/10),
            data:arr
        }));
        return;
    }
    response.writeHead(404);
    response.end("文件不存在");
*/
/*
    if(pathname==="/getData"){
        var n=query["n"];

        var con=fs.readFileSync("./json/json.json","utf-8");
        con=JSON.parse(con);
        var arr=[];
        for(var i=(n-1)*10;i<=n*10-1;i++){
            if(i>con.length-1){
                break;
            }
            var curData=con[i];
            arr.push(curData);
        }
        response.writeHead(200,{"content-type":"application/json;charset=utf-8;"});
        console.log(arr);
        response.end(JSON.stringify({
            total:Math.ceil(con.length/10),
            data:arr
        }));
        console.log(JSON.stringify({
            total:Math.ceil(con.length/2),
            data:arr
        }));
        return;
    }
    response.writeHead(404);
    response.end("file is not found!")
*/
/*    if(pathname==="/getData"){
        var n=query["n"];
        var con=fs.readFileSync("./json/json.json","utf-8");
        con=JSON.parse(con);
        var arr=[];
        for(var i=(n-1)*10;i<n*10-1;i++){
            var curData=con[i];
            arr.push(curData);
        }
        response.writeHead(200,{"content-type":"application/json;charset=utf-8"});
        response.end(JSON.stringify({
            total:Math.ceil(con.length/10),
            data:arr
        }));
        return;
    }
    response.writeHead(404);
    response.end("failed")*/
/*if(pathname==="/getData"){
    var n=query["n"];
    var con=fs.readFileSync("./json/json.json","utf-8");
    con=JSON.parse(con);
    var arr=[];
    for(var i=(n-1)*10;i<=n*10-1;i++){
        var curData=con[i];
        arr.push(curData);
    }
    response.writeHead(200,{"content-type":"application/json;charset=utf-8;"});
    response.end(JSON.stringify({
        total:Math.ceil(con.length/10),
        data:arr
    }))
}
    response.writeHead(404);
    response.end("failed!")

}).listen(80,function () {
    console.log("server is start!!!");
})*/
var http=require("http");
var fs=require('fs');
var url=require("url");

var server=http.createServer(function (request, response) {
    var urlObj=url.parse(request.url,true);
    var pathname=urlObj.pathname,query=urlObj.query;
    var reg=/\.(HTML|CSS|JS)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase();
        var suffixType="text/plain";
        switch(suffix){
            case "HTML":
                suffixType="text/html";
                break;
            case "CSS":
                suffixType="text/css";
                break;
            case "JS":
                suffixType="text/javascript";
                break;
        }
        var conFile=fs.readFileSync("."+pathname,"utf-8");
        response.writeHead(200,{"content-type":suffixType+";charset=utf-8;"});
        response.end(conFile);
        return;
    }
    if(pathname==="/getData"){
        var n=query["n"];
        var con=fs.readFileSync("./json/json.json","utf-8");
        con=JSON.parse(con);
        var arr=[];
        for(var i=(n-1)*10;i<=n*10-1;i++){
            console.log(n,con[87]);
            if(i>con.length-1){
                break;
            }
            var curData=con[i];
            arr.push(curData);
        }
        response.writeHead(200,{"content-type":"application/json;charset=utf-8;"});
        response.end(JSON.stringify({
            //86除以10等于8.6再向上取整
            total:Math.ceil(con.length/10),
            data:arr
        }));
        return;
    }
    response.writeHead(404);
    response.end("failed!");
}).listen(80,function () {
    console.log("ok");
});








