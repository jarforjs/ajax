var boxList = document.getElementById("boxList");
var page = document.getElementById("page");
var pageList = document.getElementById("pageList");
var oLis = pageList.getElementsByTagName("li");
var pageInput = document.getElementById("pageInput");
var n = 1, totalPage = 0;

//ajax获取数据,并且实现数据绑定
function bindHTML() {
    function callBack(jsonData) {
        //total总页数,data获取到的数据
        var total = jsonData["total"], data = jsonData["data"];
        totalPage = total;
        var str = "";
        for (var i = 0; i < data.length; i++) {
            var curData = data[i];
            var sex = curData["sex"] == 1 ? "女" : "男";
            str += "<li>";
            str += "<span>" + curData['num'] + "</span>";
            str += "<span>" + curData['name'] + "</span>";
            str += "<span>" + sex + "</span>";
            str += "<span>" + curData['score'] + "</span>";
            str += "</li>";
        }
        boxList.innerHTML = str;


        //绑定分页区域的数据:第一次把分页区域的数据绑定上,以后就不需要重新绑定了
        if (pageList.innerHTML==="") {
            str = "";
            for (i = 1; i <= total; i++) {
                if (i === 1) {
                    str += "<li class='bg'>" + i + "</li>";
                    continue;
                }
                str += "<li>" + i + "</li>";
            }
            pageList.innerHTML = str;
        }


        //让当前页码默认选中,并且让文本框中的值也跟着改变
        for (i = 0; i < oLis.length; i++) {
            oLis[i].className = i === (n - 1) ? "bg" : null;
        }
        pageInput.value = n;

    }

    //ajax
    var xhr = new XMLHttpRequest();
    xhr.open("get", "getData?n=" + n + "&_=" + Math.random(), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            callBack(JSON.parse(xhr.responseText));
            //console.log(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}
bindHTML();


//使用时间委托实现分页区域的点击操作

page.onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement;
    var tarTag = tar.tagName.toUpperCase();

    //点击的是首页,尾页,上一页,下一页
    if (tarTag === "DIV") {
        if (tar.innerHTML === "FIRST") {
            if (n === 1) {
                return;
            }
            n = 1;
        }
        if (tar.innerHTML === "LAST") {
            if (n === totalPage) {
                return;
            }
            n = totalPage;
        }
        if (tar.innerHTML === "PREV") {
            if (n === 1) {
                return;
            }
            n--;
        }
        if (tar.innerHTML === "NEXT") {
            if (n === totalPage) {
                return;
            }
            n++;
        }
        bindHTML();
    }

    //点击的是页码
    if (tarTag === "LI") {
        var tempN = parseFloat(tar.innerHTML);
        if (tempN === n) {
            return;
        }
        n = tempN;
        bindHTML();
    }
};

//给文本框绑定事件
pageInput.onkeyup = function (e) {
    e = e || window.event;
    //只有按下enter键才实现页码切换
    if (e.keyCode === 13) {
        var num = Number(this.value.replace(/^ +| +$/g, ""));
        if (isNaN(num)) {
            //输入的内容不是有效的数字,默认还是显示当前页的内容
            this.value = n;
            return;
        }

        //输入的当前页正好和当前页
        if (num === n) {
            return;
        }

        //输入的是有效数字:小于1,让其等于1,大于9,让其等于9,否则输入的是多少,当前页就是多少;
        if (num < 1) {
            this.value = 1;
            n = 1;
        } else if (num > totalPage) {
            this.value = totalPage;
            n = totalPage;
        } else {
            n = num;
        }
        bindHTML();
    }
};