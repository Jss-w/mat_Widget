/** 
 * Copyright (c) 2016
 * 插件——表单验证事件组件
 * 依赖zepto,jquery
 * Author: luj
 * Date: 2016-05-30 10:39:00
 */
// 暂时只能用于手机版，报错后停止检测
// 0/1维护思路：后期增加配置属性用于CP端，变为报错后不停止检测
// 0/1维护思路：增加校验规则配置
// 判断全局变量是否存在
if (typeof matWidget == 'undefined') {
    var matWidget = {};
}
// 插件内容，兼容jquery,zepto
;(function($){
    'use strict';
    var plugin = {
        reg:{
            phone:/^1[3-9]\d{9}$/,
            pwd:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
            imgcode:/^[a-zA-Z0-9]{4}$/,
            numcode:/^\d{6}$/,
            username:/^[\u4e00-\u9fa5 ]{2,20}$/,
            isZipcode:/^[1-9][0-9]{5}$/,
            identity:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            // isCardNo:/^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
        },
        topwd:{},
        regHandle: function(obja,$reg, $val){
            var self = this;
            if($reg === 'require'){
                return $val != '';
            }if($reg === 'topwd'){
                var val = self.topwd.el.find('input[name='+obja+']').val();
                return $val == val;
            }else{
                return self.reg[$reg].test($val);
            }
        },
        valid:function($el, rules, msg, callBack){
            var self = this,
                isPass = true,
                self.topwd.el = $el,
                $elem;

            $.each(rules, function(i, obj){
                if(i == 'daddress'){    // 详细地址textarea
                    $elem = $el.find('textarea[name='+i+']');
                }else{
                    $elem = $el.find('input[name='+i+']');
                }
                if($elem.attr('readonly')||$elem.attr('disabled')){
                    return false;
                }
                var $val = $elem.val();
                $.each(obj, function(j, obja){
                    if (obja && !self.regHandle(obja,j,$val)) {

                        callBack(msg[i][j]);
                        // plugins_tipWin.init(msg[i][j]);
                        return isPass = false;
                    };
                });
                return isPass;
            });
            return isPass;
        },
        init: function($el,list,callBack){
            // 此处用于解耦，后期有合并到valid的可能性
            return this.valid($el,list.rules, list.msg, callBack);
        }
    };
    // 对外暴露接口
    /*
    * $el: form表单对象
    * list: 验证表单依赖
    * callBack: 回调函数用于报错的接口返回报错文案msg
    */
    matWidget.validate = function($el,list,callBack){
        return plugin.init($el,list,callBack)
    };
})(!!window.jQuery?jQuery:'' || !!window.Zepto?Zepto:'');
// 调用方法
/*
function ssasdf($el) {
    return matWidget.matWidget($el,{
        rules: {
            phone: {
                require:true,
                phone:true
            }
        },
        msg: {
            phone: {
                require:'手机号不能为空',
                phone:'手机号格式错误'
            }
        }
    },
    function(mm){
        console.log(mm);
    });
}
*/
