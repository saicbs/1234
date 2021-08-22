/**
 * 手机端全局公用函数
 */

/**************************************************************************************************
 * 对话框相关
 **************************************************************************************************/
/*********************
 * Global Variables
 *********************/
var m_undef = "undefined";
var m_gid = new Number(1);
var pUrl = "http://m.u17.com";
/***********************************************************
 * 全局函数
 ***********************************************************/
var global={
	backToTop:function(){
		$("html,body").animate({"scrollTop":"0"},"slow");
	},
	nextId:function(){
		return m_gid++;
	},
	goLoginPage:function() {
		var url = document.URL;
		var b = new Base64();
		var u = b.encode(url);
		u=u.replace("/","_");
		window.location.href="http://m.u17.com/user/login?uri="+u;
	}
}

/**********************
 * 提示框基类
 * @param args
 * @returns
 **********************/
function M_Prompt(args){
	this.args = args;
	this.dlgId = "m_dlg_"+global.nextId();
	this.content = "";//对话框内容
	this.contentId = "m_dlg_content_id";
	
	this.close = function(){//默认的关闭事件
		/*
		 * 声明此变量在关闭函数内并没有作用
		 * 但是当指定了 onclose  onclosed 事件之后 此变量可以为事件内的代码提供一个可以操作当前对话框的上下文
		 */
		var self = this;
		// -- onclose event -- //
		if (typeof args != m_undef) if (typeof args.onclose != m_undef) args.onclose();
		$("#"+this.dlgId).remove();
		// -- onclose event -- //
		if (typeof args != m_undef) if (typeof args.onclosed != m_undef) args.onclosed();
	};
	this.autoClose = function(seconds){//自动关闭事件 seconds为自动关闭的秒数 
		var self = this;
		setTimeout(function(){self.close();},seconds*1000);
	};
	this.show = function(){
		if (this.content == "")  return;
		var self = this;
		// -- onopen event -- //
		if (typeof args != m_undef)
			if (typeof args.onopen != m_undef)
				args.onopen();
		/******************************************************************************************/
		var div = $("<div class=\"feed_btn feed_fix\" id=\""+this.dlgId+"\"></div>");
		div.append(this.content);
		$("body").append(div);
		/*****************************************************************************************/
		// -- onopened event -- //
		if (typeof args != m_undef) if (typeof args.onopened != m_undef) args.onopened();
	};
	//更新对话框内容
	this.updateContent=function(html){
		$("#"+this.contentId).html(html);
	};
	this.getCss=function(){
		return "feed_btn";
	};
	// -- 初始化 --
	if (typeof args != m_undef) {
		if (typeof args.dlgId != m_undef)	 this.dlgId = args.dlgId;
		if (typeof args.content != m_undef)	 this.content = args.content;
		if (typeof args.autoClose != m_undef)this.autoClose(args.autoClose);
	}
}
/**********************
 * 提示框基类(加长版)，显示的内容更多
 * @param args
 * @returns
 **********************/
function M_Prompt_Long(args) {
	M_Prompt.call(this,args);
	this.show=function(){
		var div=$("<div class=\"comic_list_tishi col_white\" style=\"display:block\" id=\""+this.dlgId+"\"></div>");
		div.append(this.content);
		$("body").append(div);
	};
	this.getCss=function(){
		return "comic_list_tishi";
	};
}


/*********************
 * 加载框
 * 加载提示框,有gif动画和加载"..."的变化
 * @param args
 * @returns
 *********************/
