import './style/main.scss';

import * as echarts from 'echarts';
import 'echarts-gl';
import 'echarts/map/js/world';
import * as $ from 'jquery';
import 'bootstrap';
import * as config from '../config';
import * as mapSeries from './Service/mapSeries';
import * as service from './Service/service';

var BJData = null;
var series = [];
var oldData1 = [];
var oldData2 =[];
var option;

var myChart = echarts.init(document.getElementById('main'));

myChart.showLoading();
$.get(config.apiURL + 'mock/relations').done(function (data) {
    myChart.hideLoading();
    BJData = data;
    series = mapSeries.getSeries(data);
    initChart();
});

function initChart() {
    option = {
        backgroundColor: '#404a59',
        title: {
            text: 'ELPIS',
            subtext: 'Hackathon',
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
                if (!value)
                    value = 0;
                res = "<span style='color:#fff;'>" + name + "</span><br/>Missing pepole: " + value;
                return res;
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {
                    readOnly: false
                },
                restore: {},
                saveAsImage: {
                    pixelRatio: 4
                }
            }
        },
        visualMap: { //图例值控制
            show: true,
            min: 0,
            max: 100,
            calculable: true,
            inRange: {
                color: ['orange', 'red'],
            },

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
            layoutSize: "170%",
            itemStyle: {
                normal: {
                    color: 'rgba(51, 69, 89, .5)', //地图背景色
                    borderColor: '#3fdaff' //省市边界线
                },
                emphasis: {
                    color: '#2B91B7' //悬浮背景
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

var globalData = null;

function getDataByName(name) {
    $.get(config.apiURL + 'mock/region?d=' + Math.random()).done(function (data) {
        globalData = data = data[name];
        var text = '';
        if (!!data && !!data['persons']) {
            var row = `<div class="pop-row"><ol>{{cells}}</ol></div>`;
            var li = ``;
            for (var i = 0; i < data['persons'].length; i++) {
                var person = data['persons'][i];
                li += populateLi(person, name);
            }
            text += row.replace('{{cells}}', li);
            $(".content").html(text);
            $('li').on('click', function (event) {
                var name = $(this).attr('name');
                var region = $(this).attr('region');
                var html = populateView(name);
                var html2 = populateView2(name);

                $('.view-content').html(html);
                $('.view-content2').html(html2);


                showOnLine(name, region);
                $('.pop-win').hide(400);
                $('.pop-view').show(400);
                $('.pop-view2').show(400);
                $('.close-view').on('click', function () {
                    $('.pop-view').hide(400);
                    $('.pop-view2').hide(400);
                    backInit();
                });
            });
        }
    });
}

function populateLi(person, region) {
    return `<li name="` + person.name + `" region=` + region + `>
<div class="img" style="background-image:url(` + person.imgs[0] + `)"></div>
<span class="span2">` + person.name + `</span>
        <span class="span2">` + person.age + ` years old</span>
</li>`;

}

function backInit(){
    series[0].data = oldData1;
    series[1].data = oldData2;

    option.series = series;
    myChart.setOption(option);
}

function populateView(name) {
    var persons = globalData['persons'];
    var person = {
        imgs: [],
        name: '',
        age: '',
        desc: ''
    };
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].name == name) {
            person = persons[i];
        }
    }

    return `<div class="img-content">
<img src="` + person.imgs[0] + `" alt="">
</div>
<div class="msg-content">
<table class="table">
    <tr>
        <td>Name</td>
        <td>` + person.name + `</td>
    </tr>
    <tr>
        <td>Age</td>
        <td>` + person.age + `</td>
    </tr>
    <tr>
        <td>Information</td>
        <td>` + person.desc + `</td>
    </tr>
</table>
</div>`;
}

function populateView2(name) {
    var persons = globalData['persons'];
    var person = {
        imgs: [],
        name: '',
        age: '',
        desc: ''
    };
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].name == name) {
            person = persons[i];
        }
    }

    return `<div class="img-content">
<img src="` + person.imgs[1] + `" alt="">
</div>
<div class="msg-content">
</div>`;
}

function popUpWindow(params) {
    $(".content").html('');
    $('li').off('click');

    var offsetX = params.event.offsetX;
    if (offsetX >= 1200) {
        offsetX = 1200;
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

var geoCoordMap = service.getCitys();
var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push([{
                coord: fromCoord,
                value: dataItem[0].value
            }, {
                coord: toCoord,
            }]);
        }
    }
    return res;
};

function showOnLine(name, region) {
    oldData1 = series[0].data;
    oldData2 = series[1].data;
    var newData1 = [];
    var newData2 = [];

    BJData.forEach(function (o) {
        if (o[0].name == region) {
            newData1 = convertData([o]);
            newData2.push({name:o[1].name,value:geoCoordMap[o[1].name]});
        }
    });

    oldData2.forEach(function (o) {
        if (o.name == region) {
            newData2.push(o);
            //newData2.push({name:'Turkey',value:[41.01, 28.57]});
        }
    });

    series[0].data = newData1;
    series[1].data = newData2;

    option.series = series;
    myChart.setOption(option);
}