/** 
 * Copyright (c) 2016
 * 返回事件组件
 * Author: luj
 * Date: 2016-08-11 10:39:00
 */
// 判断全局变量是否存在
if (typeof matWidget == 'undefined') {
    var matWidget = {};
}
// 插件内容，兼容jquery,zepto
;(function($){
    var plugin = {
        time: 200,
        init: function(){
            this.returns();
        },
        returns: function(){
            var $btn = $('.J_returns');
            var temp = $btn.attr('data-back');

            $btn.removeAttr('data-back');

            $btn.on('touchstart',function(e){
                $btn.addClass('click-active');
            }),
            $btn.on('touchend',function(e){
                $btn.removeClass('click-active');
                setTimeout(function(){
                    if(temp == 0){
                        // 返回
                        window.history.go(-1);
                    }else if(temp == 1){
                        // 返回不刷新
                        history.back();
                    }else if(temp == 2){
                        // 返回并刷新
                        window.history.go(-1);
                        location.reload()
                    }else{
                        // 跳转
                        window.location.href = temp;
                    }
                    return false;
                },this.time);
            });
        }
    }
    plugin.init();

    // matWidget.returns = function(){
    //     return plugin.initSync();
    // };
})(!!window.jQuery?jQuery:'' || !!window.Zepto?Zepto:'');
// 此插件没有对外暴露接口，引用后可用
