 
var khacObj;
jQuery(document).ready(function(){
	jQuery('img').each(function(){
		var s=jQuery(this);
		var src=s.attr('src');
		var ext=src.split('.').pop();
		if(ext=='gif'){
			s.attr('data-orgsrc',src ); 
		}
	});
	
	
	jQuery.cookie.json = true;
	khacObj=new khacCookieHelper();
	khacObj.loadDefaults();
	jQuery('.toggle-access-mode').click(function(){
		if(!jQuery('.access-menu-nav').hasClass('active')){
			khacOpenMenu();
		}else{
			khacCloseMenu();
		}
	});
 
	if(typeof khacAssetsDATA.imgaltsFrom!='undefined'){
		khacDoImagesAlt(khacAssetsDATA.imgaltsFrom);
	}
	if(typeof khacAssetsDATA.imgtitlesFrom!='undefined'){
		khacDoImagesTitle(khacAssetsDATA.imgtitlesFrom);
	}
	if(typeof khacAssetsDATA.button_value!='undefined'){
		jQuery('button,input[type="submit"]').each(function(){
			 var v=jQuery(this).val();
			 if(v.length==0){
				 jQuery(this).attr('value',khacAssetsDATA.button_value);
			 }
		});
	}
 
 
});
 
function is_gif_image(i) {
    return /^(?!data:).*\.gif/i.test(i.src);
}

