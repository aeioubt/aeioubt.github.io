/*!
 * Setting-Of-Forum JavaScript Pack v6.4
 * Make setting of forum on service http://liveforums.ru/setting-forum.html
 *
 * Copyright 2012, LiveForums.ru
 *
 * Date: Tue Nov 13 10:34:41 2012 +11:00
 */
 
// Дефолтные настройки дополнительных функций форума

var ActiveTopics = 10;
var ActiveTopicsName = 'Активные темы форума';
var FullStat = 1;
var InfoTablo = 1;
var InfoPanel = 1;
var CloseCategory = 1;
var SocioButtons = 1;
var LoginColor = new Array();
var SpoilerPost = 1;
var SpoilerInfoAutor = 1;
var NullAvatar = 'http://i.liveforums.ru/f/ru/liveforums/null_avatar.png';
var SelectCode = 1;
var NullPostSig = ''; // gamma
var YandexPlayer = 1;
var HideUrl = 1;
var HidePicture = 1;
var HideVideo = 1;
var HideProfail = 1;
var UpScroll = 1;
var LoadFail = 1;
var FullColor = 1;
var WarningPoll = 1;
var MessageHotkey = 1;
var NoticeNewMessage = 1;
var ExitSession = 0;

// Переменные форума. Первый блок
var lf_host = encodeURIComponent(window.location.host);
var lf_page_url = document.location.href.toString();

// Main functions

$('<link>',{rel:'stylesheet', type:'text/css', href:'http://i.liveforums.ru/f/ru/liveforums/forum_style.css'}).appendTo('head');

function spl_call(){
var namespl = prompt('Введите описание скрытого текста', 'Спойлер');
if(namespl!=null && namespl!='' && window.namespl!='object' && window.namespl!='undefined')
bbcode('[spoiler]',('|'+namespl+'[/spoiler]'));}


$('cite > input.spoiler-button').live('click', function(){
$(this).parents('div.quote-box:first').find('blockquote.quote-box:first').toggle('normal');
var a = $(this).attr('value');$(this).attr('value',$(this).attr('id'));$(this).attr('id',a);
});

// Обработка для плеера Яндекса
function addYandex(str,from,internal){
var pos=0,pos2=0,newpos=0
if((pos=str.indexOf("[yandx]",from))==-1) return str;
if((pos2=str.indexOf("[/yandx]"),pos+8)==-1) return str;
newpos=str.indexOf("[yandx]",pos+8)
if(newpos<pos2 && newpos!=-1) str=addYandex(str,pos+8,true)
if((pos2=str.indexOf("[/yandx]",pos+8))==-1) return str;
str=str.substring(0,pos)+makeYandex(str.substring(pos+7,pos2))+str.substring(pos2+8,str.length)
if( str.indexOf("[yandx]")!=-1 && internal==false) str=addYandex(str,0,false)
return str;
}
// Вызов плеера Яндекса
function makeYandex(txt){
txt='<embed src="http://static.video.yandex.ru/lite-audio/'+txt+'" type="application/x-shockwave-flash" width="300" height="72" allowFullScreen="true" scale="noscale"/>';
return txt;
}

// Выделение кода
function select_text(elem) {
	if(window.getSelection) {   
var s=window.getSelection();   
if(s.setBaseAndExtent){   
	s.setBaseAndExtent(elem,0,elem,elem.innerText.length-1);}
else { 
	var r=document.createRange();   
	r.selectNodeContents(elem);   
	s.removeAllRanges();   
	s.addRange(r);}}
	else if(document.getSelection){   
var s=document.getSelection();   
var r=document.createRange();   
r.selectNodeContents(elem);   
s.removeAllRanges();   
s.addRange(r);}
	else if(document.selection){   
var r=document.body.createTextRange();   
r.moveToElementText(elem);   
r.select();
}}

var SoundNewMessage='http://soundjay.com/button/button-46.wav', code_sound='';
function NoticeMessage(msg,num){
if(NoticeNewMessage>1) code_sound='<audio autoplay="autoplay"><source src="'+SoundNewMessage+'"></audio>';
var newpm='новое ЛС'; if(num>1) newpm='новые ЛС ('+num+')';
$('#pun').prepend('<style type="text/css">div#newpm{position:fixed; z-index:10000; bottom:1em; left:1em; width:40em;} em#close_newpm{float:right; cursor:pointer;}</style><div id="newpm" class="punbb"><div id="pun-main" class="main"><div class="category"><h2 style="text-aling:left !important;"><div class="catleft"><!-- --></div><em id="close_newpm">Скрыть</em><span>'+UserLogin+', у вас '+newpm+'</span><div class="catright"><!-- --></div></h2><div class="info"><ul class="container" style="clear:both;">'+msg+'</ul>'+code_sound+'</div></div></div></div>');
}

