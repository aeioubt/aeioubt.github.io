jQuery(document).ready(function() {

jQuery('body').append('<div class="button-up" style="display: none;opacity: 0.3;width: 45px;height:100%;background-color:#f7f7f7;position: fixed;left: 0px;top: 0px;cursor: pointer;text-align: center;line-height:50px;color: #696969;font-weight: bold;font-size:25px;">&#9650;</div>');

jQuery (window).scroll (function () {
if (jQuery (this).scrollTop () > 1000) {
jQuery ('.button-up').fadeIn();
} else {
jQuery ('.button-up').fadeOut();
}
});

jQuery('.button-up').click(function(){
jQuery('body,html').animate({
scrollTop: 0
}, 800);
return false;
});

jQuery('.button-up').hover(function() {
jQuery(this).animate({
'opacity':'0.9',
}).css({'background-color':'#f7f7f7','color':'#696969'});
}, function(){
jQuery(this).animate({
'opacity':'0.5'
}).css({'background-color':'f7f7f7','color':'#696969'});;
});

});