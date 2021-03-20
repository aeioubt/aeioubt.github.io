// if (typeof(var) == "undefined") { ... }
if (typeof(UserLogin) != "undefined") { if(UserLogin=="йцукен123456") window.location.href = "http://liveforums.ru/"}

$(document).ready(function(){
  var forums_bl = new Array ("belogolovik.liveforums.ru", "dirtymoney.liveforums.ru");
  for (var i=0; i<forums_bl.length; i++){
    if(document.URL.indexOf(forums_bl[i])!=-1){
      if(document.URL.indexOf('/admin')==-1) {
        if(document.URL.indexOf('/login.php')==-1) {
          $('#pun-main').remove();
          $('#html-header, #pun-announcement, #html-footer').remove();
          alert(decodeURIComponent('%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20%D0%B7%D0%B0%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%20%D0%B7%D0%B0%20%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%20%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%B0.%0A%D0%95%D1%81%D0%BB%D0%B8%20%D0%B2%D1%8B%20%D1%8F%D0%B2%D0%BB%D1%8F%D0%B5%D1%82%D0%B5%D1%81%D1%8C%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%BC%20%D1%8D%D1%82%D0%BE%D0%B3%D0%BE%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%2C%20%D0%BF%D1%80%D0%BE%D1%81%D1%8C%D0%B1%D0%B0%20%D0%BD%D0%B5%D0%B7%D0%B0%D0%BC%D0%B5%D0%B4%D0%BB%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D0%B8%D1%82%D1%8C%D1%81%D1%8F%20%D0%BD%D0%B0%20http%3A%2F%2Fsupport.liveforums.ru%2F'));
  }}}}      
});