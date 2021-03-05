function GetXmlHttpObject()
{
  var xmlHttp=null;
  try
    {
    // Firefox, Opera 8.0+, Safari
    xmlHttp=new XMLHttpRequest();
    }
  catch (e)
    {
    // Internet Explorer
      try
      {
      	  xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");		  
      }
    catch (e)
      {
      xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
  return xmlHttp;
}
function get_specific(id,beta,APPURL)
{
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	beta=document.getElementById("working_id").value
	var url="ajax/get_specific_listing.php";
	url=url+"?beta="+beta+"&id="+id;	
	url=url+"&sid="+Math.random();
	xmlHttp.onreadystatechange=show_specific;
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}
function show_specific()
{
  if (xmlHttp.readyState==4)
  {		
	var html=xmlHttp.responseText;
	//alert(html);
	eval(html);
 }
}
function get_level(sessid,APPURL)
{
	var sess_id=sessid;
	if (sess_id=='')
	{
		return false;
	}
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"ajax/getlevel.php"
	var url="ajax/getlevel.php"	
	url=url+"?sessid="+sess_id
	url=url+"&sid="+Math.random()
	//alert(url);
	xmlHttp.onreadystatechange=populate_level
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}

function populate_level()
{
  if (xmlHttp.readyState==4)
  {
  var obj_level			=document.getElementById("level");
  var txtRoot			=document.getElementById("txtRoot");
  var levelwordbank		=document.getElementById("levelwordbank");
  var level_description	=document.getElementById("level_description");
  //alert(xmlHttp.responseText);
  eval(xmlHttp.responseText);
 }
}

function get_wordbank(levelid,APPURL)
{
	var level_id=levelid;
	if (level_id=='')
	{
		return false;
	}
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"/ajax/get_wordbank.php"
	var url="ajax/get_wordbank.php";	
	url=url+"?levelid="+level_id
	url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=populate_wb
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}

function get_wordbanktest(testid,APPURL)
{
	var test_prep_id=testid;
	if (test_prep_id=='')
	{
		return false;
	}
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"/ajax/get_wordbanktest.php"
	var url="ajax/get_wordbanktest.php"
	url=url+"?test_prep_id="+test_prep_id
	url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=populate_wb_test
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}
function populate_wb_test()
{
  if (xmlHttp.readyState==4)
  {
  var levelwordbank		=document.getElementById("levelwordbank");
  eval(xmlHttp.responseText);
 }
}

function get_wordbanktheme(testid,APPURL)
{
	var test_prep_id=testid;
	if (test_prep_id=='')
	{
		return false;
	}
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"/ajax/get_wordbanktheme.php"
	var url="ajax/get_wordbanktheme.php"
	url=url+"?theme_id="+test_prep_id
	url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=populate_wb_theme
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}
function populate_wb_theme()
{
  if (xmlHttp.readyState==4)
  {
  var levelwordbank		=document.getElementById("levelwordbank");
  eval(xmlHttp.responseText);
 }
}


function populate_wb()
{
  if (xmlHttp.readyState==4)
  {
  var levelwordbank		=document.getElementById("levelwordbank");
  var level_description	=document.getElementById("level_description");
//  alert(xmlHttp.responseText);
  eval(xmlHttp.responseText);
 }
}

function add_inputbox(num,APPURL)
{
	if (num=='')
	{
		return false;
	}
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"/ajax/word_inputboxes.php"
	var url="ajax/word_inputboxes.php"
	url=url+"?num="+num
	url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=populate_inputboxes
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}

function populate_inputboxes()
{
  if (xmlHttp.readyState==4)
  {
  var word_inputboxes		=document.getElementById("word_inputboxes");
  eval(xmlHttp.responseText);
 }
}
function set_level_test(testid,APPURL)
{
	var test_prep_id=testid;
	if (test_prep_id=='')
	{
		return false;
	}
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"/ajax/set_level_test.php"
	var url="ajax/set_level_test.php"	
	url=url+"?sessid="+sess_id
	url=url+"&test_prep_id="+test_prep_id
	url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=populate_page_test
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}
function populate_page_test()
{
  if (xmlHttp.readyState==4)
  {
  var levelwordbank		=document.getElementById("levelwordbank");
  eval(xmlHttp.responseText);
 }
}

function set_level(sessid,levelid,APPURL)
{
	var sess_id=sessid;
	var level_id=levelid;
	if (sess_id=='')
	{
		return false;
	}

	if (level_id=='')
	{
		return false;
	}
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"ajax/set_level.php"
	var url="ajax/set_level.php"	
	url=url+"?sessid="+sess_id
	url=url+"&levelid="+level_id
	url=url+"&sid="+Math.random()
	xmlHttp.onreadystatechange=populate_page
	xmlHttp.open("GET",url,true)
	xmlHttp.send(null)
}

function populate_page()
{
  if (xmlHttp.readyState==4)
  {
  var obj_level			=document.getElementById("level");
  var txtRoot			=document.getElementById("txtRoot");
  var levelwordbank		=document.getElementById("levelwordbank");
  var level_description	=document.getElementById("level_description");
//  alert(xmlHttp.responseText);
  eval(xmlHttp.responseText);

 }
}
//var alpha;
/// Not in use 24 - september -2007
function get_crossword(alpha,APPURL)
{
	xmlHttp=GetXmlHttpObject()
	if (xmlHttp==null)
	  {
	  alert ("Browser does not support HTTP Request")
	  return
	  }
//	var url=APPURL+"ajax/get_crossword_details.php";
	var url="ajax/get_crossword_details.php";	
	url=url+"?alpha="+alpha;
	url=url+"&sid="+Math.random();
	xmlHttp.onreadystatechange=crossword_details;
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}
function crossword_details()
{
  if (xmlHttp.readyState==4)
  {		
	var html=xmlHttp.responseText;
	//alert(html);
	eval(html);

 }
}
//////// Not Use End/////////
function hide(alpha)
{
	document.getElementById("showbook_"+alpha).style.display='none';
}
function showBook(alpha)
{
	document.getElementById("showbook_"+alpha).style.display='';
}
function selection(id,val)
{
	var selects;
	if(id=='test')
	{
		selects=document.getElementById('test_prep_id');
	}
	else if(id=='theme')	
	{
		selects=document.getElementById('theme_id');
	}
	else if(id=='lessons')	
	{
		selects=document.getElementById('level');
	}	
	var opt,i=0;
	while(opt=selects.options[i++])
	{
		if(opt.value==val)
		{
			opt.selected=true;
		}	
	}
}