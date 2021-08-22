// author: houhongwei
// ajax相关
jQuery.xcookie = function(b, c, a) {
	return $.cookie("xx" + b, c, a);
};
var _ajax={
	get_json:function(url,callback){
		$.ajax({
			type:'get',
			url:url,
			cache:false,
			dataType:'json',
			success:function(json){callback(json);},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				callback({"succ":false,"msg":"未知错误"});
			}
		});
	},
	get_text:function(url,callback){
		$.ajax({
			type:'get',
			url:url,
			cache:false,
			dataType:'text',
			success:function(text){callback(text);},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				callback("请求失败");
			}
		});
	},
	post_json:function(url,data,callback){
		$.ajax({
			type:'post',
			url:url,
			data:data,
			cache:false,
			dataType:'json',
			success:function(json){callback(json);},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				callback({"succ":false,"msg":"未知错误"});
			}
		});
	},
	post_text:function(url,data,callback){
		$.ajax({
			type:'post',
			url:url,
			data:data,
			cache:false,
			dataType:'text',
			success:function(text){callback(text);},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				callback("请求失败");
			}
		});
	}
};
// 获得浏览器相关信息	----没有经过测试----
var _browser={
	engine:{
//		ie:0,
		gecko:0,
		webkit:0,
		khtml: 0,
	    opera: 0,
	    //complete version
	    ver: null
	},
	types:{
		//browsers
//	    ie: 0,
	    firefox: 0,
	    safari: 0,
	    konq: 0,
	    opera: 0,
	    chrome: 0,
	    safari: 0,
	    //specific version
	    ver: null
	},
	name:"",
	version:0,
	init:function(){
		//detect rendering engines/browsers
	    var ua = navigator.userAgent;    
	    if (window.opera){
	        this.engine.ver = this.types.ver = window.opera.version();
	        this.engine.opera = this.types.opera = parseFloat(this.engine.ver);
	    } else if (/AppleWebKit\/(\S+)/.test(ua)){
	        this.engine.ver = RegExp["$1"];
	        this.engine.webkit = parseFloat(this.engine.ver);
	        
	        //figure out if it’s Chrome or Safari
	        if (/Chrome\/(\S+)/.test(ua)){
	            this.types.ver = RegExp["$1"];
	            this.types.chrome = parseFloat(this.types.ver);
	            this.name = "chrome";
	        } else if (/Version\/(\S+)/.test(ua)){
	            this.types.ver = RegExp["$1"];
	            this.types.safari = parseFloat(this.types.ver);
	            this.name="sarari";
	        } else {
	            //approximate version
	            var safariVersion = 1;
	            if (this.engine.webkit  <  100){
	                safariVersion = 1;
	            } else if (this.engine.webkit  <  312){
	                safariVersion = 1.2;
	            } else if (this.engine.webkit  <  412){
	                safariVersion = 1.3;
	            } else {
	                safariVersion = 2;
	            }
	            
	            this.types.safari = this.types.ver = safariVersion;  
	            this.name="safari";
	        }
	    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
	        this.engine.ver = this.types.ver = RegExp["$1"];
	        this.engine.khtml = this.types.konq = parseFloat(this.engine.ver);
	        this.name="konq";
	    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
	    	this.engine.ver = RegExp["$1"];
	        this.engine.gecko = parseFloat(this.engine.ver);
	        
	        //determine if it’s Firefox
	        if (/Firefox\/(\S+)/.test(ua)){
	            this.types.ver = RegExp["$1"];
	            this.types.firefox = parseFloat(this.types.ver);
	            this.name="firefox";
	        }
	    } else if (/MSIE ([^;]+)/.test(ua)){
	        this.engine.ver = this.types.ver = RegExp["$1"];
	        this.engine.ie = this.types.ie = parseFloat(this.engine.ver);
	        this.name="ie";
	    } else {
	    	this.name=ua;
	    	this.types.ver=0;
	    }
	    this.version=this.types.ver;
	}
}


