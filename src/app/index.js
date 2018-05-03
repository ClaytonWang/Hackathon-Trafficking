import './style/main.scss';

import * as echarts from 'echarts';
import * as $ from 'jquery';
import * as config from '../config';


var data = $.get(config.apiURL + 'mock/db').done(function (data) {
    console.log(data);

});

var option = {
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
};

var myChart = echarts.init(document.getElementById('main'), 'dark');
myChart.setOption(option);