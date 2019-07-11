
; /* Start:"a:4:{s:4:"full";s:61:"/bitrix/templates/nkj.kotico/js/ajax_basket.js?15185232361045";s:6:"source";s:46:"/bitrix/templates/nkj.kotico/js/ajax_basket.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
/* function basket_update_icon() {
	$.ajax({
		type : 'GET',
		url : '/shop/basket_icon.php',
		success : function(data){ $('a.basket').replaceWith( data ); }
	});
}

function basket_add(id, callbacks) {
	$.ajax({
		type : 'GET',
		url : '/shop/add2basket.php',
		data : 'action=ADD2BASKET&ajax_basket=Y&id=' + id,
		success : [ basket_update_icon ].concat( callbacks || [] )
	});
}
 // */

function basket_add(id, callback) {
	var request = new XMLHttpRequest();
	request.open('POST', '/personal/add2basket.php', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		// Success!
		var resp = request.responseText;
		var basket = document.querySelector('a.basket .cnt');
		if (basket !== null) {
			basket.innerHTML = parseInt(resp);
			if (typeof callback == 'function') { callback(); }
		}
	  } else {
		// We reached our target server, but it returned an error

	  }
	};	
	request.send('item_id=' + id);
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:52:"/bitrix/templates/nkj.kotico/script.js?1552211814656";s:6:"source";s:38:"/bitrix/templates/nkj.kotico/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
window.___gcfg = {lang: 'ru'};
function search_navigate(text) {
	window.location = 'https://www.nkj.ru/search/?q=' + encodeURIComponent(text);
}
document.addEventListener("DOMContentLoaded", function(event) {
	var el_above_facts = document.getElementById('b_right_above_facts');
	if (el_above_facts) {
		var request = new XMLHttpRequest();
		request.open('GET', '/show-delayed.php', true);
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
			// Success!
			el_above_facts.innerHTML = request.responseText;
		  } else {
			// We reached our target server, but it returned an error
		  }
		};
		request.send();
	}
});

/* End */
;; /* /bitrix/templates/nkj.kotico/js/ajax_basket.js?15185232361045*/
; /* /bitrix/templates/nkj.kotico/script.js?1552211814656*/