function M_LoadPrompt(args){
	M_Prompt.call(this,args);
	delete this.autoClose;
	delete this.updateContent;
	var interval=null;
	this.dotNums = 0;//文本冲出现"."的个数 默认1个

	//重写父类的show方法
	this.show = function(){
		var self = this;
		if(typeof this.args != m_undef) if(typeof this.args.onopen != m_undef) this.args.onopen();
		var loading=$("<div class=\"loading\" id=\""+this.dlgId+"\"></div>");
		$("<div class=\"loading_bottom\" id=\"m_load_bottom\"></div>").appendTo(loading);
		$("<div class=\"load_img01\" id=\"m_load_img\"></div>").appendTo(loading);
		$("<div class=\"loading_txt\" id=\"m_load_txt\">"+this.content+"</div>").appendTo(loading);
		$("body").append(loading);
		interval=setInterval(function(){
			self.dotNums++;
			if(self.dotNums>3) self.dotNums=1;
			var append="";
			for(i=0;i<self.dotNums;i++){
				append+=".";
			}
			$("#m_load_img").attr("class","load_img0"+self.dotNums);
			$("#m_load_txt").html(self.content+append);
		},300);
		if(typeof this.args != m_undef) if(typeof this.args.onopened != m_undef) this.args.onopened();
	};
	this.close = function(){
		//var self = this;
		if(typeof this.args != m_undef) if(typeof this.args.onclose != m_undef) this.args.onclose();
		clearInterval(interval);
		$("#"+this.dlgId).remove();
		if(typeof this.args != m_undef) if(typeof this.args.onclosed != m_undef) this.args.onclosed();
	};
	this.getCss=function(){
		return "loading";
	};
}
/****************
 * 页面底部的加载框	*
 ****************/
function M_FooterLoading(args){
	M_Prompt.call(this,args);
	delete this.autoClose;
	delete this.updateContent;
	var interval=null;
	this.dotNums=0;
	
	var beforeLoading_txt="<span class=\"loadding_more\"></span>点我加载更多";
	this.loading_txt = "<span class=\"loadding\"></span>加，加载中";
	
	this.show=function(){
		$("#"+this.dlgId).html(this.loading_txt);
		var self = this;
		if ($("#"+this.dlgId).attr("load")=="false"){
			$("#"+this.dlgId).attr("load","true");
			interval=setInterval(function(){
				self.dotNums++;
				if(self.dotNums>3) self.dotNums=1;
				var append = "";
				for(i=0;i<self.dotNums;i++){
					append+=".";
				}
				$("#"+self.dlgId).html(self.loading_txt+append);
			},500);
		}
	};
	this.close=function(){
		clearInterval(interval);
		$("#"+this.dlgId).attr("load","false");
		$("#"+this.dlgId).html(beforeLoading_txt);
	};
	this.remove=function(){
		clearInterval(interval);
		$("#"+this.dlgId).attr("load","false");
		$("#"+this.dlgId).remove();
	};
	this.getCss=function(){
		return "";
	};
}

/****************
 * 付费会员提示框	*
 ****************/
function M_PayPrompt(args){
	M_Prompt.call(this,args);

	this.show=function(){
		var div=$("<div class=\"ui_mark\" style=\"display:block;\" id=\""+this.dlgId+"\"/>");
		div.append(this.content);
		$("body").append(div);
	};
	this.getCss=function(){
		return "ui_mark";
	};
}

/****************
 * 最后一张图片提示框	*
 ****************/
function M_LastImgPrompt(args){
	M_Prompt.call(this,args);
	this.dlgId = "m_dlg_lastimg";
	this.show=function(){
		var div = $("<div class=\"ui_mark\" style=\"display:block;\" id=\""+this.dlgId+"\">");
		div.append($("<p class=\"col_white f18\">已经是最后一张了哟</p>"));
		div.append($("<a class=\"col_white into_myshelf_btn\" onclick=\"$('#m_dlg_lastimg').remove();m_favorite.add(null,"+mReader.comicId+");\">把本书加入我的书架</a>"));
		div.append($("<a class=\"down_bg ml10 mr10\" href=\"/download/client/0\">安装移动客户端，快速获取章节更新通知</a>"));
		$("body").append(div);
	};
	this.getCss=function(){
		return "ui_mark";
	};
	
}

///************
// * 书架提示	*
// ************/
//function M_FavoritePrompt(args){
//	M_Prompt.call(this,args);
//	this.show=function(){
//		var div = $("<div class=\"into_shelf col_white f16\" style=\"display:block;\" id=\""+this.dlgId+"\">"+this.content+"</div>");
//		$("body").append(div);
//	}
//}
/********************
 * 章节更换提示			*
 ********************/
