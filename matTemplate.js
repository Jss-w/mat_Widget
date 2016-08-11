/** 
 * Copyright (c) 2016
 * 结构组装事件组件
 * Author: luj
 * Date: 2016-08-30 10:39:00
 */
// 0/1维护思路：回调太多，考虑合并多余的参数
// 0/1维护思路：同步异步两个方法是否能合并
// 判断全局变量是否存在
if (typeof matWidget == 'undefined') {
    var matWidget = {};
}
// 插件内容，兼容jquery,zepto
;(function($){
    plugin = {
        // 功能-模板数据填充js
        formatTemplate: function(data, tmpl) {
            var format = {
                name: function(x) {
                    return x
                }
            };
            return tmpl.replace(/{(\w+)}/g, function(m1, m2) {
                if (!m2)
                    return '';
                return (format && format[m2]) ? format[m2](data[m2]) : data[m2];
            });
        },
        /**
        * DOM节点拼装 与 异步加载，需要复制到相应页面做调整
        */
        htmlDom: function ($elRoot, $elTep, data, Callback,isEmpty,Callback2){
            var self = this,
                html = $elTep.html(),
                arr = [];
            //对数据进行遍历
            $.each(data, function(i, e) {
                var o = {};
                o = Callback(e);
                arr.push(self.formatTemplate(o, html));
            });
            if(isEmpty){
                $elRoot.empty();
            }
            $elRoot.append(arr.join(''));
            // dom修改后重新绑定touch事件
            // plugins_click.init();
            Callback2();
        },
        /**
        * 通用异步方法
        */
        ajax4Data: function (ajaxUrl, setData, Callback){
            $.ajax({
                // type: 'get',
                type: 'post',
                url: ajaxUrl,
                data: setData,
                dataType: 'json',
                // dataType: 'jsonp',
                // jsonpCallback: 'jsonp',
                success: function (result){
                    if(result.code === "0" && result.body.length > 0){
                        Callback(result.body);
                        // return result.body.length;
                    }else{
                        // $('.J_loading').text('没有更多了');
                        console.log(result.msg||'服务器错误请稍后再试');
                    }
                },
                error: function (result){
                    console.log(result.msg||'服务器错误请稍后再试');
                }
            });
        },
        /* 
        * $elRoot-组装位置
        * $elTep-template元素
        * data本地的数组
        * Callback-回调的组装函数，用于解耦数据匹配
        * isEmpty-拼装是否清空后再添加
        * Callback2-回调函数，用于最后结束执行
        */
        initSync: function ($elRoot,$elTep,data,Callback,isEmpty,Callback2){
            var self = this;
            isEmpty = isEmpty || false;
            Callback2 = Callback2 || function(){};

            self.htmlDom($elRoot,$elTep,data,Callback,isEmpty,Callback2);
        },
        /* 
        * url-ajax连接
        * setdata-ajax数据
        * $elRoot-组装位置
        * $elTep-template元素
        * Callback-回调的组装函数，用于解耦数据匹配
        * isEmpty-拼装是否清空后再添加
        * Callback2-回调函数，用于最后结束执行
        */
        initAsyn: function (url,setdata,$elRoot,$elTep,Callback,isEmpty,Callback2){
            var self = this;
            isEmpty = isEmpty || false;
            Callback2 = Callback2 || function(){};
            self.ajax4Data(url,setdata,function(data){
                self.htmlDom($elRoot,$elTep,data,Callback,isEmpty,Callback2);
            });
        },
    }
    // 对外暴露接口-异步接口
    /*
    * url-ajax连接
    * setdata-ajax数据
    * $elRoot-组装位置
    * $elTep-template元素
    * Callback-回调的组装函数，用于解耦数据匹配
    * isEmpty-拼装是否清空后再添加
    * Callback2-回调函数，用于最后结束执行
    */
    matWidget.templateAsyn = function(url,setdata,$elRoot,$elTep,Callback,isEmpty,Callback2){
        return plugin.initAsyn(url,setdata,$elRoot,$elTep,Callback,isEmpty,Callback2);
    };
    // 对外暴露接口-同步接口（用户后台把数据put到页面上时候用，减少异步——自己吃自己）
    /*
    * $elRoot-组装位置
    * $elTep-template元素
    * data本地的数组
    * Callback-回调的组装函数，用于解耦数据匹配
    * isEmpty-拼装是否清空后再添加
    * Callback2-回调函数，用于最后结束执行
    */
    matWidget.templateSync = function($elRoot,$elTep,data,Callback,isEmpty,Callback2){
        return plugin.initSync($elRoot,$elTep,data,Callback,isEmpty,Callback2);
    };
})(!!window.jQuery?jQuery:'' || !!window.Zepto?Zepto:'');
// 调用方法
/*
matWidget.template(dataObj.areaDataUrl,{city:num},$area,$('#adrLiTemplate'),function(e){
    var o = {};
    o.codes = e.code;            // 转换
    o.names = e.name;            // 转换
    return o;
},true,function(){
    //函数执行结束执行的
});
*/
/*
 * DOM结构
 
<script type="text/template" id="adrLiTemplate">
    <div class="weui_actionsheet_cell" data-id="{codes}">{names}</div>
</script>
*/
