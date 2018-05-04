import './style/main.scss';

import * as echarts from 'echarts';
import 'echarts-gl';
import 'echarts/map/js/world';
import * as $ from 'jquery';
import 'bootstrap';
import * as config from '../config';
import * as mapSeries from './Service/mapSeries';


var BJData = null;
var series = [];

var myChart = echarts.init(document.getElementById('main'));

myChart.showLoading();
$.get(config.apiURL + 'mock/relations').done(function (data) {
    myChart.hideLoading();
    series = mapSeries.getSeries(data);
    initChart();
});

function initChart() {
    var option = {
        backgroundColor: '#404a59',
        title: {
            text: 'Trafficking',
            subtext: 'Hackthone',
            left: 'center',
            textStyle: {
                color: '#fff',
                fontSize: 24
            },
            padding: [20, 20, 20, 20]
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(12, 204, 104, 0.92)',
            borderColor: '#FFFFCC',
            showDelay: 0,
            hideDelay: 0,
            enterable: true,
            transitionDuration: 0,
            extraCssText: 'z-index:100',
            formatter: function (params, ticket, callback) {
                ////根据业务自己拓展要显示的内容
                var res = "";
                var name = params.name;
                var value = params.value[params.seriesIndex + 1];
                res = "<span style='color:#fff;'>" + name + "</span><br/>数据：" + value;
                return res;
            }
        },
        visualMap: { //图例值控制
            min: 0,
            max: 10000,
            calculable: true,
            color: ['red', 'orange', 'yellow', 'lime', 'aqua'],
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: 'world',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true, //是否允许缩放
            layoutCenter: ['50%', '50%'], //地图位置
            layoutSize: "140%",
            itemStyle: {
                normal: {
                    color: 'rgba(51, 69, 89, .5)', //地图背景色
                    borderColor: 'rgba(100,149,237,1)' //省市边界线
                },
                emphasis: {
                    color: 'rgba(37, 43, 61, .5)' //悬浮背景
                }
            }
        },

        series: series
    };
    myChart.setOption(option);
}

myChart.on('click', function (params) {
    var _self = this;
    if (params.componentType == "series") {
        popUpWindow(params);
    }
});


function getDataByName(name) {
    $.get(config.apiURL + 'mock/region?d='+(new Date()).getTime()).done(function (data) {
        data = data[name];
        var text='';
        if (!!data && !!data['persons']) {
            var row = `<div class="pop-row"><ol>{{cells}}</ol></div>`;
            var li = ``;
            for (var i = 0; i < data['persons'].length; i ++) {
                var person = data['persons'][i];
                li += populateLi(person);
            }
            text += row.replace('{{cells}}',li);
            $(".content").html(text);
            $('li').on('click', function () {
                $('.pop-win').hide(400);
                $('.pop-view').show(400);
                $('.close-view').on('click', function () {
                    $('.pop-view').hide(400);
                });
            });
        }       
    });
}

function populateLi(person){
return `<li>
<div class="img" style="background-image:url(` + person.imgs[0] + `)"></div>
<span class="span2">` + person.name + `</span>
        <span class="span2">` + person.age + `</span>
</li>`;

}

function popUpWindow(params) {
    $(".content").html('');
    $('li').off('click');

    var offsetX= params.event.offsetX;
    if(offsetX>=1200){
        offsetX=1200;
    }
    $('.pop-win').css({
        top: params.event.offsetY + 'px',
        left: offsetX + 'px'
    }).show(400);

    $('.close-win').on('click', function () {
        $('.pop-win').hide(400);
    });

    getDataByName(params.name);
}