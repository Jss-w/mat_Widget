/** 
 * Copyright (c) 2016
 * 点击事件组件
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
        clickActive: function(){
            var self = this;
            var obj = obj || $(document.body);
            obj.find('li[data-active],dl[data-active],div[data-active],a[data-active],h3[data-active]').each(function(index,item){
                var $a = $(this),
                    $data = {},
                    $href = $a.data('href');

                $a.removeAttr('data-active').removeAttr('data-href');

                $a.off('touchstart').on('touchstart',function(e){
                    var eTouches = e.originalEvent.targetTouches;
                    if (eTouches.length === 1 && $data.x2) {
                        $data.x2 = 0,
                        $data.y2 = 0
                    }
                    var pointS = eTouches[0];
                    $data.x1 = pointS.clientX,
                    $data.y1 = pointS.clientY;
                    $a.addClass('click-active');
                }),
                $a.off('touchmove').on('touchmove',function(e){
                    var eTouches = e.originalEvent.targetTouches;
                    var pointS = eTouches[0];
                    $data.x2 = pointS.clientX,
                    $data.y2 = pointS.clientY;
                    $a.removeClass('click-active');
                }),
                $a.off('touchend').on('touchend',function(e){
                    $a.removeClass('click-active');
                    if($href === undefined){
                        $a.removeClass('click-active');
                    }else if(!$data.x2 || !$data.x2 && (Math.abs($data.y2 - $data.y1) <= 5) && (Math.abs($data.x2 - $data.x1) <= 5)) {
                        setTimeout(function(){
                             window.location.href = $href;
                        },this.time);
                    }
                });
                $a.off('touchcancel').on('touchcancel',function(){
                    $a.removeClass('click-active');
                });
            });
        }
    }

    plugin.clickActive();

})(!!window.jQuery?jQuery:'' || !!window.Zepto?Zepto:'');