$('#close_newpm').live('click',function(){
$('#newpm').toggle('slow');});

function AjaxFindNewPM(){
var pm_info='', pm=0;
$.ajax({
  type: 'GET',
  dataType: 'script',
  cache: false,
  url: 'messages.php?random=' + Math.random(),
  success: function(data){
        var pm_title, pm_url, pm_autor, pm_upa;
        $(data).find('tr[class^=icon]').each(function(){
          pm_title=$(this).find('div[class^=tclcon] a').text();
          pm_url=$(this).find('div[class^=tclcon] a').attr('href');
          pm_autor=$(this).find('td[class^=tc2] a').text();
          pm_upa=$(this).find('td[class^=tc2] a').attr('href');
          pm_info+='<li><a href="'+pm_url+'">'+pm_title+'</a> от <a href="'+pm_upa+'">'+pm_autor+'</a></li>';
          pm++;
        });
        $.get(lf_page_url);
        if(pm!=0){clearInterval(timer);  if($('#newpm').html()==null)NoticeMessage(pm_info,pm);} 
  }
});
}

if(window.lf_setting == undefined){
var lf_setting=1;  
$(document).ready(function(){

// Переменные форума. Второй блок

var lf_page_id = $('#pun > div:first').attr('id');
var lf_page_class = $('#pun > div:first').prop('class');
if(lf_page_class == 'punbb punbb-admin')return(0);

if(ActiveTopics != '0' && lf_page_id == 'pun-index') // Активные темы форума
$(function(){
  $('div.category:last').after('<div id="pun-category102" class="category"><h2><div class="catleft"><!-- --></div><span>'+ActiveTopicsName+'</span></h2><div class="container"><table cellspacing="0"><tbody class="hasicon" id="activetopics"></tbody></table></div></div>');

  function processXML(data){
   $(data).find('item:lt('+ActiveTopics+')').each(function(){
    var JAuthor, JTitle, JLink, JPosted, JDate, JDateMinutes, JDateMonth, JStyle;
    JAuthor=$(this).find('author').text().slice(14,-1);
    JTitle=$(this).find('title').text();
    JLink=$(this).find('link').text();
    JContent=$(this).find('description').text();
    JContent=JContent.replace(/([\t|"|']+?)/gim,'').replace(/&#160;/,''); //  delet bad symbol .split('#')[0]
    JContent=JContent.replace(/<((\/p|br \/|\/blockquote)+?)>/gim,'\n').replace(/\n{3,}/gim,'\n'); //  intel format .replace(/(\S:+?)/gim,'$1 ')
    JContent=JContent.replace(/написал\(а\):/gim,'написал(а): ').replace(/Скрытый текст:/gim,'Скрытый текст: ').replace(/Код:/gim,'Код: ').replace(/<\/div><blockquote>/,' — '); 
    JContent=JContent.replace(/<([\s\S]*?)>/gim,''); //  delet html-tags
    JPosted=$(this).find('pubDate').text();
    JDate = new Date(JPosted);
    JDateMinutes='0' + JDate.getMinutes();
    JDateMonth=JDate.getMonth();
    var JMonthText=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    for(m=0;LoginColor[m];m=m+3){if(JAuthor==LoginColor[m]){JStyle=' style="color:'+LoginColor[m+1]+'; font-weight:'+LoginColor[m+2]+';"'; break;}else JStyle='';}
    $('#activetopics').append('<tr><td class="tcr"><a target="_blank" href="'+JLink+'&action=new" title="'+JContent+'">'+JTitle+'</a>, обновил <u'+JStyle+'>'+JAuthor+'</u> в '+JDate.getHours()+':'+JDateMinutes.slice(-2)+' '+JDate.getDate()+'-го '+JMonthText[JDateMonth]+'</td></tr>');

   });
  }

  $.get('export.php?type=rss&max='+ActiveTopics,'',processXML);
});

if(FullStat == 1 && lf_page_id == 'pun-index') // Кол-во категорий и форумов в статистике
$(function (){ 
var nf = $('tr.alt1').length+$('tr.alt2').length, nc = $('div.category').length, nm = '<li class="item1">Всего ';
// if(InfoPanel == 1 && GroupID == 1) nc--; if(InfoTablo == 1 && GroupID != 3) nc--;
if(ActiveTopics!=0)nc--;if(nc==-1)nc=0;if(nf==-1)nf=0; $('#pun-stats li.item1:first').before(nm+'форумов: <b>'+nf+'</b></li>'+nm+'категорий: <b>'+nc+'</b></li>');
});

if(InfoTablo == 1 && GroupID != 3 && lf_page_id == 'pun-index') // Инфо-табло
$(function (){
var mon_array = new Array('', 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря');
Tm = new Date(); Tm.setTime(1000*UserRegistered); m=Tm.getMonth()+1;
if (m<10) m=m; hh=Tm.getHours(); mm=Tm.getMinutes()+'';
if (mm<10) mm=mm; UserRegistered='<b>'+Tm.getDate()+'&nbsp;'+mon_array[m]+'</b>&nbsp;в&nbsp;<b>'+hh+':'+mm+'</b>';
UserTotalTime = Math.floor(UserTotalTime/86400);
var SexArr = new Array('<a title="Укажите свой пол" href="/profile.php?section=personal&id='+UserID+'">Пол не указан</a>', 'Пол: <b>муж.</b>', 'Пол: <b>жен.</b>'); UserSex = SexArr[UserSex];
if (UserAvatar == ''){UserAvatar = NullAvatar;}
if (UserBirthDate == ''){UserBirthDate = 'дата не указана';}
if (UserAge == '0'){UserAge = '[нет сведений]';}
if(UserName != '') UserName='Приветствуем на форуме, <b>'+UserName+'</b>!';
else UserName='<a href="/profile.php?section=personal&id='+UserID+'">Укажите своё имя</a>';
$('#pun-category1').before('<div class="category" id="pun-category101" style="margin:0 0 .35em 0 !important;"><h2><div class="catleft"><!-- --></div><span>Информационное табло</span></h2><div class="container"><table cellspacing="0" class="info-table"><tr valign="top"><td class="iblock"><a title="Редактировать профиль" href="/profile.php?id='+UserID+'"><b>'+UserLogin+'</b></a><br /><b title="Ваш статус">'+UserTitle+'</b><br /><a href="/profile.php?section=avatar&id='+UserID+'" title="Изменить аватар"><img style="max-width:99%;" src="'+UserAvatar+'" /></a></td><td class="fblock">'+UserName+'<br />Стиль форума: <a title="Изменить стиль" href="/profile.php?section=display&id='+UserID+'"><b>'+BoardStyle+'</b></a> / <a title="Найти другой стиль в каталоге" href="http://liveforums.ru/catalog-style.html">Каталог стилей</a><br />Вы в группе  <b>'+GroupTitle+'</b>, ваши <a href="/userlist.php?&show_group='+GroupID+'">соучастники</a><br />Ваших сообщений на форуме: <b>'+UserPosts+'</b><br />'+UserSex+', возраст: <b>'+UserAge+'</b><br />День рождения: <b>'+UserBirthDate+'</b></td><td class="hblock"><b>Отношения</b><br /><a href="/respect.php?id='+UserID+'">Уважение</a>: <b>+'+UserRespectPlus+'</b> / <b>-'+UserRespectMinus+'</b><br /><a href="/positive.php?id='+UserID+'">Позитив</a>: <b>+'+UserPositivePlus+'</b> / <b>-'+UserPositiveMinus+'</b><br /><br />Вы зарегистрировались '+UserRegistered+'<br />и провели на форуме <b>'+UserTotalTime+'</b> дней</td></tr></table></div></div>');
});

if(InfoPanel == 1 && GroupID == 1) //Инфо-панель
$(function (){
var lf = '<a href="http://liveforums.ru/';
var us = '<a href="http://liveforums.ru/instructions-and-articles/';
var fp = '<a href="http://support.liveforums.ru/';
$('div.category:first').before('<div id="pun-category100" class="category" style="margin:0 0 .35em 0;"><h2 title="Инфо-панель видима только членам группы Администраторы"><div class="catleft"><!-- --></div><span>Инфо-панель</span></h2><div class="container"><table class="info-table" cellspacing="0"><tr valign="top"><td class="iblock"><ul><li><h2>Важно</h2></li><li>'+us+'domen.html">Домен для форума</a></li><li>'+us+'not-reclame.html">Отключение рекламы</a></li><li>'+lf+'setting-forum.html">Настройщик форума</a></li><li>'+lf+'catalog-style.html">Каталог стилей</a></li><li>'+us+'add-account.html">Поля профиля</a></li></ul></td ><td class="fblock"><ul style="float:left"><li><h2>Инструкции</h2></li><li>'+us+'starter.html">Для новичков</a></li><li>'+us+'admin.html">Администрирование</a></li><li>'+us+'moder.html">Модерирование</a></li><li>'+us+'desing.html">Дизайнерство</a></li><li>'+us+'html-tag.html">Теги HTML</a></li><li>'+us+'pr.html">Продвижение</a></li></ul><a title="SEO-анализ форума" target="_blank" href="http://pr-cy.ru/analysis/'+lf_host+'"><img class="preview" src="http://s.wordpress.com/mshots/v1/http%3A%2F%2F'+lf_host+'%2F?w=165" /></a></td><td class="hblock"><ul><li><h2>Помощь</h2></li><li>'+fp+'">Форум поддержки</a> · '+fp+'search.php">Поиск</a></li><li>'+fp+'viewforum.php?id=3">Вопросы-ответы</a> · '+fp+'post.php?fid=3">Задать вопрос</a></li><li>'+fp+'viewforum.php?id=8">Скрипты</a> · '+fp+'viewtopic.php?id=853">Предложить функцию</a></li><li>'+fp+'viewtopic.php?id=22">Дизайн</a> · '+fp+'viewtopic.php?id=24">Лого</a> · '+fp+'viewtopic.php?id=224">Заявка на BackUP</a></li><li>'+fp+'messages.php?action=new&uid=2">Написать администрации</a></li></ul></td></tr></table></div></div>');
});

if(CloseCategory == 1/* && lf_page_id == 'pun-index'*/) // Сворачивание категорий
$(function (){
function setcookie(a,b,c) {if(c){var d = new Date();d.setTime(d.getTime()+c);}if(a && b) document.cookie = a+'='+b+(c ? '; expires='+d.toUTCString() : '');else return false;}
function getcookie(a) {var b = new RegExp(a+'=([^;]){1,}');var c = b.exec(document.cookie);if(c) c = c[0].split('=');else return false;return c[1] ? c[1] : false;}
var hidebl = {
open:{img:'http://i.liveforums.ru/f/ru/liveforums/open.png', hint: 'Скрыть'},
close: {img: 'http://i.liveforums.ru/f/ru/liveforums/close.png', hint:'Показать'}
};
$('#pun-stats h2:first,#pun-announcement h2:first').prepend('<div class="catleft"><!-- --></div>');
$('h2 div.catleft').after('<em class="offctgr" style="float: right;"><img src="'+hidebl.open.img+'" alt="'+hidebl.open.hint+'" title="'+hidebl.open.hint+'" /></em>');
$('#pun-main div.category,#pun-stats,#pun-announcement').each(function (i) {
    var ctgId=$(this).attr('id');
         if(getcookie(ctgId)=='close'){
         if(ctgId=='pun-announcement') $(this).find('.html-box').css({'display':'none'});
         else $(this).find('.container').css({'display':'none'});
   $(this).find('h2:first > .offctgr img').attr({'src':hidebl.close.img,'title':hidebl.close.hint,'alt':hidebl.close.hint});}
});
// продолжение
$('em.offctgr').click(function(){
var cat=$(this).parents('div.category,div.section').attr('id');
//alert (cat);
if(cat.indexOf('pun-category')!=-1) $(this).parents('div.category').children('.container:first').toggle('slow');
else if(cat=='pun-stats') $(this).parents('#pun-stats').find('ul.container:first').toggle('slow');
else if(cat=='pun-announcement') $(this).parents('#pun-announcement').find('.html-box').toggle('slow');

if($(this).find("img").attr('src')==hidebl.close.img)
$(this).find("img").attr({'src':hidebl.open.img,'title':hidebl.open.hint,'alt':hidebl.open.hint});
else $(this).find("img").attr({'src':hidebl.close.img,'title':hidebl.close.hint,'alt':hidebl.close.hint});
var catc = getcookie(cat);
catc = catc == 'close' ? 'open' : 'close';
setcookie(cat,catc,3600*24*30*1000);
      return false; });
});

if(SocioButtons == 1)
$(function (){ 
var u = lf_page_url+'"><img alt="" src="http://i.liveforums.ru/f/ru/liveforums/shricn_', p = 'Поделиться '  
var sp = 'position: relative; z-index:999; margin: -20px 10px 0px 0px;', sm = 'margin: -2.3em 1em .35em 0px;', sn='';
var hr='<a target="_blank" title='; tr='href="http://'; if(lf_page_id == 'pun-index') sn = sm; else sn = sp;
var b = '<style>#share{float:right; text-align: right; '+sn+'}</style><span id="share">'+hr+'"'+p+'ВКонтакте" '+tr+'vk.com/share.php?url='+u+'vk.ico"></a> '+hr+'"'+p+'в Facebook" '+tr+'facebook.com/share.php?u='+u+'fb.ico"></a> '+hr+'"'+p+'в Twitter" '+tr+'twitter.com/share?url='+u+'tw.ico" ></a> '+hr+'"'+p+'на Одноклассниках" '+tr+'odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl='+u+'cl.ico"></a> '+hr+'"'+p+'в Моем Мире" '+tr+'connect.mail.ru/share?share_url='+u+'mm.png"></a> '+hr+'"'+p+'на Я.ру" '+tr+'share.yandex.ru/go.xml?service=yaru&url='+u+'ya.ico"></a> '+hr+'"'+p+'в ЖЖ" '+tr+'livejournal.com/update.bml?event='+u+'lj.png"></a> '+hr+'"Добавить в Memory" '+tr+'memori.ru/link/?sm=1&u_data[url]='+u+'me.ico"></a></span>';
if(lf_page_id =='pun-index')$('#pun-crumbs1 p').after(b); else $('div.linkst').after(b);
});

$(function (){ // Цветовыделение логинов
for(m=0;LoginColor[m];m=m+3){$('a').each(function (){if($(this).text()==LoginColor[m])$(this).html('<u style="color:'+LoginColor[m+1]+'; font-weight:'+LoginColor[m+2]+';">'+LoginColor[m]+'</u>');});}
});
if(/*window.$doc != undefined &&*/ lf_page_id == 'pun-index') // Цветовыделение ников в стате LiveForums.ru, 0pk, rusff
setTimeout(function(){for(m=0;LoginColor[m];m=m+3){$('#pun-stats a').each(function (){if($(this).text()==LoginColor[m])$(this).html('<u style="color:'+LoginColor[m+1]+'; font-weight:'+LoginColor[m+2]+';">'+LoginColor[m]+'</u>');});}}, 650);

if(SpoilerInfoAutor == 1 && lf_page_id == 'pun-viewtopic') // Спойлер информации об авторе поста
$(function (){
$('#pun-viewtopic').before('<style>.post-author li.pa-from, .post-author li.pa-reg, .post-author li.pa-invites, .post-author li.pa-posts, .post-author li.pa-respect, .post-author li.pa-positive, .post-author li.pa-sex, .post-author li.pa-age, .post-author li.pa-icq, .post-author li.pa-fld1, .post-author li.pa-fld2, .post-author li.pa-fld3, .post-author li.pa-fld4, .post-author li.pa-fld5, .post-author li.pa-ip, .post-author li.pa-time-visit, .post-author li.pa-last-visit, .post-author li.pa-online {display:none;} .pa-hidePunk {margin-top:.8em;}</style>');

hidePunkt=new Array("pa-from", "pa-reg", "pa-invites", "pa-posts", "pa-respect", "pa-positive", "pa-sex", "pa-age", "pa-icq",  "pa-fld1", "pa-fld2", "pa-fld3", "pa-fld4", "pa-fld5", "pa-ip", "pa-time-visit", "pa-last-visit", "pa-online", "End ul");
var g01='<img src="http://i.liveforums.ru/f/ru/liveforums/close.png" title="Показать информацию об авторе сообщения" />';
var g00='<img style="display:none;" src="http://i.liveforums.ru/f/ru/liveforums/open.png" title="Скрыть информацию" />';

$('#pun-viewtopic .post .post-author').each(function (){
if($(this).find('li.pa-title').html()=='Гость'){return true;}	
for(var i=0;i<hidePunkt.length-1;i++){
if($(this).find('li.'+hidePunkt[i]).html()!=null){
$(this).find('li.'+hidePunkt[i]).addClass('hidePunkt');};};
$(this).find('ul').append('<li class="pa-hidePunk">'+g01+g00+'</li>');
});
	
$('li.pa-hidePunk').click(function (){
$(this).find('img').toggle();
$(this).parent('ul').find('li.hidePunkt').toggle('slow');
});
});


if(NullAvatar!='' && lf_page_id == 'pun-viewtopic') // Аватар по умолчанию тем (кроме гостей), у кого нет аватара
$(function (){
var s='<li class="pa-avatar item2"><img class="defavtr" src="'+NullAvatar+'" alt="Аватар"/></li>';
$('li.pa-title').each(function(){
var ul=$(this).parent('ul');
if ((ul.find('li.pa-avatar').html())==null && (ul.find('li.pa-title').html())!='Гость')
{$(this).after(s);};});
});

if(NullPostSig!='' && lf_page_id == 'pun-viewtopic') // Подпись по умолчанию тем, у кого она не указана в профиле
$(function (){
var s='<dl class="post-sig"><dt><span>Подпись автора</span></dt><dd><p>'+NullPostSig+'</p></dd></dl>';
$('div.post-content').each(function(){if ($(this).find('dl.post-sig').html()==null)$(this).append(s);});
});

if(YandexPlayer == 1) // Яндекс-плеер
$(function (){
if(/^(pun-post|pun-poll|pun-edit|pun-viewtopic|pun-messages)$/.test(lf_page_id)) $('#button-image').after('<td style="background:url(\'http://i.liveforums.ru/f/ru/liveforums/ya_play.png\') no-repeat center !important;"><img  src="/i/blank.gif" title="Прикрепить музыку c Яндекс.Видео" onclick="bbcode(\'[yandx]\', \'[/yandx]\');" /></td>');
elm=document.getElementById('pun').getElementsByTagName('div')
for(x in elm) if(elm[x].className=='post-content'){
var post=elm[x];
post.innerHTML=addYandex(post.innerHTML,0,false);}
});

if(HideUrl == 1 && lf_page_id == 'pun-viewtopic' && GroupID == 3) // Скрытие ссылок от гостей
$(function (){
$('div.post-content a[href!=/login.php][href!=/register.php]').each(function(){if($(this).html().indexOf('<img')==-1)
$(this).replaceWith('<div class="quote-box"><cite>Скрытая ссылка:</cite><blockquote><p><a href="/login.php">Войдите</a> или <a href="/register.php">зарегистрируйтесь<a/>, чтобы увидеть ссылку</p></blockquote></div>');});
});
/*
$(function (){
$('div.post-content a[href!=/login.php][href!=/register.php]').replaceWith('<div class="quote-box"><cite>Скрытая ссылка:</cite><blockquote><p><a href="/login.php">Войдите</a> или <a href="/register.php">зарегистрируйтесь<a/>, чтобы увидеть ссылку</p></blockquote></div>');
});
*/

if(HidePicture == 1 && lf_page_id == 'pun-viewtopic' && GroupID == 3) // Скрытие изображений от гостей
$(function (){
$('div.post-content .postimg').replaceWith('<div class="quote-box"><cite>Скрытое изображение:</cite><blockquote><p><a href="/login.php">Войдите</a> или <a href="/register.php">зарегистрируйтесь<a/>, чтобы увидеть изображение</p></blockquote></div>');
});

if(HideVideo == 1 && lf_page_id == 'pun-viewtopic' && GroupID == 3) // Скрытие видео от гостей
$(function (){
$('div.post-content p object').replaceWith('<div class="quote-box"><cite>Скрытое видео:</cite><blockquote><p><a href="/login.php">Войдите</a> или <a href="/register.php">зарегистрируйтесь<a/>, чтобы просмотреть видео</p></blockquote></div>');
});

if(HideProfail == 1 && lf_page_id == 'pun-profile' && GroupID == 3) // Скрытие профилей от гостей
$(function (){
$('#pun-main').css('display','none');$('#pun-status').after('<div id="pun-status" class="section"><p class="container"><span class="item1">Вы не имеете права доступа к этой странице.</span></p></div>');
});

if(SelectCode==1 && (/^(pun-viewtopic|pun-messages)$/.test(lf_page_id))) // Выделение кода
$(function (){
var select = 'select_text(this.parentNode.parentNode.childNodes[1].getElementsByTagName(\'pre\')[0]); return false;';
$('.code-box .legend').prepend('<a href="#" title="Нажмите здесь, чтобы выделить код" onclick="'+select+'">#</a> ');
});

if(UpScroll == 1 && lf_page_id == 'pun-viewtopic' && GroupID != 3) // Скроллинг вверх
$(function (){
$('li.pl-quote').after('&ensp;&ensp; <a href="javascript:scroll(0,0);">Вверх</a>');
});

if(LoadFail == 1 && (/^(pun-post|pun-poll|pun-edit|pun-viewtopic|pun-messages)$/.test(lf_page_id)) && GroupID != 3) //Загрузка файлов
$(function (){
$('#button-video').after('<td style="background:url(\'http://i.liveforums.ru/f/ru/liveforums/up_load.png\') no-repeat center !important;" onclick="window.open(\'http://liveforums.ifolder.ru/\', \'uploadfile\', \'width=900,height=450,top=140,left=50,directories=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no\');"><img src="/i/blank.gif" title="Прикрепить файл"/></td>');
});

if(FullColor == 1 && (/^(pun-post|pun-poll|pun-edit|pun-viewtopic|pun-messages)$/.test(lf_page_id)) && GroupID != 3) // Палитра
$(function (){
var ColorsBank = new Array ('00', '33', '66', '99', 'cc', 'ff'), i=0, table='', ColorArray = new Array();
for(r=0;r<=5;r++){
for(g=0;g<=5;g++){
for(b=0;b<=5;b++){
ColorArray[i]=ColorsBank[r]+''+ColorsBank[g]+''+ColorsBank[b];
table+='<p title="#'+ColorArray[i]+'" style="width:6px; height:1px; float:left; background:#'+ColorArray[i]+'; cursor:pointer;"></p>';
i++;
}}}

tablecolors='Цвет: <input id="now_clr" name="now_clr" type="text" size="7" value=""> Код: <input id="nowclr" name="nowclr" type="text" size="9" value="#RRGGBB"><table style="width:324px !important; padding:5px 0;" cellspacing="0" cellpadding="0"><tr><td id="new_clr" >'+table+'</td></tr></table>';
//alert(tablecolors);
$('div#color-area').prepend(tablecolors);
});

$('#new_clr p').live('mouseover',function (){
var ss=$(this).attr('title');
$("#now_clr").css('background',ss);
$("#nowclr").val(ss);});

$("#new_clr p").live('click',function (){
var ss=$(this).attr('title');
$("#now_clr").css('background',ss);
$("#nowclr").val(ss);
ss='[color='+ss;ss+="]";
bbcode(ss,"[/color]");});

if(WarningPoll == 1 && lf_page_id == 'pun-viewtopic' && GroupID != 3)
$(function (){ // Предупреждение, что после просмотра результатов опроса - проголосовать в нём уже нельзя.
var arr = document.getElementsByTagName('input'), i=0;
while(i<20){if(arr[i].name=='null'){arr[i].onclick = IsShow; break;}i++}
});
function IsShow(){return confirm('Вы действительно хотите посмотреть результаты опроса?\nЕсли Вы это сделаете, то не сможете в нём проголосовать.');}

if(MessageHotkey == 1  && (/^(pun-post|pun-poll|pun-edit|pun-viewtopic|pun-messages)$/.test(lf_page_id))) // Отправка сообщений нажатием Enter+Ctrl
$(function (){ 
document.onkeydown=function(e){
if (e) event=e;
if ((event.keyCode==13)&&(event.ctrlKey)){
document.getElementById('post').submit.click();}}
});

if(NoticeNewMessage >= 1 && lf_page_id != 'pun-messages' && GroupID != 3)
$(function (){
window.setTimeout('AjaxFindNewPM()', 5000);
timer=setInterval('AjaxFindNewPM()', 180000);
});

if(ExitSession == 1)
$(function (){
window.setTimeout('AlertExitSession();', 3540000);
});

/*
$(function (){ 
});
*/

$.get(lf_page_url);
});}