function freeze_gif(i) {
    var c = document.createElement('canvas');
    var w = c.width = i.width;
    var h = c.height = i.height;
    c.getContext('2d').drawImage(i, 0, 0, w, h);
    try {
        i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
    } catch(e) { // cross-domain -- mimic original with all its tag attributes
        for (var j = 0, a; a = i.attributes[j]; j++)
            c.setAttribute(a.name, a.value);
        i.parentNode.replaceChild(c, i);
    }
}
function khacGetFilename(url)
{
   if (url)
   {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1)
      {
         return m[1];
      }
   }
   return "";
}
function khacextractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}
function khacDoImagesAlt(from){
	jQuery('img').each(function(){
		if (khacAssetsDATA.force_alt=='yes' || !jQuery(this).attr('alt')){
			if(from=='from_page_title'){
				jQuery(this).attr('alt',document.title);
			}else{
				var title=khacGetFilename(jQuery(this).attr('src'));
				jQuery(this).attr('alt',title);
			}
		}
	
	});
	
	if (khacAssetsDATA.force_alt_inside_class.length>0 &&
			jQuery(khacAssetsDATA.force_alt_inside_class).length>0){
		
		jQuery(khacAssetsDATA.force_alt_inside_class).find('img').each(function(){
					if(from=='from_page_title'){
						jQuery(this).attr('alt',document.title);
					}else{
						var title=khacGetFilename(jQuery(this).attr('src'));
						jQuery(this).attr('alt',title);
					}
		});
	}
	
	
}
function khacGettranzlated(str){
	if(typeof khacAssetsDATA.strings[str]!='undefined'){
		return khacAssetsDATA.strings[str];
	}
	return str;
}
function khacDoImagesTitle(from){
	jQuery('img').each(function(){
		//apply when the image doesn't has ancor parent
		if(jQuery(this).parents('a').length==0){
			if (khacAssetsDATA.force_title=='yes' ||  !jQuery(this).attr('title')){
				if(from=='from_page_title'){
					jQuery(this).attr('title',document.title);
				}else{
					var title=khacGetFilename(jQuery(this).attr('src'));
					jQuery(this).attr('title',title);
				}
				
				var alt=jQuery(this).attr('alt');
				if(alt.length>0){
					jQuery(this).attr('title',alt);
				}

				
				
				
			}
		}
	});
 
	
}
jQuery(document).keyup(function(e) {
    if (e.keyCode == 27) {
   	 var ishas=jQuery('.access-menu-nav').hasClass('active');
   	 if(jQuery('.access-menu-nav').hasClass('active')){
	    	 khacCloseMenu();
	     }
   }
});
function khacOpenMenu(){
	jQuery('.access-menu-nav').addClass('active');
}
function khacCloseMenu(){
	jQuery('.access-menu-nav').removeClass('active');
}
jQuery(document).on("click","body",function() {
	khacObj.loadMode('taborder');
}); 
function khacCookieHelper(){
	if(typeof khacAssetsDATA=='undefined'){
		return false;
	}
	/*
	 * catch object
	 */
	var k=this;
	
	// cookie name
	k.cookieName=khacAssetsDATA.cookieName; 
	
	// default modes
	k.cookieArgs={contrast:false,
					highcontrast:false,
					taborder:khacAssetsDATA.taborder,
					roleinfoorder:khacAssetsDATA.roleinfoorder,
					lightboxes:khacAssetsDATA.lightboxes,
					focusmanage:khacAssetsDATA.focusmanage,
					ajax_errors:khacAssetsDATA.ajax_errors,
					anchor_titles:true,
					reports:(khacAssetsDATA.reportsmode == 'on' ? true : false),
					reportsArgs:new Array(),
					grayscle:false,
					disableanimate:false,
					fontsize:false};
	
	/*
	 * all click events
	 */
	k.toggleClicks=function(){
		/*
		 * contrast mode toggle
		 */
		jQuery('.toggle-access-contrast').click(function(ev){
	 		khacObj.loadMode('contrast');
	 		ev.preventDefault();
		});
		
		/*
		 * toggle reset
		 */
		jQuery('.toggle-access-reset-all').click(function(ev){
 	 		khacObj.resetSettings();
 	 		ev.preventDefault();
		});
		/*
		 * high contrast mode toggle
		 */
		jQuery('.toggle-access-highcontrast').click(function(ev){
			khacObj.loadMode('highcontrast');
			ev.preventDefault();
		});
		/*
		 * grayscle mode toggle
		 */
		jQuery('.toggle-access-grayscle').click(function(ev){
			khacObj.loadMode('grayscle');
			ev.preventDefault();
		});
		/*
		 * font size toggle
		 */
		jQuery('.toggle-font-size').click(function(ev){
			jQuery('.toggle-font-size.active').removeClass('active');
			jQuery(this).addClass('active');
			khacObj.loadMode('fontsize');
			ev.preventDefault();
		});
		/*
		 * animate toggle
		 */
		jQuery('.toggle-access-disableanimate').click(function(ev){
			khacObj.loadMode('disableanimate');
			ev.preventDefault();
		});
		
		 
	};
	
	/*
	 * load defualt
	 */
	k.loadDefaults = function() {
		cookieArr=new Object();
		k.toggleClicks();
		var cookieArrs=jQuery.cookie(k.cookieName);
 		if(typeof cookieArrs!='undefined'){
			k.cookieArgs=cookieArrs;
			//k.loadAllmodes();
		}
		k.loadAllmodes();
		
		
  		return k.cookieArgs;
	};
	
	/*
	 * generate all available modes
	 */
	k.loadAllmodes=function(){
		jQuery.each(k.cookieArgs, function(slug, value){
 			if(value){
		    	k.loadMode(slug);
		    }
		});
	};
	/*
	 * clear all available modes
	 */
	k.clearModes=function(slugEclude){
		jQuery.each(k.cookieArgs, function(slug, value){
			if(slugEclude!=slug){
				jQuery('body').removeClass(slug+'-access-loaded');
				jQuery('.'+slug+'-access-css').remove();
			}
		});
	};
	
	/*
	 * refresh cookie
	 */
	k.refresh = function(){
			k.saveCookie();
		};

	/*
	 * savecookie
	 */
	k.saveCookie = function() {
		cookieArr=new Object();
		cookieArr=k.cookieArgs;
 		jQuery.cookie(k.cookieName,cookieArr ,{ expires:1, path: '/' });
		var cookieArrs=jQuery.cookie(k.cookieName);
	};
	/*
	 * load cookie
	 */
	k.loadCookie = function() {
		cookieArr=new Object();
		var cookieArrs=jQuery.cookie(k.cookieName);
		return cookieArrs;
	};
	/*
	 * toggle reset all
	 */
	k.resetSettings=function(){
		// contrast
		jQuery('body').removeClass('contrast-access-loaded');
		jQuery('.contrast-access-css').remove();
		k.cookieArgs.contrast=false;

		
		// high contrast
		jQuery('body').removeClass('toggle-access-highcontrast');
		k.cookieArgs.highcontrast=false;
		
		//font size
		jQuery('body').removeClass('fontup-loaded').removeClass('fontdown-loaded').removeClass('fontreset-loaded');
		k.cookieArgs.fontsize=false;
		
		// animation
		jQuery('body').removeClass('disableanimate');
		k.cookieArgs.disableanimate=false;
		
		
		//graysle
		jQuery('body').removeClass('grayscle-access-loaded');
		k.cookieArgs.grayscle=false;
		
		
		k.refresh();
	}
	/*
	 * load mode by Slug
	 */
	k.loadMode= function(slug){
	 
		
		switch(slug){
			case 'contrast':
				k.clearModes(slug);
				k.loadContrast();
			break;
			case 'anchor_titles':
 				k.anchorTitles();
				break;
			case 'taborder':
				k.tabOrders();
				break;
			case 'roleinfoorder':
				k.roleinfoorder();
				break;
			case 'lightboxes':
				k.lightboxes();
				break;
			case 'focusmanage':
				k.focusmanage();
				break;
			case 'ajax_errors':
				k.ajax_errors();
				break;
			case 'highcontrast':
				k.clearModes(slug);
				k.highcontrast();
				break;
			case 'grayscle':
				k.clearModes(slug);
				k.loadGrayscle();
			break;
			case 'fontsize':
				k.fontsize();
			break;
			case 'disableanimate':
				k.disableanimate();
				break;
			case 'reports':
				k.reports();
				break;
		}
		k.refresh();
		
		 
	};
	k.ajax_errors=function(){
		var ajaxerrorsIndexlength=k.cookieArgs.ajax_errors.length;
		if(ajaxerrorsIndexlength>0){
			var ind=1;
			for(var i=0;i<ajaxerrorsIndexlength; i++){
				if(typeof k.cookieArgs.ajax_errors[i]!='undefined'){
					var selector=k.cookieArgs.ajax_errors[i];

					if(jQuery(selector).length>0){
						jQuery(selector).each(function(){
							jQuery(this).attr('aria-live','assertive');
							ind++;
						});
						
						
					}
				}
			}
		}
	};
	k.tabOrders=function(){
		var tabIndexlength=k.cookieArgs.taborder.length;
		if(tabIndexlength>0){
			var ind=1;
			for(var i=0;i<tabIndexlength; i++){
				if(typeof k.cookieArgs.taborder[i]!='undefined'){
					var selector=k.cookieArgs.taborder[i];
					if(jQuery(selector).length>0){
						jQuery(selector).each(function(){
							jQuery(this).attr('tabindex',ind);
							ind++;
						});
						
						
					}
				}
			}
		}
	};
	k.roleinfoorder=function(){
		var tabIndexlength=k.cookieArgs.roleinfoorder.length;
	
 		if(tabIndexlength>0){
  			for(var i=0;i<tabIndexlength ; i++){
 				if(jQuery(k.cookieArgs.roleinfoorder[i].selector).length>0){
	 				var s=jQuery(k.cookieArgs.roleinfoorder[i].selector); 
	 				if(s.length>0){
						s.prepend('<a id="kh_accc_'+i+'" title="'+k.cookieArgs.roleinfoorder[i].text+'" href="#"></a>');
					}
  				}
 			}
 			
			 jQuery('.khac_jump_to').click(function(){
				var s=jQuery(this).data('selector'); 
 				if(jQuery(s).length>0){
					jQuery(s).eq(0).focus();
					jQuery(s).attr('tabindex','-1');
				}
			 });
		}
	};
	k.lightboxes=function(){
		var lightboxeslength=k.cookieArgs.lightboxes.length;
		if(lightboxeslength>0){
			for(var i=0;i<lightboxeslength ; i++){
				 
				if(jQuery(k.cookieArgs.lightboxes[i].turn_on).length>0){
					var turn_on=jQuery(k.cookieArgs.lightboxes[i].turn_on); 
					var turn_off=jQuery(k.cookieArgs.lightboxes[i].turn_off); 
					var content_selector=jQuery(k.cookieArgs.lightboxes[i].content_selector); 
					turn_on.attr('data-acc_cnt_selector',k.cookieArgs.lightboxes[i].content_selector);
					 
					jQuery(turn_on).on("click", function(ev){
						var content_selector=jQuery(jQuery(this).attr('data-acc_cnt_selector'));
							content_selector.attr('aria-live','assertive');
							content_selector.attr('role','dialog');
							content_selector.attr('tabindex',-1);
							content_selector.focus();
					});
					jQuery(document).on("click",turn_off, function(){
						jQuery('body').attr('tabindex','-1');
					});

					jQuery(document).keyup(function(e) {
					     if (e.keyCode == 27) { 
					    	 turn_off.click();
					    }
					});
				}
			}
		}
	};
	k.focusmanage=function(){
		var focusmanagelength=k.cookieArgs.focusmanage.length;
		if(focusmanagelength>0){
			for(var i=0;i<focusmanagelength ; i++){
				
				if(jQuery(k.cookieArgs.focusmanage[i].selector).length>0){
					var selector=jQuery(k.cookieArgs.focusmanage[i].selector); 
					var target=jQuery(k.cookieArgs.focusmanage[i].target); 
					jQuery(selector).on("click", function(ev){
						target.attr('aria-live','assertive');
						target.attr('role','dialog');
						target.attr('tabindex',-1);
						target.focus();
					});
					
		
				}
			}
		}
	};
	k.anchorTitles=function(){
		var currdomain = new RegExp(location.host);
		jQuery('a').each(function(){
			var cuurAnchor=jQuery(this);
			jQuery(this).text(function(index ,content){
				
				var title=cuurAnchor.attr('title');
			 
				if(typeof title=='undefined' || !cuurAnchor.attr('title') || title.length==0){
					
					
  				 
  					if(content.length==0){
						content=khacextractDomain(cuurAnchor.attr('href'));
					}else {
						// clear all white spaces and break lines
						content = content.replace(/^\s+|\s+$/g, "");
						content=jQuery.trim(content.replace(/[\t\n]+/g,' '));
	 					content = content.replace(/(([^\s]+\s\s*){5})(.*)/,"$1…");
					}
 					var titleString='';
 					var href=cuurAnchor.attr('href');
 					if(href.length==0){
 						titleString+=khacGettranzlated('blank_link');
  					}else{
	 					if((/mailto/.test(href)) || (/@/.test(href))){
	 						titleString+=khacGettranzlated('send_an_email');
	  					}else if(/tel/.test(href)){
	  						titleString+=khacGettranzlated('make_a_call');
	  					}else if((/javascript/.test(href)) || (/#/.test(href))){
	  						titleString+=khacGettranzlated('button_link');
	  					}else if(!currdomain.test(href)){
	  						titleString+=khacGettranzlated('outer_link');
	  					}
  					}
 					 
  			 
 					titleString+=' '+content;
					cuurAnchor.attr('title',titleString);
				}
				
			});
		});
		
		
	};

	
	/*
	 * contrast slug
	 */
	k.loadContrast=function(){
		if(!jQuery('body').hasClass('contrast-access-loaded')){
			jQuery('body').addClass('contrast-access-loaded');
			jQuery('head').append('<link class="contrast-access-css" href="'+khacAssetsDATA.assetsUrl+'css/contrast.css" rel="stylesheet" type="text/css" media="all" />');
			k.cookieArgs.contrast=true;
			 
		}else{
			jQuery('body').removeClass('contrast-access-loaded');
			jQuery('.contrast-access-css').remove();
			k.cookieArgs.contrast=false;
		}
	}
	/*
	 * high contrast slug
	 */
	k.highcontrast=function(){
		if(!jQuery('body').hasClass('toggle-access-highcontrast')){
			jQuery('body').addClass('toggle-access-highcontrast');
 			k.cookieArgs.highcontrast=true;
			
		}else{
			jQuery('body').removeClass('toggle-access-highcontrast');
 			k.cookieArgs.highcontrast=false;
		}
	}
	/*
	 * fontsize slug
	 */
	k.fontsize=function(){
		if(jQuery('.toggle-font-size.active').length>0){
			var newsize=jQuery('.toggle-font-size.active').data('size');
			k.cookieArgs.fontsize=newsize;
		}
		
		jQuery('body').removeClass('fontup-loaded').removeClass('fontdown-loaded').removeClass('fontreset-loaded');
		jQuery('body').addClass('font'+k.cookieArgs.fontsize+'-loaded');
		
		if(newsize=='reset'){
			k.cookieArgs.fontsize=false;
		}
	}
	/*
	 * fontsize slug
	 */
	k.disableanimate=function( ){
 
		
		if(!jQuery('body').hasClass('disableanimate')){
			jQuery('body').addClass('disableanimate');
	 
			[].slice.apply(document.images).filter(is_gif_image).map(freeze_gif);

			
			k.cookieArgs.disableanimate=true;
		}else{
			
			jQuery('img').each(function(){
				
				var t=jQuery(this);
				if(typeof t.attr('data-orgsrc')!='undefined'){
					var ext=t.attr('data-orgsrc').split('.').pop();
					if(ext=='gif'){
						t.attr('src',t.attr('data-orgsrc') ); 
					}
					
				}
			});
			 
			
			jQuery('body').removeClass('disableanimate');
			k.cookieArgs.disableanimate=false;
		}
		 
	}
	/*
	 * grayscle slug
	 */
	k.loadGrayscle=function(){
		 
		if(!jQuery('body').hasClass('grayscle-access-loaded')){
			jQuery('body').addClass('grayscle-access-loaded');
			k.cookieArgs.grayscle=true;
		}else{
			jQuery('body').removeClass('grayscle-access-loaded');
			k.cookieArgs.grayscle=false;
		}
	}
	
	
	/*
	 * reports
	 */
	k.reports=function(){
		return false;
		///forms
		var formsObj={};
		var find=0;
		jQuery('input').each(function(){
			var e=jQuery(this);
			if (e.parents('form').length==0  ) {
				var inp={};
				inp['id']=e.attr('id');
				inp['name']=e.attr('name');
				inp['type']=e.attr('type');
				inp['class']=e.attr('class');
				inp['error']='field without form tag' ;
				formsObj[find]=inp;
				find++;
  			}		
		});
		jQuery('input').each(function(){
			var e=jQuery(this);
			if (e.attr('id')) {
				if(jQuery('label[for="'+e.attr('id')+'"]').length==0){
					var inp={};
					inp['id']=e.attr('id');
					inp['name']=e.attr('name');
					inp['type']=e.attr('type');
					inp['class']=e.attr('class');
					inp['error']='missing label tag' ;
					formsObj[find]=inp;
					find++;
				}
			}		
		});
		k.cookieArgs.reportsArgs={fields: formsObj};
		var headingsErrors={};
		if(jQuery('h1').length==0){
			var inp={};
			inp['error']='missing h1 tag on page' ;
			headingsErrors[0]=inp;
		}
		k.cookieArgs.reportsArgs={'headings': headingsErrors};

 		k.refresh();
 		 
 
 		if(typeof k.cookieArgs.reportsArgs !='undefined' ){
 			var args=k.cookieArgs.reportsArgs;
 			jQuery.ajax({
 			    type: "POST",
 				dataType : 'json' ,
 			    url: khacAssetsDATA.ajaxurl,
 			    data: {'action':'khacreportajaxing','url':window.location.href, 'args':args},
 			    cache: false,
 			    success: function(data){
  			    }
 			}); 
 			
 			 
	 		
	 		
		}
		
	};
}



/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
if(!jQuery().cookie) {
	
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));
}

/////////////////////////////
