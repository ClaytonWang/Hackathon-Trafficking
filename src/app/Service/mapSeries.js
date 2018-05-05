var service = require('./service');
var $ = require('jquery');


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

function getSeries(BJData) {
    var series = [];
    [
        ['上海', BJData]
    ].forEach(function (item, i) {

        var target = [];
        for (const key in geoCoordMap) {
            if (geoCoordMap.hasOwnProperty(key)) {
                var v = geoCoordMap[key];
                target.push({
                    name: key,
                    value: v
                });
            }
        }
        item[1].forEach(function (o, i) {
            target.forEach(function (v) {
                if (o[0].name == v.name) {
                    v.value = v.value.concat([o[0].value])
                }
            });
        });

        series.push({
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 7, //箭头指向速度，值越小速度越快
                    trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', //箭头图标
                    symbolSize: 6, //图标大小
                },
                lineStyle: {
                    type: "circle",
                    normal: {
                        width: 1, //尾迹线条宽度
                        opacity: 0, //尾迹线条透明度
                        curveness: .3 //尾迹线条曲直度
                    }
                },

                data: convertData(item[1])
            }, {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                zlevel: 2,
                rippleEffect: { //涟漪特效
                    period: 6, //动画时间，值越小速度越快
                    brushType: 'stroke', //波纹绘制方式 stroke, fill
                    scale: 4 //波纹圆环最大限制，值越大波纹越大
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right', //显示位置
                        offset: [5, 0], //偏移设置
                        formatter: '{b}' //圆环显示文字
                    },
                    emphasis: {
                        show: true
                    },
                    fontFamily:'Verdana, Geneva, sans-serif',
                    fontSize:14
                },
                symbol: 'circle',
                symbolSize: function (val) {
                    return 10 + val[2] / 100; //圆环大小
                },
                itemStyle: {
                    normal: {
                        show: false,
                        color: '#f00'
                    }
                },
                data: target,
            },
            // //被攻击点
            // {
            //     type: 'effectScatter',
            //     coordinateSystem: 'geo',
            //     zlevel: 2,
            //     rippleEffect: {
            //         period: 6,
            //         brushType: 'stroke',
            //         scale: 4
            //     },
            //     label: {
            //         normal: {
            //             show: true,
            //             position: 'right',
            //             //offset:[5, 0],
            //             color: '#00ffff',
            //             formatter: '{b}',
            //             textStyle: {
            //                 color: "#00ffff"
            //             }
            //         },
            //         emphasis: {
            //             show: true
            //         }
            //     },
            //     symbol: 'circle',
            //     symbolSize: function (val) {
            //         return 4 + val[2] / 1000; //圆环大小
            //     },
            //     itemStyle: {
            //         normal: {
            //             show: true,
            //             color: '#9966cc'
            //         }
            //     },
            //     data: [{
            //         name: item[0],
            //         value: geoCoordMap[item[0]].concat([1000]),
            //     }],
            // }
        );
    });
    return series;
}

module.exports = {
    getSeries: getSeries
}