function M_ChapterChangePrompt(args){
	M_Prompt.call(this,args);
	this.show=function(){
		var div = $("<div class=\"into_shelf col_white f16\" style=\"display:block;\" id=\""+this.dlgId+"\">"+this.content+"</div>");
		$("body").append(div);
	};
	this.getCss=function(){
		return "into_shelf";
	};
}
/**********************
 * 图片加载提示框 
 */
function M_LoadImagePrompt(args) {
	M_Prompt.call(this.args);
	var content = "玩命加载中",
		interval = null,
		timeout = null,//显示时间
		id = "m_load_img";
	this.show=function(){
		//半秒钟后显示对话框
		var div = $("<div id=\"m_load_img\" style=\"position: absolute; text-align: center; height: 20px; line-height: 20px; left: 50%; top: 50%; width: 200px; margin-left: -100px; margin-top: -10px; color: white; font-size: 14px;  display: block; \" class=\"vmh_loading vmh_msg vmh_ctl\">"+content+"</div>");
		$("body").append(div);
		var dot = ".",
			nums = 1;
		interval = setInterval(function(){
			if (nums > 3) nums=0;
			var dot1 = "";
			for (i=0; i<nums; i++) {
				dot1 += dot;
			}
			nums++;
			$("#"+id).html(content+dot1);
		},300);
	};
	this.close=function(){
		clearTimeout(timeout);
		clearInterval(interval);
		$("#"+id).remove();
	}
	this.getCss=function(){
		return "vmh_loading";
	}
}

