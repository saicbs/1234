var _ajax={
    get_json:function(url,callback){
        $.ajax({
            type:'get',
            url:url,
            cache:false,
            dataType:'html',
            success:function(json){(jsoncallback);},
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                callback({"succ":false,"msg":"未知错误"});
            }
        });
    }
};

var isShow = true;

(function() {
    window.mReader = this;
    this.action_size = 0;
    //漫画id
    this.comic_id = 0;

    //漫画标题
    this.commic_name = "";

    //漫画封面
    this.commic_cover = "";

    //当前话id
    this.chapter_id = 0;

    //下一话id
    this.next_chap_id = 0;

    //上一话id
    this.prev_chap_id = 0;

    //当前话的标题
    this.chapter_title = "";

    this.curr_page = 0;
    this.page_num = 0;
    //this.base_page_num = 0;
    //this.currpage = 0;

    //点击返回按钮记录kookie
    this.returnBtn=function(){
        goBack();
    };
    //初始化
    this.initData = function(init_chap,comic_name,comic_cover) {
        this.commic_name = comic_name;
        this.commic_cover ="https://images.dmzj.com/"+comic_cover;
        var comment_count = init_chap["comment_count"];
        if(comment_count>0){
            $("#comment_count").show();
        }
        this.chapter_id=init_chap['id'];
        this.comic_id = init_chap['comic_id'];
        this.chapter_title=init_chap['chapter_name'];
        var page_url_arr = init_chap['page_url'];
        this.addImages(page_url_arr);
        $("#m_r_chapter_name").html(this.chapter_title);
        m_global.character("comic_name",15);
        historyCookie(chapter_id,comic_id,$("#m_r_nums span").text())
    };
    //追加显示图片
    this.addImages = function (page_url_arr, add_type) {
        var page_count = page_url_arr.length;
        this.page_num = page_count;
        var insertDiv = new Array(page_count);
        var div_html_str = $("<div id='charpet_"+this.chapter_id+"'></div>");
        for (var idx = 0; idx < page_count; idx++) {
            var image = $("<img width='100%' data-original='" + page_url_arr[idx] + "' class='comic_img' />").lazyload({
                effect: "fadeIn",
                threshold :2000}).attr("id","img"+ idx);
            div_html_str.append(image);
            insertDiv = div_html_str;
        }
        $("#commicBox").prepend(insertDiv);
        $('#commicBox #divAD').css({'padding-bottom':'0','width':'100%','z-index':52,'position':'relative'});
    };

    //绑定滚动事件
    $(window).bind('scroll', function () {
        var currCommicId = this.comic_id;
        var currChapterId = this.chapter_id;
        var currPgae = this.getCurrPage();
        //chapterCookie(currCommicId,currChapterId,currPgae,this.chapter_title,this.commic_cover,this.commic_name);
        historyCookie(currChapterId,currCommicId,currPgae);
        $('#mark').hide();
        if ( isShow ) {
            $('.a_banner').show();
        }
        this.hide();
        var window_offset = $(window).scrollTop();
        var window_height = $(window).height();
        var document_height = $(document).height();

        //到底部显示
        //if (window_offset + window_height >= (document_height)-100) {
        //    this.show();
        //    $('#mark').hide();
        //    this.updatePageDisplay();
        //}
    });


    //请求话信息
    this.requestChapter = function(request_type) {
        var request_chap_url = '/chapinfo/' + this.comic_id + '/' + this.chapter_id + '.html';
        _ajax.get_json(request_chap_url, function (json_data) {
            if(json_data instanceof Array) {
                alert('没有更多话了');
            } else {
                var page_url_arr = json_data['page_url'];
                if(page_url_arr.length > 0) {
                    var comic_id = json_data['comic_id'];
                    if(request_type=="next"){
                        if(json_data['next_chap_id']!=undefined){
                            $("html,body").animate({
                                "scrollTop": $("body").offset().top
                            },0);
                            this.next_chap_id = json_data['next_chap_id'];
                            var url = "/view/"+this.comic_id+"/"+this.next_chap_id+".html";

                            //location.href = url;
                            //history.replaceState(null,null,url);
                            location.replace(url);

                        }else{
                            alert("已经是最后一话了")
                        }
                    }else if(request_type=="prev"){
                        if(json_data['prev_chap_id']!=undefined){
                            $("html,body").animate({
                                "scrollTop": $("body").offset().top
                            },0)
                            this.prev_chap_id = json_data['prev_chap_id'];
                            var url = "/view/"+this.comic_id+"/"+this.prev_chap_id+".html";
                            //location.href = url;
                            //history.replaceState(null,null,url);
                            location.replace(url);

                        }else{
                            alert("已经是第一话了")
                        }
                    }
                }
                else {
                    console.log('======================\n返回数据类型不合法\n'+json_data+'\n======================\n');
                }
            }
        });
    };
    //点击进入上一话
    this.prevBtnAction=function(){
        this.requestChapter("prev");
    }
    //点击进入下一话
    this.nextBtnAction=function(){
        this.requestChapter("next");
    };
    this.show=function(){
        $('#m_r_bottom').show();
        $('.subHeader').show();
    };
    this.hide=function(){
        $('#m_r_bottom').hide();
        $('.subHeader').hide();
    };
    //用户点击视图，弹出菜单
    this.clickAction = function(event) {
        if($('#m_r_bottom').is(":hidden")) {
            this.updatePageDisplay();
            this.show();
            $('#mark').show();
            $('.a_banner').hide();
            $('#khdDown').hide();
        } else {
            $('#m_r_bottom').hide();
            this.hide();
            $('#mark').hide();
            if($.cookie("app_ad")==null){
                if($.cookie("app_home_ad")==null){
                    $("#khdDown").hide();
                }else{
                    $("#khdDown").show();
                }
            }else{
                $("#khdDown").hide();
            }
            if ( isShow ) {
                $('.a_banner').show();
                bannerImg();
            }
        }
    };
    this.touchAction = function(event) {
        this.updatePageDisplay();
        this.show();
        $('#mark').show();
    };
    //获取当前话所有图片高度数组
    this.chapterImgHei = function(page_url_arr){
        var tmp_height = 0;
        var chapterImgHeiArry = [];
        for(i=0;i<page_url_arr.length;i++){
            var imgage_id = '#img_'+this.chpter_id+'_'+i;
            tmp_height = $(imgage_id).height();
            chapterImgHeiArry.push(tmp_height);
        }
        this.heightArry.push(chapterImgHeiArry)
    };
    this.touchMoveAction = function (event) {
        $("body").bind("touchmove",function(event){event.preventDefault();});
        var touches = event.touches;
        var endX = touches[0].clientX;
        var slider_width = $("#m_r_slider").width();
        var circle_half_width = $('#m_r_slider_ball').width();
        var _width = circle_half_width / 2;
        var currX = endX - 32 - _width;
        if (currX <= 0) {
            currX = 0
        } else {
            if (currX >= (slider_width - circle_half_width)) {
                currX = slider_width - circle_half_width
            }
        }
        $("#m_r_slider_ball").css("left", currX);
        $('.scroll_barX').css("width",currX+15);
        var _size = (slider_width - circle_half_width) / this.page_num;
        for (var curPage = 1; curPage <= this.page_num; curPage++) {
            var max = curPage * _size;
            var min = max - _size;
            if (currX >= min && currX < max) {
                $("#m_r_nums").html("<span>"+curPage+"</span>" + "/" + this.page_num);
                this.curr_page = curPage;
                break
            }
        }

    };
    this.touchEndAction = function (event) {
        $("body").unbind("touchmove");
        var target_imgage_id = '#img'+(this.curr_page-1);
        $("html,body").animate({
            "scrollTop": $(target_imgage_id).offset().top
        }, 0);
        historyCookie(this.chapter_id,this.comic_id,this.curr_page)
    };

    //获取当前页数，从1开始
    this.getCurrPage = function () {
        var page = 1;
        var window_offset = $(window).scrollTop()-100;
        var documentHeight = $(document).height()-291-($(window).width()*(640/460));
        var documentScrollTop = $(document).scrollTop()-100;
        var index = Math.round((this.page_num) * documentScrollTop / documentHeight);
        page =index+1
        if(page>this.page_num){page = this.page_num}
        /*var tmp_height = 0;
        for(var index = 0; index < this.page_num; index++) {
            if(tmp_height == window_offset) {
                page = index+1;
                break;
            } else if (tmp_height > window_offset) {
                page = index;
                break;
            }
            var imgage_id = '#img'+index;
            tmp_height += $(imgage_id).height();
        }*/
        return page;
    };

    this.updatePageDisplay = function () {
        var page = this.getCurrPage();
        var slider_width = $(window).width()-80;
        var circle_half_width = $('#m_r_slider_ball').width();
        var currX = (slider_width - circle_half_width) / this.page_num;
        if(page==1||this.page_num==1){
            $("#m_r_slider_ball").css("left", 0);
            $('.scroll_barX').css("width", circle_half_width);
            page = 1
        }else if(page==this.page_num){
            $('#m_r_slider_ball').css("left", slider_width-(circle_half_width));
            $('.scroll_barX').css("width", slider_width);
        }else{
            var leftSize = currX * page - currX / 2;
            $('#m_r_slider_ball').css("left", leftSize)
            $('.scroll_barX').css("width", leftSize);
        }
        $("#m_r_nums").html("<span>"+page+"</span>" + "/" + this.page_num);

    };

    //判断网页头部动态
    this.ss = function ( fn ,obj){
        var beScroll = $(document).scrollTop();
        var fn = fn || function() {};
        $(window).on('scroll',function(){
            var afScroll = $(document).scrollTop();
            var delta = afScroll - beScroll;
            if( delta === 0) return false;
            beScroll = afScroll;
            fn( delta > 0 ? "down" : "up", beScroll,obj);
        })
    }
    ss(function(direction,top){
        if( direction == "up"  && ($(document).height()-$(document).scrollTop()) > (219+($(window).width()*460/640)) ){
            //this.touchAction();
            //$('#mark').show();
            $('.subHeader').show();
        }
        if( direction == "down"){
            $('#m_r_bottom').hide();
            $('#mark').hide();
        }
    },this);

})();

