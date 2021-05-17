/**
 * Created by fugongyu on 2017/3/28.
 */

var ArrID = ['13897','19270','13318','356','15964'];
var isOn = $.inArray(subId, ArrID);

// if( isOn != -1 ){
//     $('html').css('overflow','hidden');
//     $('.timeAD').show();
    $('.appTil').show();
    // $('.mark').addClass('isShow');
    $('.closeapp').on('click',function(){
        $('.appTil').hide();
    });
    if($.cookie("app_ad")==null){
        if($.cookie("app_home_ad")==null){
            $("#khdDown").hide();
        }else{
            $("#khdDown").show();
        }
    }else{
        $("#khdDown").hide();
    }
    // var times = 10;
    // var lt = setInterval('llt()',1000);
    // function llt(){
    //     if(times == 0){
    //         clearInterval(lt);
    //         $('html').css('overflow','auto');
    //         $('.timeAD').hide();
    //         $('.mark').removeClass('isShow');
    //     }else{
    //        $('.ADImg span').html(times+'S');
    //         times--;
    //     }
    // }
// }




