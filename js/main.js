//cookie处理
var Cookie = {
    get: function (n) {
        var dc = "; " + document.cookie + "; ";
        var coo = dc.indexOf("; " + n + "=");
        if (coo != -1) {
            var s = dc.substring(coo + n.length + 3, dc.length);
            return unescape(s.substring(0, s.indexOf("; ")));
        } else {
            return null;
        }
    },
    set: function (name, value, expires, path, domain, secure) {
        var expDays = expires * 24 * 60 * 60 * 3;
        var expDate = new Date();
        expDate.setTime(expDate.getTime() + expDays);
        var expString = expires ? "; expires=" + expDate.toGMTString() : "";
        var pathString = "; path=" + (path || "/");
        var domain = domain ? "; domain=" + domain : "";
        document.cookie = name + "=" + escape(value) + expString + domain + pathString + (secure ? "; secure" : "");
    },
    del: function (n) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.get(n);
        if (cval != null) document.cookie = n + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

//增加阅读数
function readbook(bookid) {
    $.get("/click.php?aid=" + bookid);
}

function vote_nomsg(aid) {
    $.get('/modules/article/uservote.php?id=' + aid + '&ajax_request=1');
}

function killErrors() {
    return true;
}
window.onerror = killErrors;

/**
 * 用户信息Cookie显示
 */


function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(arr[2]);
    } else {
        return null;
    }
}
function get_cookie_value() {
    var bookList = new Array();
    var strBookList = getCookie("booklist");
    if (strBookList != null && strBookList != undefined && strBookList.length > 0) {
        var arrBookList = strBookList.split(",");
        for (var i = 0; i < arrBookList.length; i++) {
            var bookItem = JSON.parse(unescape(arrBookList[i]));
            bookList[bookItem.BookId] = bookItem;
        }
    }
    return bookList;
}
var isLogin = getCookie("_17mb_username");
function login() {
    if (isLogin) {
        document.writeln("<a href=\"\/history.html\">阅读历史</a> | <a href=\"\/mybook.php\" title='我的书架'>会员书架<\/a> | <a href=\"\/logout.php?jumpurl="+location.href+"\" title='退出登录'>退出<\/a>")
    } else {
        document.writeln("<a href=\"\/history.html\">阅读历史</a> | <a href=\"\/login.php?jumpurl="+location.href+"\">登录</a> | <a href=\"\/register.php\">注册</a>")
    }
}


//生成报错链接
// function ErrorLink(articlename){
// 	var error_url='/newmessage.php?tosys=1&title=《'+ articlename+'》催更报错&content='+ location.href;
// 	$("#errorlink,.errorlink").attr('href',error_url);
// }
function ErrorLink(act,title) {
    var url = 'https://www.qqwenxue.com/error/bc.php?act=' + act + '&title='+title;
    alert("提交成功,编辑会尽快处理!");
    $.get(url);
}
//阅读页键盘操作事件
function ReadKeyEvent() {
    var index_page = $("#linkIndex").attr("href");
    var prev_page =  $("#linkPrev").attr("href");
    var next_page = $("#linkNext").attr("href");
    function jumpPage() {
        var event = document.all ? window.event : arguments[0];
        if (event.keyCode == 37) document.location = prev_page;
        if (event.keyCode == 39) document.location = next_page;
        if (event.keyCode == 13) document.location = index_page;
    }
    document.onkeydown = jumpPage;
}

//处理ajax返回的消息
function showMsg(msg){
    isLogin = isLogin && msg.indexOf("您需要登录")<=0;
    if(!isLogin){
        if(confirm("对不起，您需要登录才能使用本功能！点击确定立即登录。")){
            window.location.href = "/login.php?jumpurl="+location.href;
        }
        return false;
    }
    alert(msg.replace(/<br[^<>]*>/g, '\n'));
}