function historyLog(historyJson){
    if($.cookie('my') != null){
        //console.log(window.mReader.comic_id)
        //console.log(window.mReader.chapter_id)
        var userId = $.cookie('my').split("|")[0];
        //var comic_id = this.comic_id;
        //var chapter_id = this.chapter_id;
        //var p = page;

    }
}

function historyCookie(chapter_id,comic_id,page){
    if($.cookie('my') == null){
        return false
    }
    var cookieData = Date.parse(new Date()).toString().substr(0,10);
    if($.cookie("history_Cookie_M")==undefined){
        var item_obj = {};
        item_obj[comic_id] = chapter_id;
        item_obj["comicId"] = comic_id;//漫画id
        item_obj["chapterId"] = chapter_id;//章节id
        item_obj["page"] = page;//第几页
        item_obj["time"] =cookieData//观看时间
        $.cookie("history_Cookie_M", JSON.stringify([item_obj]),{path:"/",expires: 99999});
    }else{
        var cookie_obj = $.parseJSON($.cookie("history_Cookie_M"));

        var exist = false;
        for(var i=0;i<cookie_obj.length;i++) {
            var obj = cookie_obj[i];
            if(obj[comic_id]) {
                obj[comic_id] = chapter_id;//漫画id
                obj["comicId"] = comic_id;//漫画id
                obj["chapterId"] = chapter_id;//章节id
                obj["page"] = page;//页数
                obj["time"] = cookieData; //观看时间
                exist = true;
                break;
            }
        }
        if(!exist) {
            //alert(4)
            var item_obj = {};
            item_obj[comic_id] = chapter_id;
            item_obj["comicId"] = comic_id;//漫画id
            item_obj["chapterId"] = chapter_id;//章节id
            item_obj["page"] = page;
            item_obj["time"] =cookieData;
            cookie_obj.push(item_obj);
        }
        $.cookie("history_Cookie_M", JSON.stringify(cookie_obj),{path:"/",expires: 99999});
    }
}

