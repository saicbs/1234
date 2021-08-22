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

//隔行变色
$(function(){
	//章节列表
	$('.comic_list_con ul li:odd').addClass('odd');
	//搜索结果页
	$('.serach_box_bg div:odd').addClass('odd');
})


function changeFavoriteLineColor() {
	//书架页
	$('.shelf_con:odd').addClass('odd');
}

function changeCategoryLineColor() {
	//分类列表隔行换色
	$('.search_result_box:odd').addClass('odd');
}

$(function(){
	$(".intro p").css({"height":"auto"});
	if ($('.intro p').height() > 50) {
		var btn = $("<div class=\"arrow\"><b></b></div>");
		$(".intro").append(btn);
		
		$('.intro p').css({'height':50+'px','overflow':'hidden'});
		$('.intro .arrow b').removeClass('cur');		
		//漫画详情页简介
		$('.intro p').click(function(){
			if($('.intro p').height()==50){
				$('.intro p').css({'height':'auto','overflow':'auto'});
				$('.intro .arrow b').addClass('cur');	
			}else{
				$('.intro p').css({'height':50+'px','overflow':'hidden'});
				$('.intro .arrow b').removeClass('cur');		
			}
		});
	}
})