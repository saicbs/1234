//===========================；分类
m_global.navStyle(2);
var currFlag = [0,0,0,0,0,0];
function itemClickAction(itemType, itemIndex) {
    currFlag[itemType] = itemIndex;
    currFlag[currFlag.length-1] = 0;//页码重置
    requestData(currFlag.join('-'));
    $(window).bind('scroll', request_classify_func);

}

function sortClickAction(sortType,obj) {
	currFlag[5]=0;
    $(obj).addClass("cur").siblings().removeClass("cur")
    currFlag[currFlag.length-2] = sortType;
    requestData(currFlag.join('-'));
    $(window).bind('scroll', request_classify_func);
    $("#loadding").text("正在加载中...");
    $("#loadding").hide();
}

//滚动到底部加载数据
var request_classify_func = function(){
    var document_height = $(document).height();
    if($(window).scrollTop()+$(window).height()>=(document_height-m_global.document_hei)) {
        $("#loadding").show();
        var curr_page_index = currFlag[currFlag.length-1];
        curr_page_index ++;
        currFlag[currFlag.length-1] = curr_page_index;
        requestData(currFlag.join('-'));
    }
};




function imgStyle(){
    var divWidth = $(".imgBox li").width();
    var divHeight = Math.floor(divWidth/0.76);
    $(".imgBox li img").css("height",divHeight);
}

$(function(){
    imgStyle();
    //分类标签切换
    tab('classTit',
        'classCon',
        'cur',
        'select',
        'show_c',0);

    $("#classTit li").click(function(){
        $("#loadding").text("正在加载中...");
        $("#loadding").hide();
        var _this = $(this).index();
        var type = $("#classCon ul").eq(_this).find("li");
        for(var i=0;i<type.length;i++)
        {
            type.eq(i).click(function(){
                $("#classTit li").eq(_this).find("a").text($(this).text());
            })
        }
    })

});