//M_LoadPrompt.prototype=new M_Prompt();
/*************************************************************************************************
 * 对话框  基本对话框类  继承提示框类
 * function M_Dialog(args){
 * 	M_Prompt.call(this,args);
 * 	
 * }
 * M_Prompt.prototype=new M_Prompt();
*************************************************************************************************/
var m_dlg={
	/*
	 * args:{
	 * 	dlgId:,(可选内容)
	 * 	content:,不填写内容对话框不会显示(必填内容)
	 * 	autoClose:,(内容为数字  自动关闭时间) (可选内容)
	 * 	onopen:function(){},打开对话框之前执行的自定义函数(可选内容)
	 * 	onopened:function(){},打开对话框之后执行的自定义函数(可选内容)
	 * 	onclose:function(){},关闭对话框之前执行的自定义函数(可选内容)
	 * 	onclosed:function(){}关闭对话框之后执行的自定义函数(可选内容)
	 * }
	 */
	showPrompt:function(args){
		//显示一个普通的提示框
		var prompt = new M_Prompt(args);
		// ------------------------------------------------------- //
		// 移除对话框，保证只弹出一个对话框
		var _css = prompt.getCss();
		$("div."+_css).remove();
		// ------------------------------------------------------- //
		prompt.show();
		return prompt;
	},
	/*
	 * 基本对话框的加长版,,显示更多的内容
	 */
	showPromptLong:function(args){
		var prompt = new M_Prompt_Long(args);
		var _css = prompt.getCss();
		$("div."+_css).remove();
		prompt.show();
		return prompt;
	},
	/*
	 * 显示章节更换提示
	 */
	showChapterChangePrompt:function(args){
		var prompt = new M_ChapterChangePrompt(args);
		// ------------------------------------------------------- //
		// 移除对话框，保证只弹出一个对话框
		var _css = prompt.getCss();
		$("div."+_css).remove();
		// ------------------------------------------------------- //
		prompt.show();
		return prompt;
	},
	/*
	 * 显示付费提示框
	 */
	showPayPrompt:function(){
		var content = "<p class=\"col_white f16\">本章节为付费章节</p>"
						+ "<p class=\"col_white f12\">移动浏览器版支付功能仍在开发中,您可以</p>"
						+ "<a class=\"down_bg ml10 mr10\" href=\"/download/client/0\" data-ajax=\"false\">安装移动客户端，使用客户端付费后继续阅读</a>";
		var args = {"content":content,"autoClose":3};
		var prompt = new M_PayPrompt(args);
		// ------------------------------------------------------- //
		// 移除对话框，保证只弹出一个对话框
		var _css = prompt.getCss();
		$("div."+_css).remove();
		// ------------------------------------------------------- //
		prompt.show();
		return prompt;
	},
	/*
	 * 封印的章节提示框
	 */
	showVipPrompt:function(relTime){
		var secOfWeek = 60*60*24*7;
		var nDay = 24*60*60;
		var nHour = 60*60;
		var nMin = 60;
		var _curMils = new Date().getTime();
		var _curSec = (""+_curMils).substring(0,10);
		var time = secOfWeek-((new Number(_curSec))-relTime);
		
		var temp = time%nDay;
		var _day = (temp==0 ? Math.round(time/nDay) : Math.round((time-temp)/nDay));
		time = time - nDay*_day;
		temp=time%nHour;
		var _hour = (temp==0 ? Math.round(time/nHour) : Math.round(((time-temp)/nHour)));
		time = time - nHour*_hour;
		temp = time%nMin;
		var _min = (temp==0 ? Math.round(time/nMin) : Math.round(((time-temp)/nMin)));
		
		var date = _day+"天"+_hour+"小时"+_min+"分";
		var content = "<p class=\"col_white f16\">本章节已被封印</p>"
					+ "<p class=\"col_white f14\">距离解除封印还有"+date+"</p>"
					+ "<a class=\"down_bg ml10 mr10\" href=\"/download/client/0\">安装移动客户端，成为VIP会员即可破除封印</a>";
		var args = {"content":content,"autoClose":3};
		var prompt = new M_PayPrompt(args);
		// ------------------------------------------------------- //
		// 移除对话框，保证只弹出一个对话框
		var _css = prompt.getCss();
		$("div."+_css).remove();
		// ------------------------------------------------------- //
		prompt.show();
		return prompt;
	},
	/**
	 * 显示最后一个图片提示
	 */
	showLastImgPrompt:function(){
		var prompt = new M_LastImgPrompt();
		// ------------------------------------------------------- //
		// 移除对话框，保证只弹出一个对话框
		$("#m_dlg_lastimg").remove();
		// ------------------------------------------------------- //
		prompt.show();
		return prompt;
	},
	/**
	 * 删除最后一页提示框
	 */
	removeLastImgPrompt:function(){
		$("#m_dlg_lastimg").remove();
	},
//	/******************
//	 * 书架提示
//	 */
//	showFavoritePrompt:function(args){
//		//<div class="into_shelf col_white f16" style="display:block;">成功加入书架了</div>
//		var dlg = new M_FavoritePrompt(args);
//		dlg.show();
//		return dlg;
//	},
	/*
	 * args是一个json数据,,在提示框的现实中 不过不传args 会使用默认参数
	 * args:{
	 * 	dlgId:,(可选内容)
	 *  content:,(可选内容)
	 *  onopen:function(){//执行内容},打开对话框之前执行的自定义函数(可选内容)
	 *  onopened:function(){//执行内容},打开对话框之后执行的自定义函数(可选内容)
	 *  onclose:function(){//执行内容},关闭对话框之前执行的自定义函数(可选内容)
	 *  onclosed:function(){//执行内容}关闭对话框之后执行的自定义函数(可选内容)
	 * }
	 *　此函数暂时不启用，使用动态的加载框
	showLoading:function(args){
		//显示正在加载提示框
		if(typeof args == m_undef)
			args = {
				"dlgId":"m_dlg_loading",
				"content":"努力加载中"
				};
		var loading = new M_LoadPrompt(args);
		loading.show();
		return loading;
	}
	*/
	showLoading:function(){
		var loading = new M_LoadPrompt({"content":"加载中"});
//		loading.show();
		return loading;
	},
	/*
	 * 显示页面元素底部的loading
	 */
	showFooterLoading:function(loadingId){
		var id = "";
		if (loadingId == null || loadingId == undefined || loadingId == "")
			id = "m_footer_loading";
		else
			id = loadingId;
		var loading = new M_FooterLoading({"dlgId":id});
		loading.show();
		return loading;
	},
	showLoadImgDlg:function(){
		//<div style="position: absolute; text-align: center; height: 20px; line-height: 20px; left: 50%; top: 50%; width: 200px; margin-left: -100px; margin-top: -10px; color: white; font-size: 14px;  display: block; " class="vmh_loading vmh_msg vmh_ctl">该漫画正在努力加载中……</div>
		var dlg = new M_LoadImagePrompt();
		var id = "m_load_img";
		if (mReader.loadDlg != null)
			mReader.loadDlg.close();
		mReader.loadDlg = null;
		dlg.show();
		return dlg;
	},
	closeLoadImgDlg:function(){
		var id = "m_load_img";
		$("#"+id).remove();
	}
}

