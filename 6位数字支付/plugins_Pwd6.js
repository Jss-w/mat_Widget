/* 
 * Copyright (c) 2016
 * 6位数字密码
 * Author: luj
 * Date: 2016-09-21 14:53:00
 */
// 判断全局变量是否存在
if (typeof matWidget == 'undefined') {
    var matWidget = {};
}
// 插件内容，兼容jquery
// each方法问题，只能兼容jquery--后期修改
;(function($){
    var plugin = {
        saveCode: '',
        // 点击效果后期分离
        listenTouch: function() {
            var self = this;
            var obj = obj || $(document.body);
            $.each(obj.find('td[data-active]'),function(index,item){
                var $a = $(this),
                    $data = {},
                    $href = $a.data('href');

                $a.removeAttr('data-active').removeAttr('data-href');

                $a.off('touchstart').on('touchstart',function(e){
                    if (e.originalEvent.touches.length === 1 && $data.x2) {
                        $data.x2 = 0,
                        $data.y2 = 0
                    }
                    var pointS = e.originalEvent.touches[0];
                    $data.x1 = pointS.clientX,
                    $data.y1 = pointS.clientY;
                    $a.addClass('click-active');
                }),
                $a.off('touchmove').on('touchmove',function(e){
                    var pointS = e.originalEvent.touches[0];
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
                        },200);
                    }
                    // 提出函数
                    self.pwdSet($a);
                });
                $a.off('touchcancel').on('touchcancel',function(){
                    $a.removeClass('click-active');
                });
            });
            // 禁止长按浏览器出现负值等功能
            window.ontouchstart = function(e) { e.preventDefault(); };
        },
        // 展示点的个数
        pointChange: function(num){
            var $spanList = $('.J_sInput').find('span').removeClass('on');
            for(var i =0; i< num; i++){
                $spanList.eq(i).addClass('on');
            }
        },
        // 密码显示
        pwdSet: function($el) {
            var self = this,
                temp = self.saveCode,
                back = $('.back').attr('data-code');
                code = $el.attr('data-code');

            if(temp.length > 0 && code === back){
                temp = temp.substring(0,temp.length-1)
            }else if(temp.length < 6 && code !== back){
                temp += code;
            }
            self.pointChange(temp.length);
            self.saveCode = temp;

            if(self.saveCode.length == 6){
                $('.J_kbBox').hide();
                self.pwdSub();
            }
        },
        pwdSub: function(callBack) {
            var self = this;
            callBack(self.saveCode);
        },

        // 依赖dom结构
        matDom: function(){
            var inputNum = '<div class="s_input bdt bdb J_sInput"><span class="bdl bdr"><i></i></span><span class="bdr"><i></i></span><span class="bdr"><i></i></span><span class="bdr"><i></i></span><span class="bdr"><i></i></span><span class="bdr"><i></i></span></div>',
                html = '<div class="kb_box J_kbBox"><table class="bdt"><tr><th class="bdb" colspan="3">安全键盘</th></tr><tr><td class="bdr bdb" data-code="1" data-active>1</td><td class="bdr bdb" data-code="2" data-active>2</td><td class="bdb" data-code="3" data-active>3</td></tr><tr><td class="bdr bdb" data-code="4" data-active>4</td><td class="bdr bdb" data-code="5" data-active>5</td><td class="bdb" data-code="6" data-active>6</td></tr><tr><td class="bdr bdb" data-code="7" data-active>7</td><td class="bdr bdb" data-code="8" data-active>8</td><td class="bdb" data-code="9" data-active>9</td></tr><tr><td class="bdr null"></td><td class="bdr" data-code="0" data-active>0</td><td class="back" data-code="b" data-active></td></tr></table></div>';
            
            $('.J_simple').after(inputNum);
            $('body').append(html);
            this.listenTouch();
        }
    };
    // 默认组装dom
    plugin.matDom();
    // 对外暴露接口-callBack用于回调异步提交方法
    matWidget.pwdNum6 = function(callBack){
        return plugin.pwdSub(callBack);
    };
// })(!!window.jQuery?jQuery:'' || !!window.Zepto?Zepto:'');
})(!!window.jQuery?jQuery:'');