var _cfg_domain_root = "u17.com";
var _cfg_domain = _cfg_domain_root;
function utf8_decode(a) {
	var c = [],
	e = 0,
	g = 0,
	f = 0,
	d = 0,
	b = 0;
	a += "";
	while (e < a.length) {
		f = a.charCodeAt(e);
		if (f < 128) {
			c[g++] = String.fromCharCode(f);
			e++
		} else {
			if ((f > 191) && (f < 224)) {
				d = a.charCodeAt(e + 1);
				c[g++] = String.fromCharCode(((f & 31) << 6) | (d & 63));
				e += 2
			} else {
				d = a.charCodeAt(e + 1);
				b = a.charCodeAt(e + 2);
				c[g++] = String.fromCharCode(((f & 15) << 12) | ((d & 63) << 6) | (b & 63));
				e += 3
			}
		}
	}
	return c.join("")
}
function utf8_encode(a) {
	var h = (a + "");
	var j = "";
	var b, e;
	var c = 0;
	b = e = 0;
	c = h.length;
	for (var d = 0; d < c; d++) {
		var g = h.charCodeAt(d);
		var f = null;
		if (g < 128) {
			e++
		} else {
			if (g > 127 && g < 2048) {
				f = String.fromCharCode((g >> 6) | 192) + String.fromCharCode((g & 63) | 128)
			} else {
				f = String.fromCharCode((g >> 12) | 224) + String.fromCharCode(((g >> 6) & 63) | 128) + String.fromCharCode((g & 63) | 128)
			}
		}
		if (f !== null) {
			if (e > b) {
				j += h.substring(b, e)
			}
			j += f;
			b = e = d + 1
		}
	}
	if (e > b) {
		j += h.substring(b, h.length)
	}
	return j
}
function base64_decode(h) {
	var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var c, b, a, m, l, k, j, n, g = 0,
	o = 0,
	e = "",
	f = [];
	if (!h) {
		return h
	}
	h += "";
	do {
		m = d.indexOf(h.charAt(g++));
		l = d.indexOf(h.charAt(g++));
		k = d.indexOf(h.charAt(g++));
		j = d.indexOf(h.charAt(g++));
		n = m << 18 | l << 12 | k << 6 | j;
		c = n >> 16 & 255;
		b = n >> 8 & 255;
		a = n & 255;
		if (k == 64) {
			f[o++] = String.fromCharCode(c)
		} else {
			if (j == 64) {
				f[o++] = String.fromCharCode(c, b)
			} else {
				f[o++] = String.fromCharCode(c, b, a)
			}
		}
	} while ( g < h . length );
	e = f.join("");
	e = this.utf8_decode(e);
	return e
}
function base64_encode(h) {
	var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var c, b, a, m, l, k, j, n, g = 0,
	o = 0,
	f = "",
	e = [];
	if (!h) {
		return h
	}
	h = this.utf8_encode(h + "");
	do {
		c = h.charCodeAt(g++);
		b = h.charCodeAt(g++);
		a = h.charCodeAt(g++);
		n = c << 16 | b << 8 | a;
		m = n >> 18 & 63;
		l = n >> 12 & 63;
		k = n >> 6 & 63;
		j = n & 63;
		e[o++] = d.charAt(m) + d.charAt(l) + d.charAt(k) + d.charAt(j)
	} while ( g < h . length );
	f = e.join("");
	switch (h.length % 3) {
	case 1:
		f = f.slice(0, -2) + "==";
		break;
	case 2:
		f = f.slice(0, -1) + "=";
		break
	}
	return f
}



function get_user(b) {
    user = $(document).data("loginUser");
    if (user == undefined || user == null || b == true) {
        var a = $.xcookie("authkey");
        if (a == undefined || a == null) {
            return null
        }
        auths = a.split("|");
        if (auths.length != 8) {
            return null
        }
        var c = auths[1];
        if (c == undefined || c == null) {
            return null
        }
        groups = c.split(":");
        if (groups.length != 5) {
            return null
        }
        user = {
            username: auths[3],
            nickname: auths[2],
            id: auths[5],
            face: auths[7],
            group_user: groups[0],
            group_admin: groups[1],
            group_author: groups[2],
            sex: groups[3],
            vip_level: groups[4]
        };
        if (user.id == "deleted") {
            user = null
        }
        $(document).data("loginUser", user)
    }
    return user
}