/**************************************************************************************************
 * 加载内容相关
 **************************************************************************************************/
/******
 * args:{
 * 		id:,	
 * 		append:,
 * 		interLimit:,
 * 		content:,
 * }
 */
function M_Loading(args){
	if(typeof args == m_undef) throw new Error("can't found args");
	
	if(typeof args.id == m_undef) throw new Error("can't found id");
	else this.id = args.id;
	
	if(typeof args.append == m_undef) this.append = ".";
	else this.append = args.append;
	
	if(typeof args.interLimit == m_undef) this.interLimit = 500;
	else this.interLimit = args.interLimit;
	
	if(typeof args.content == m_undef) this.content = "";
	else this.content = args.content;
	
	this.interval=null;
	
	this.show=function(){
		var self = this;
		var nums = 0;
		this.interval = setInterval(function(){
			var temp = "";
			var tempCount = self.content+self.append;
			for(i=0;i<nums;i++){
				temp+=self.append;
			}
			tempCount = tempCount + temp;
			$("#"+self.id).html(tempCount);
			nums++;
			if(nums==3)nums=0;
		},self.interLimit);
	},
	this.close=function(){
		clearInterval(this.interval);
		$("#"+this.id).html(this.content);
	}
}
var m_load={
	showIndexLoad:function(id){
		var args = {"id":id,"content":"换一换"};
		var load = new M_Loading(args);
		load.show();
		return load;
	}
}

/**************************************************************************************************
 * 书架相关
 **************************************************************************************************/
var m_favorite={
	favorite:function(favObj,co){
		var fav = $("#"+favObj.id).attr("fav");
		if(fav=="true"){
			this.del(favObj,co);
		}else if(fav=="false"){
			this.add(favObj,co);
		}
	},
	hasRead:function(){
		var load = $("#m_has_read").attr("load");
		var dlg = m_dlg.showLoading();
		var callback=function(text){
			var arr = text.split(":");
			var n = text.indexOf(":");
			if (arr[0] == "true"){
				$("#m_hasread_loading").show();
			} else {
				$("#m_hasread_loading").hide();
			}
			$("#m_has_read").attr("load","true");
			var txt = text.substring(n+1,text.length);
			$("#m_hasread_content").html(txt);
			dlg.close();
			changeFavoriteLineColor();
		};
		var page = $("#m_has_read").attr("page");
		_ajax.get_text("http://m.u17.com/comic/last/read/all/"+page,callback);
	},
	add:function(favObj,comicId){
		//添加书架
		var dlg = m_dlg.showLoading();
		var callback=function(json){
			if(json.succ==true){
				if (favObj != null) {
					$("#"+favObj.id).attr("fav","true");
					$("#"+favObj.id).html("已收藏");
				}
			}
			var args={content:json.msg,autoClose:2};
			if (json.code == -20) {
				args = {content:json.msg,autoClose:2,onclosed:function(){global.goLoginPage();}};
			} else {
				args = {content:json.msg,autoClose:2};
			}
			m_dlg.showPrompt(args);
			dlg.close();
		};
		_ajax.get_json("http://m.u17.com/favorite/add?comicId="+comicId,callback);
	},
	del:function(favObj,comicId){
		//从书架中删除
		var dlg = m_dlg.showLoading();
		var callback=function(json){
			if(json.succ==true){
				if (favObj != null) {
					$("#"+favObj.id).attr("fav","false");
					$("#"+favObj.id).html("加入书架");
				}
			}
			var args={content:json.msg,autoClose:2};
			if (json.code == -20) {
				args = {content:json.msg,autoClose:2,onclosed:function(){global.goLoginPage();}};
			} else {
				args = {content:json.msg,autoClose:2};
			}
			m_dlg.showPrompt(args);
			dlg.close();
		};
		_ajax.get_json("http://m.u17.com/favorite/del?comicId="+comicId,callback);
	},
	delFavAndDom:function(comicId,domId){
		//从书架中删除,并且删除相应的dom元素
		var dlg = m_dlg.showLoading();
		var callback=function(json){
			if(json.succ==true){
				$("#m_fav_nums").html(json.msg);
				$("#"+domId).remove();
				m_dlg.showPrompt({content:"取消收藏成功",autoClose:2});
			}
			dlg.close();
		};
		_ajax.get_json("http://m.u17.com/favorite/del?comicId="+comicId,callback);
	}
}

