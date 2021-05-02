

$(document).ready(function(){

	if ($(window).width() > 1220) {
	$('.main-menu li:has(ul)').click(
		function() {
			$(this).find('.hidden-menu').stop(true,true).fadeToggle(300);
			$(this).toggleClass('menuactive');
		});	
	} else {
	$('.main-menu li:has(ul) > a').click(function() {
			$(this).parent().find('.hidden-menu').slideToggle(150);
			$(this).parent().toggleClass('menuactive');
			return false;
	});	
	};	
	
	$('.main-menu li:has(ul)').addClass('submenu');
	
    $('.navigatorus').append('<div class="show-menu"><i class="fa fa-bars"></i> Меню сайта</div>');  
    $(".show-menu").click(function(){
		$(".main-menu").fadeToggle("300");
	});
	
	if($(".ratingtypeplusminus").hasClass("ratingminus")) {
	$(".ratingminus").parent('span').parent('.s-rating').addClass('s-negative').find('i').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-o-down');
	$(".ratingminus").parent().parent().parent().parent().addClass('all-negative');
	};
	
	$(".show-login").click(function(){
		$(".overlay").fadeIn("300");
	});
	
    $('#loginbox').append('<i class="fa fa-times-circle overlay-close"></i>');  
    $(".overlay-close").click(function(){
		$(".overlay").fadeOut("300");
	});
	
	
	$(".add-com-but").click(function(){
		$("#addcform").fadeToggle("300");
	});
	
	$(".reply").click(function(){
		$("#addcform").fadeIn("300");
	});
	
	var showgotop=300;
    $('body').append('<a href="#" class="gotop" title="Наверх"></a>');
    var s=$('.gotop');          
	$(document).scroll(function(){   
        var st=$(document).scrollTop();
        if(st<showgotop)
           s.fadeOut(400);
        else
            s.fadeIn(300);
    });   
	$('.gotop').click(function(){
	$('html, body').animate({ scrollTop : 0 }, 'fast');
	return false;
	});
	

});
