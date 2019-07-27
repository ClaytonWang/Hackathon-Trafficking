import './style/main.scss';
import * as $ from 'jquery';
import 'bootstrap';
import * as config from '../config';
import * as service from './Service/service';


$('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
}).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    var h = 90 + (this.scrollHeight) + 'px';
    $('.con-col').css('height', h);
});

$(function () {
    var sh = parseInt($('#div-source').css('height').replace('px', ''));
    var rsth = parseInt($('#div-result').css('height').replace('px', ''));
    if (sh < rsth) {
        $('#div-source').css('height', rsth + 'px');
    }

    $('body').on('click', '.fa-file-medical-alt', function () {
        if ($('#Diff').css('display') === 'none') {
            $('#Diff').show();
            $('.marsk').show();
        }
    });

    $('body').on('click', '.marsk', function () {
        if ($('#Diff').css('display') === 'block') {
            $('#Diff').hide();
            $('.marsk').hide();
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
});