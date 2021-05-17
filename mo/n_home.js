var pagemain = 2;//设置页数

//nav样式
$(function(){
	m_global.navStyle_n(0);
	imgAutoHeight();
	$(window).on('scroll',reTimes);
});
//新闻图片宽高比例
function imgAutoHeight(){
	var n_til_W=$('.birenews .n_til').width();
	$('.birenews .n_til img').css({'max-height':parseInt(n_til_W)*0.75});
	$('.hounews .n_til .news_img').css({'height':parseInt(n_til_W)*0.4591,'width':'100%'});
}

//ajax请求
function get_json(url,data,success) {
	$.ajax({
		type: 'post',
		url: url,
		cache: false,
		dataType: 'json',
		data: data,
		timeout: 30000,
		success: function (json) {
			success(json);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert('发生错误请重新刷新网页');
		}
	});
}

//请求添加新闻
var up_loading = function () {
	var url_load = window.location.href;
	var success = function (json) {
		for(var i=0;i<json.length;i++){
			var data_main = json[i];
			var news_html = '';
			news_html += '<li class="hide"><div class="n_main"><div class="n_til"><a href="'+data_main.to_url+'">'+data_main.title+'</a> <div class="news_img"> <a href="'+data_main.to_url+'"><img class="lazy" data-original="'+data_main.rowPicUrl+'"></a> </div> </div> </div> <div class="n_footer"> <img src='+data_main.authorPhoto+'><span>'+data_main.authorName+'</span> <div class="n_times">'+data_main.c_create_time+'</div> <div class="review"><em>'+data_main.num+'</em></div> <!--<div class="praise"><em>0</em></div>--> </div> <div class="border_B"></div></li>';
			$('.hounews ul').append(news_html);
		}
		pagemain++;
		imgAutoHeight();
		$('.hounews ul li').css({'margin-bottom':'10px'}).last().css({'margin-bottom':0});
	};
	var data_load = { page : pagemain };
	get_json(url_load,data_load,success);
};

//判断次数
var reTimes = function(){
	if(pagemain < 5){
		request_func();
	}
};

//下拉加载
var request_func=function(){
	var document_height =$(document).height();
	if($(window).scrollTop()+$(window).height()>=(document_height-150)) {
		up_loading();
		$('.n_more_btm').addClass('loading_more').html('<img src="/images/loading.gif"/>');
		$(window).off('scroll',reTimes);
		setTimeout(function(){fadeIn();$(window).on('scroll',reTimes);},1200);
	}
};

//渐显效果
var fadeIn = function(){
		for( var o=0;o<10;o++){
			$('.hounews ul li.hide').first().addClass('li_fadeInUp').removeClass("hide");
		}
		$('#loading').removeClass('loading_more').html('点击查看更多');
		lazyLoading();
	if( pagemain >= 5){
		$('#loading').on('click',more_click);
	}
};
//获取更多
function more_click(){
	$('#loading').addClass('loading_more').html('<img src="/images/loading.gif"/>').off('click');
	up_loading();
	setTimeout(function(){fadeIn()},1200);
}
//执行lazyload
function lazyLoading(){
	$('img.lazy').lazyload({
		effect: "fadeIn", // 载入使用何种效果
		threshold: 180 // 提前开始加载
	});
}
//监听下拉事件固定顶部
function navTop(){
	$(document).on('scroll',function(){
		if($(document).scrollTop()>=46){
			$('.swiper-container').addClass('fixed');
		}else{
			$('.swiper-container').removeClass('fixed');
		}
	})
}
$(function(){navTop()});
