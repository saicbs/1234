function Focus(){
	var now=0;
	var w=320;
	var last=new Date().getTime();
	this.next=function(){
		var cur = new Date().getTime();
		if((cur-last)>=300){
			var aFocusBtn=$('#focus ol li');
			if(now<0)now=-1;
			now++;
			aFocusBtn.removeClass('cur');
			var btnIndex=now;
			if(btnIndex==aFocusBtn.length){
				btnIndex=0;
			}
			aFocusBtn.eq(btnIndex).addClass('cur');
			var left = 0;
			if (now == aFocusBtn.length){
				now=0;
			} else {
				left = now*w;
			}
			$('#focus ul').animate({left: -left+'px'});
			last=cur;
		}
	};
	this.prev=function(){
		now=now-2;
		this.next();
	};
	timer=null;
	this.run=function(){
		timer=setInterval(this.next, 4000);
		return this;
	};
	this.stop=function(){
		clearInterval(timer);
	};
}
var focus = new Focus().run();

var last=new Date().getTime();
var touchEvent={
	_initX:0,
	_finishX:0,
	_startX:0,
	_startY:0,
	touchStart:function(event) {
		touchEvent._startX = event.touches[0].clientX;
		touchEvent._startY = event.touches[0].clientY;
		touchEvent._initX = touchEvent._startX;
	},
	touchMove:function(event){
		console.log("src:"+event.srcElement);
		console.log("target:"+event.target);
		var touches = event.touches;
		var _endX = event.touches[0].clientX;
		var _endY = event.touches[0].clientY;
		if(Math.abs(_endY-touchEvent._startY)>Math.abs(_endX-touchEvent._startX)){
			return;
		}
		event.preventDefault();
		touchEvent._finishX = _endX;
		var cur = new Date().getTime();
		if (cur-last>=800){
			if(touchEvent._startX>_endX){
				focus.stop();
				focus.next();
				focus.run();
			}else{
				focus.stop();
				focus.prev();
				focus.run();
			}
			_startX = _endX;
			last=cur;
		}
	},
	touchEnd:function(event){
		if(touchEvent._finishX==0){
			return;
		}
		touchEvent._initX = 0;
		touchEvent._finishX = 0;
	},
	next:function(){
		focus.stop();
		focus.next();
		focus.run();
	},
	prev:function(){
		focus.stop();
		focus.prev();
		focus.run();
	}
}

//选项卡函数
function changeTab(opt) {
	var tabs = opt.tabs,
		tabInfo = opt.tabInfo,
		activeClass = opt.activeClass,
		eventName = opt.eventName || "click";

	tabs.bind(eventName, function() {
		var index = tabs.index(this);
		tabs.removeClass(activeClass);
		$(this).addClass(activeClass);
		tabInfo.css("display", "none");
		tabInfo.eq(index).css("display", "block");
	});
}
//选项卡
$(function(){
	$('.comic_con').eq(0).show();
	var opt = {
		tabs: $('.tab_title a'),
		tabInfo: $('.comic_con'),
		activeClass: 'cur',
		eventName: 'click'
	}
	changeTab(opt);
})
//分类下拉
$(function(){
	$('.categray').toggle(function(){
		$('.categray').addClass('cur');
		$('.categray').find('b').addClass('cur');
		$('.categray_box').show();	
	},function(){
		$('.categray').removeClass('cur');
		$('.categray').find('b').removeClass('cur');
		$('.categray_box').hide();		
	})
})