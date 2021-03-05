function get_url_vars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function remove_siblings(element) {
    element.siblings('*:not(.content, script, head)').remove();
}

function remove_footer_from_content(content) {
    content.children('#footer').remove();
}

function remove_all_except_content(content) {
    remove_siblings(content);
    if(content.parent('*:not(html, head)').length!=0) {
        remove_all_except_content(content.parent());
    }
}

function make_into_edmodo_app(launch_key) {
    content = $('.content');
    remove_footer_from_content(content);
    remove_all_except_content(content);
    $("form").attr("action", $("form").attr("action") + "&launch_key="+launch_key);
}


function edmodo_launch_track() {
    vars = get_url_vars();
    current_url = location.protocol + '//' + location.host + location.pathname;
    launch_key = vars["launch_key"];
    post_url = "https://myvocabulary.com/edmodo_track.php?url="+current_url+"&launch_key="+launch_key;
    $.post(post_url, function(data) {
        //console.log("posted to: " + post_url);
    });
}

$(window).load(function(){
    vars = get_url_vars();
    launch_key = vars["launch_key"];
    if (launch_key) {
        make_into_edmodo_app(launch_key);
        edmodo_launch_track();
    }
});