//加入书架
function TimeTo(url){
	window.location.href= url;
}
$(function(){
	$documnetHeight = $(document).height();
    $scrollHeight = $(document).scrollTop();
    $windowHeight = $(window).height();
    $windowWidth = $(window).width();
});
function tip(ps){
	$(function(){
		$("body").append('<div id="pagetip"></div><div id="tipcon">'+ps+'</div>');
		$("#pagetip").height($documnetHeight);
		$tipconHeight = $("#tipcon").height();
		$("#tipcon").css("top",($scrollHeight+($windowHeight/2)-$tipconHeight)+"px");
		$("#pagetip").show().css("opacity","0.7").click(function(){$(this).remove();$("#tipcon").remove()});
		$("#tipcon").css("opacity","0.9");
	})	
}
function addbookcase(article_id){
	$.get('/ajax.php',{'addbookcase':'1','aid':article_id},
		function(data){
			data=data.replace(/\s/g,'');data=data.split("|");
			if(data[0]==1){
				$('#sj').animate({left:"-5px"},20).animate({left:"10px"},20).animate({left:"-10px"},20).animate({left:"0px"},20).html('已加入书架');
				tip("成功加入书架");
			}
			else{
				tip("未登录，正在跳转到登录页...")
				setTimeout('TimeTo("/login.php?jumpurl=/mybook.php")',1500);
			}
		});
}

//加入书签
function addmark(article_id, chapter_id) {
	$.get('/ajax.php',{'addmark':'1','aid':article_id,'cid':chapter_id},
		function(data){
			data=data.replace(/\s/g,'');data=data.split("|");
			if(data[0]==1){
				$('#sj').animate({left:"-5px"},20).animate({left:"10px"},20).animate({left:"-10px"},20).animate({left:"0px"},20).html('已加入书架');
				tip("成功加入书签");
			}
			else{
				tip("未登录，正在跳转到登录页...")
				setTimeout('TimeTo("/login.php")',1500);
			}
		});
}

// 书架删除
function delbookcase(article_id){
	$.post("/ajax.php",{"aid":article_id,"delbookcase":"1"},function(data){
		$("#"+article_id).html("<tr><td class='del1'>删除中，请稍后...</td></tr>");if(data != ""){
			$("#"+article_id).html("<tr><td class='del1'>已从书架删除！</td></tr>");
			tip("已从书架删除！");
		}
	});
	window.location.href = ""+location.href;
}

//推荐书籍
function like(book_id){
    $.post('/ajax.php?vote=1&aid='+book_id,function(e){
		e = e.replace(/\s/g,'');
        if(e=='3') location.href="/login.php?jumpurl=%2Fbook%2F"+book_id+".html";
		if(e=='4') alert("未知错误!");
		if(e=='1') alert("感谢您的推荐!");
		if(e=='2') alert("一天只能推荐一次!");
    });
}
//历史记录
var _num = 100;

function LastRead(){
	this.bookList="bookList"
	}