setInterval(function (){
    if($.cookie("history_Cookie_M")!=undefined){
        historyLog($.cookie("history_Cookie_M"));
    }
    $.cookie("history_Cookie_M", null,{path:"/"});
},30000);

//获取吐槽数量
var comicUrl ="";//接口连接
function getPointTotal(){
    var requestUrl = comicUrl+'';
    $.ajax({
        type: "get",
        url: requestUrl,
        dataType : "jsonp",
        jsonp: 'callback',
        data: {'type_id':subId,'chapter_id':chapterId},
        success: function (json){
            if(json.result==1000){
                $('.tc em').html(json.data.total);
            }
        }
    })
}
//是否订阅
function isDY(){
    var requestUrl = comicUrl+'/api/subscribe/checkSubscribe';
    UserCookie();
    if(m_global.isLogin==true) {
        $.ajax({
            type: "get",
            url: requestUrl,
            dataType : "jsonp",
            jsonp: 'callback',
            data: {'sub_type':0,'sub_id':subId,'uid':m_global.userId},
            success: function (json){
                if(json.data == 1){
                    $('#dys').removeClass('dy').addClass('dy_h').find('span').html('已订阅');
                }else{

                }
            }
        })
    }
}
function canDY(obj){
    UserCookie();
    if(m_global.isLogin==true) { 
        if($(obj).find('span').html() == '订阅'){
            $.ajax({
                type: "get",
                url: comicUrl+'/api/subscribe/add',
                dataType : "jsonp",
                jsonp: 'callback',
                data: {'sub_type':0,'sub_id':subId},
                success: function (json){
                    if(json.result==1000){
                       $(obj).addClass('dy_h').removeClass('dy').find('span').html('已订阅');
                    }
                }
            })
        }else{
            $.ajax({
                type: "get",
                url: comicUrl+'/api/subscribe/del',
                dataType : "jsonp",
                jsonp: 'callback',
                data: {'sub_type':0,'sub_id':subId},
                success: function (json){
                    if(json.result==1000){
                        $(obj).addClass('dy').removeClass('dy_h').find('span').html('订阅');
                    }
                }
            })
        }
    }else{
        location.href = '/login.html';
    }
}



function bannerImg(){
    setTimeout(function(){
        var banWid = $('.a_banner').height();
        if ( banWid != 0 ) {
            if ( isShow ) {
                var imgUrl = '<img src="/images/bannerC.png" class="a_bannerC">';
                $('.a_banner').append(imgUrl);
                $('.UnderPage').css('padding-bottom',banWid + 'px');
                $('.a_bannerC').click(function(){
                    $('.a_banner').hide();
                    $('.UnderPage').css('padding-bottom',0);
                    isShow = false;
                });
            }
        }
    },3000)

}
    
