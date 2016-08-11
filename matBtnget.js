/** 
 * Copyright (c) 2016
 * 短信验证码事件组件
 * Author: luj
 * Date: 2016-05-30 10:39:00
 */
// 判断全局变量是否存在
if (typeof matWidget == 'undefined') {
    var matWidget = {};
}
// 插件内容，兼容jquery,zepto
;(function($){
    var plugin = function(){
        // 密码明文密文切换
        showPwd:function($el){
            var $icon = $el.find('i'),
                $input = $el.prev();
            $el.on('click',function(){
                if($icon.hasClass('on')){
                    $icon.removeClass('on');
                    $input.attr('type','password');
                }else{
                    $icon.addClass('on');
                    $input.attr('type','text');
                }
            })
        },
        // 获取图形验证码
        getImgCode: function(el,url){
            this.changeImg($(el),url);
        },
        changeImg: function(el,url){
            var itmeout;
            el.on('click',function(){
                clearTimeout(itmeout);
                itmeout =setTimeout(function(){el.find('img').attr('src', url+(new Date()).getTime())},250);
            });
        },
        // 获取短信验证码
        getNumCode: function(el,$data,$url,$type,Callback){
            var self = this;
            if($(el).find('.J_time').length <1 && $type === 'json'){
                self.changeBtn($(el),$data,$url,Callback);
            }else if($type !== 'json'){
                self.changeBtnJSONP($(el),$data,$url,Callback);
            }else{
                return false;
            }
        },
        countDownTime: 120,
        changeBtn: function($el,$data,$url,Callback){
            var self = this;
            $.ajax({
                type:'post',
                async:false,
                data:$data,
                url:$url,
                dataType:'json',
                success:function(result){
                    if (result && result.code == 0) {
                        plugins_tipWin.init('验证码发送成功');
                        $el.find('span').addClass('countdown').html('重新发送(<span class="span-time J_time">'+self.countDownTime+'</span>s)');
                        self.countdown($el);
                    } else if(result.code == 1001) {
                        plugins_tipWin.init('图形验证码出错');
                    } else {
                        plugins_tipWin.init(result.msg);
                    }
                },
                error:function(){
                    if (typeof(Callback) == 'function'){
                        Callback();
                    }
                }
            });
        },
        changeBtnJSONP: function($el,$data,$url,Callback){
            var self = this;
            $.ajax({
                type:'post',
                async:false,
                data:$data,
                url:$url,
                dataType:'jsonp',
                jsonp:'callback',
                success:function(result){
                    if (result && result.code == 0) {
                        plugins_tipWin.init('验证码发送成功');
                        $el.find('span').addClass('countdown').html('重新发送(<span class="span-time J_time">'+self.countDownTime+'</span>s)');
                        self.countdown($el);
                    } else if(result.code == 1001) {
                        plugins_tipWin.init('图形验证码出错');
                    } else {
                        plugins_tipWin.init(result.msg);
                    }
                },
                error:function(){
                    if (typeof(Callback) == 'function'){
                        Callback();
                    }
                }
            });
        },
        countdown: function(el){
            var self = this,
                $el = $(el),
                $time = $el.find('.J_time'),
                t = self.countDownTime;

            self.count = setInterval(function() {
                $time.html(--t);
                if (t === 0) {
                    clearInterval(self.count);
                    $el.find('span').removeClass('countdown').html('重新发送');
                }
            }, 1000);
        }
    }
    // 密码明文密文切换
    matWidget.showPwd = function($el){
        return plugin.showPwd($el);
    };
    // 获取图形验证码
    matWidget.imgCode = function(el,url){
        return plugin.getImgCode(el,url);
    };
    // 获取短信验证码
    /*
    * el-点击元素
    * $data-发送的data
    * $url-发送的url
    * $type-ajax发送方式json/jsonp
    * Callback-获取失败的回调
    */
    matWidget.getNumCode = function(el,$data,$url,$type,Callback){
        return plugin.getNumCode(el,$data,$url,$type,Callback);
    };

})(!!window.jQuery?jQuery:'' || !!window.Zepto?Zepto:'');