/**************************************************************************************************
 * 漫画相关
 **************************************************************************************************/
var m_comic={
	lastRead:function(p){
		var dlg = m_dlg.showLoading();
		//最近阅读
		var callback=function(text){
			dlg.close();
		};
		p = (p==undefined?1:p);
		_ajax.get_text("http://m.u17.com/comic/last/read/"+p,callback);
	},
	lastUpdate:function(){
		var tab = $('.tab_title a').eq(1);
		if(tab.attr("loaded")=="true"){
			
		}else{
			var loading = m_dlg.showLoading();
			//最近更新
			var callback=function(text){
				$('.comic_con').eq(1).html(text);
				tab.attr("loaded","true");
				loading.close();
			};
			_ajax.get_text("http://m.u17.com/index/last/update",callback);
		}
	},
	replaceContent:function(obj,category,su){
		//首页换一批
		var loading = m_dlg.showLoading();
		var contentId="";
		switch(category){
		case 1:{
			contentId=(su==1?"s_shaonian":"u_shaonian");
			break;
		}
		case 2:{
			contentId=(su==1?"s_sige":"u_sige");
			break;
		}
		case 3:{
			contentId=(su==1?"s_shaonv":"u_shaonv");
			break;
		}
		case 4:{
			contentId=(su==1?"s_danmei":"u_danmei");
			break;
		}
		}
		
		var callback=function(json){
			if(json.succ==false){
				//提示用户加载失败
			}else{
				$("#"+contentId+" ul").remove();
				var ul1 = $("<ul class='comic_list'/>");
				var ul2 = $("<ul class='comic_list'/>");
				$(json.msg).each(function(index,obj){
					var li = $("<li/>");
					var a = $("<a href=\"/comic/info/"+obj.comicId+"\" data-ajax=\"false\"></a>").appendTo(li);
					$("<img src='"+obj.cover+"' class='comic_img'/>").appendTo(a);
					$("<span class='comic_title'>"+obj.name+"</span>").appendTo(a);
					$("<span class='comic_author'>"+obj.shortDescription+"</span>").appendTo(a);
					if(index>=0&&index<=2)
						ul1.append(li);
					else if (index>=3&&index<=6)
						ul2.append(li);
				});
				$("#"+contentId).append(ul1);
				$("#"+contentId).append(ul2);
			}
			loading.close();
		};
		var u = "";
		if(su==1){
			u = "http://m.u17.com/index/refresh/comic/"+category;
		}else{
			var page = $("#"+contentId).attr("page");
			page = new Number(page);
			page++;
			$("#"+contentId).attr("page",page);
			u = "http://m.u17.com/index/refresh/update/"+category+"/"+page;
		}
		_ajax.get_json(u,callback);
	}
}

/**************************************************************************************************
 * base64
 **************************************************************************************************/
function Base64() {  
    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
   
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
   
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
   
    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  
   
        }  
        return utftext;  
    }  
   
    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}