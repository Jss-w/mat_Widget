/* 
 * Copyright (c) 2016
 * 弹窗事件组件
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
        // 提示弹窗
        tipWin: function(msg,time){
            var self = this,
                times = time || 500,
                $matWin = $('.J_matwin'),
                $txt = $matWin.find('.mat-tip');

            // 调用时查看是否存在dom结构
            if($txt.length == 0){
                $matWin.append('<div class="mat-tip"><div class="mat-tipMsg">'+msg+'</div></div>');
            }else{
                $matWin.find('.mat-tipMsg').html(msg);
            }

            $matWin.addClass('active');
            $txt.removeClass('hide');
            setTimeout(function(){
                $matWin.removeClass('active');
                $txt.addClass('hide');
            },times);
        },
        // 确认弹窗
        confirmWin: function(txt,noTxt,noCallback,yesTxt,yesCallback){
            var self = this,
                $matWin = $('.J_matwin'),
                $confirm = $matWin.find('.mat-confirm'),
                $info = $confirm.find('.mat-info'),
                noCallback = noCallback || function(){},
                yesCallback = yesCallback || function(){};


            $matWin.addClass('active');

            if($confirm.length == 0 && noTxt.length !== 0 ) {
                $matWin.append('<div class="mat-confirm">'+
                                '<div class="mat-info">'+txt+'</div>'+
                                '<div class="mat-btn">'+
                                    '<div class="J_no" data-active>'+noTxt+'</div>'+
                                    '<div class="J_yes" data-active>'+yesTxt+'</div>'+
                                '</div>'+
                            '</div>');
            }else if($confirm.length == 0 && noTxt.length === 0) {
                $matWin.append('<div class="mat-confirm">'+
                                '<div class="mat-info">'+txt+'</div>'+
                                '<div class="mat-btn">'+
                                    '<div class="J_no hide" data-active>'+noTxt+'</div>'+
                                    '<div class="J_yes" data-active>'+yesTxt+'</div>'+
                                '</div>'+
                            '</div>');
            }else if($confirm.length != 0 && noTxt.length !== 0){
                $info.text(txt);
                $confirm.find('.J_no').text(noTxt);
                $confirm.find('.J_yes').text(yesTxt);
                $confirm.removeClass('hide');
            }else if($confirm.length != 0 &&noTxt.length === 0){
                $info.text(txt);
                $confirm.find('.J_yes').text(yesTxt);
                $confirm.removeClass('hide');
            }

            $win = $matWin.find('.mat-confirm');
            // dom修改后重新绑定touch事件
            //plugins_click.init();
            $matWin.find('.J_no').off('click').on('click',function(){
                $matWin.removeClass('active');
                $win.addClass('hide');
                noCallback();
            });
            $matWin.find('.J_yes').off('click').on('click',function(){
                $matWin.removeClass('active');
                $win.addClass('hide');
                yesCallback();
            });
        },
        // 底部滑入弹窗
        slideBottom: function($el,html){
            var self = this,
                $body = $('body'),
                $matWin = $('.J_matwin'),
                $close = $el.find('.J_close'),
                $pannel = $el.find('.mat-slidePannel'),

                $txt = $matWin.find('.mat-tip').addClass('hide'),
                $html = html || ''; // 自定义内容元素，填充非每次都填充，未作

            // 基础值展示
            $el.show();
            $pannel.css({top: '100%'});
            $matWin.addClass('active');
            $body.addClass('ofhide');

            self.showSlide($pannel,'top');
            $matWin.off('click').on('click',function(){
                self.hideSlide($pannel,$el,$matWin,$body,'top');
            });
            // 后期优化
            $close.off('click').on('click',function(){
                self.hideSlide($pannel,$el,$matWin,$body,'top');
            });
        },
        // 右侧滑入弹窗
        slideRight: function($el){
            var self = this,
                $body = $('body'),
                $matWin = $('.J_matwin'),
                $close = $el.find('.J_close'),
                $pannel = $el.find('.mat-slidePannel');

            // 基础值展示
            $el.show();
            $pannel.css({left: '100%'});
            $matWin.addClass('active');
            $body.addClass('ofhide');

            self.showSlide($pannel,'left');
            $matWin.off('click').on('click',function(){
                self.hideSlide($pannel,$el,$matWin,$body,'left');
            });
            // 后期优化
            $close.off('click').on('click',function(){
                self.hideSlide($pannel,$el,$matWin,$body,'left');
            });
        },
        // 滑入共享事件
        showSlide: function($pannel,side){
            // 延迟加载动画
            setTimeout(function(){
                if(side === 'top') {
                    $pannel.css({top: '0%'});
                }else if(side === 'left') {
                    $pannel.css({left: '0%'});
                }
            },200);
        },
        hideSlide: function($pannel,$el,$matWin,$body,side){
            setTimeout(function() {
                if(side === 'top') {
                    $pannel.css({top: '100%'});
                }else if(side === 'left') {
                    $pannel.css({left: '100%'});
                }
                $matWin.removeClass('active');
                $body.removeClass('ofhide');
                setTimeout(function(){
                    $el.hide();
                },300)
            }, 110);

        },
        // 依赖dom结构
        matDom: function(){
            var html =  '<section class="mat-win J_matwin"></section>';
            $('body').append(html);
        }
    };
    // 背景展示隐藏,后期整合
    // plugins_bg = {
    //     html: 'html,body',
    //     module:'.J_module',
    //     hideBg: function(obj){
    //         $(this.module).removeClass('active');
    //         $(obj||this.html).removeClass('ofhide');
    //     },
    //     showBg: function(obj){
    //         $(this.module).addClass('active');
    //         $(obj||this.html).addClass('ofhide');
    //     }
    // }
    // 默认组装dom
    plugin.matDom();
    // 对外暴露接口-提示报错信息弹窗第二参数为弹窗停留时间
    /*
    * msg-弹窗文案(必填)
    * time-弹窗停留时间
    */
    matWidget.alert = function(msg,time){
        return plugin.tipWin(msg,time);
    };
    // 对外暴露接口-确认弹窗/取消弹窗
    /*
    * txt-弹窗文案
    * noTxt-弹窗否按钮(左侧)为''则不显示
    * noCallback-点击否后的回调
    * yesTxt-弹窗是按钮(右侧)
    * yesCallback-点击是后的回调
    */
    matWidget.confirm = function(txt,noTxt,noCallback,yesTxt,yesCallback){
        return plugin.confirmWin(txt,noTxt,noCallback,yesTxt,yesCallback);
    };
    // 对外暴露接口-底部滑入/取消弹窗
    /*
    * $el-选中的弹出元素对象
    * html-自定义的html未实现
    */
    matWidget.slideBottom = function($el,html){
        return plugin.slideBottom($el,html);
    };
    // 对外暴露接口-右侧滑入/取消弹窗
    /*
    * $el-选中的弹出元素对象
    */
    matWidget.slideRight = function($el){
        return plugin.slideRight($el);
    };
})(!!window.jQuery?jQuery:'' || !!window.Zepto?Zepto:'');
// 调用方法
/*
    第一参数为弹出信息，第二参数为弹窗时间（未设置则为500ms默认）
    matWidget.bombAlert('有问题',10000000000);
*/

// bombSlideBottom的HTML
// 底部滑动弹窗
/*
    <section class="mat-bottom J_pop">
        <div class="J_close"></div>
        <div class="mat-slideWarp">
            <div class="mat-slidePannel">
                <!-- <header class="m-nav">退款原因</header>
                <aside class="m-aside">
                </aside> -->
            </div>
        </div>
    </section>
*/


// bombSlideRight的HTML
// 右侧滑动弹窗
/*
    <section class="mat-right J_pop">
        <div class="mat-slideWarp">
            <div class="mat-slidePannel" style="background:#fff;">
            </div>
        </div>
    </section>
*/
//