LastRead.prototype={	
	set:function(bid,tid,title,texttitle,author,sortname){
		if(!(bid&&tid&&title&&texttitle&&author&&sortname))return;
		var v=bid+'#'+tid+'#'+title+'#'+texttitle+'#'+author+'#'+sortname;
		this.setItem(bid,v);
		this.setBook(bid)		
		},
	
	get:function(k){
		return this.getItem(k)?this.getItem(k).split("#"):"";						
		},
	
	remove:function(k){
		this.removeItem(k);
		this.removeBook(k)			
		},
	
	setBook:function(v){
		var reg=new RegExp("(^|#)"+v); 
		var books =	this.getItem(this.bookList);
		if(books==""){
			books=v
			}
		 else{
			 if(books.search(reg)==-1){
				 books+="#"+v				 
				 }
			 else{
				  books.replace(reg,"#"+v)
				 }	 
			 }	
			this.setItem(this.bookList,books)
		
		},
	
	getBook:function(){
		var v=this.getItem(this.bookList)?this.getItem(this.bookList).split("#"):Array();
		var books=Array();
		if(v.length){
			
			for(var i=0;i<v.length;i++){
				var tem=this.getItem(v[i]).split('#');	
				if(i>v.length-(_num+1)){
					if (tem.length>3)	books.push(tem);
				}
				else{
					lastread.remove(tem[0]);
				}
			}		
		}
		return books		
	},
	
	removeBook:function(v){		
	    var reg=new RegExp("(^|#)"+v); 
		var books =	this.getItem(this.bookList);
		if(!books){
			books=""
			}
		 else{
			 if(books.search(reg)!=-1){	
			      books=books.replace(reg,"")
				 }	 
			 
			 }	
			this.setItem(this.bookList,books)		
		
		},
	
	setItem:function(k,v){
		if(!!window.localStorage){		
			localStorage.setItem(k,v);		
		}
		else{
			var expireDate=new Date();
			  var EXPIR_MONTH=30*24*3600*1000;			
			  expireDate.setTime(expireDate.getTime()+12*EXPIR_MONTH)
			  document.cookie=k+"="+encodeURIComponent(v)+";expires="+expireDate.toGMTString()+"; path=/";		
			}			
		},
		
	getItem:function(k){
		var value=""
		var result=""				
		if(!!window.localStorage){
			result=window.localStorage.getItem(k);
			 value=result||"";	
		}
		else{
			var reg=new RegExp("(^| )"+k+"=([^;]*)(;|\x24)");
			var result=reg.exec(document.cookie);
			if(result){
				value=decodeURIComponent(result[2])||""}				
		}
		return value
		
		},
	
	removeItem:function(k){		
		if(!!window.localStorage){
		 window.localStorage.removeItem(k);		
		}
		else{
			var expireDate=new Date();
			expireDate.setTime(expireDate.getTime()-1000)	
			document.cookie=k+"= "+";expires="+expireDate.toGMTString()							
		}
		},	
	removeAll:function(){
		if(!!window.localStorage){
		 window.localStorage.clear();		
		}
		else{
		var v=this.getItem(this.bookList)?this.getItem(this.bookList).split("#"):Array();
		var books=Array();
		if(v.length){
			for( i in v ){
				var tem=this.removeItem(v[k])				
				}		
			}
			this.removeItem(this.bookList)				
		}
		}	
	}
function showbook(){
	var showbook=document.getElementById('showbook');
	var bookhtml='';
	var books=lastread.getBook();
	var books=books.reverse();
	if(books.length){
		for(var i=0 ;i<books.length;i++){
			bookhtml+='<div class="bookbox"><div class="p10"><span class="num">'+(i+1)+'</span><div class="bookinfo"><h4 class="bookname"><a href="/wenxue/'+books[i][0]+'/">'+books[i][2]+'</a></h4><div class="cat">分类：'+books[i][5]+'</div><div class="author">作者：'+books[i][4]+'</div><div class="update"><span>已读到：</span><a href="/wenxue/'+books[i][0]+'/'+books[i][1]+'.html">'+books[i][3]+'</a></div></div><div class="delbutton"><a class="del_but" href="javascript:removebook(\''+books[i][0]+'\')">删除</a></div></div></div>';
		}
	}else{
		bookhtml+='<div style="height:100px;line-height:100px; text-align:center">还木有任何书籍( ˙﹏˙ )</div>'
	}
	showbook.innerHTML=bookhtml;
}
function removebook(k){
	lastread.remove(k);
	showbook()
}
window.lastread = new LastRead();

function tongji(){

var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?78473f93bd4d7100c76e8faa1ab0a029";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();


    (function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
	})();

}

//cnzz统计
function cnzz() {
	
}

//是否移动端
function is_mobile() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
        return true;
    }
    var result = regex_match.exec(u);
    if (null == result) {
        return false
    } else {
        return true
    }
}
//报错



// function baocuo(act,title){
// 		$.post("/error/bc.php",{act: act,title:title },function(a){
// 				if(a=='1' || a=='2'){
// 					showMsg('报错成功，我们将尽快处理！');
// 				}
// 				else if(a=='0'){
// 					showMsg('报错太频繁，请休息30秒再来报错！');
// 				}
// 				else{
// 					showMsg('出现错误，请联系管理员！');
// 				}
// 			}
// 		);
// 	}