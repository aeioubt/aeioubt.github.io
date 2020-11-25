
window.addEventListener('DOMContentLoaded', () => {

    // ============== Селектор элемента, за которым появится виджет - #header
    var prevElement = document.getElementById("header");
    // ============== Селектор ссылки на skidki.academic.ru - #skidki
    var skidkiLinkElement = document.getElementById("skidki");

    // ============== HTML код виджета
        var hintHtml = '<style>' +
            '.hint-holder {width:100%; padding: 0 0 20px; transition: .3s; overflow: hidden;}' +
            '.hint {background: #FFFBF0; position: relative; border-top: 4px solid #FEE79F; margin: 20px 0 0; padding: 10px 50px 0px 30px;}' +
            '.hint-holder a {color: #65AF40;!important; text-decoration: underline;}' +
            '.hint-holder p {margin: 0;!important;}' +
            '.htitle {margin-left: 30px; font-size: 22px; color: #333;}' +
            '#hint-arrow {width: 20px; height: 20px; position: absolute;}' +
            '#hint-arrow .arrow {position: relative; width: 20px; height: 20px;}' +
            '#hint-arrow .arrow:after, #hint-arrow .arrow:before {bottom: 0; left: 0; border: solid transparent; content: " "; height: 0; width: 0; position: absolute; pointer-events: none;}' +
            '#hint-arrow .arrow:after {border-color: rgba(136, 183, 213, 0); border-bottom-color: #FEE79F; border-width: 20px;}' +
            '.hint-ul {line-height: 16px; padding: 0 0 0 16px; list-style-type: disc;}' +
            '.hint-logo {margin: 0; display: flex; align-items: center;}' +
            '.close-btn {position: absolute; color: #666; top: 6px; right: 10px; transform: rotate(45deg); font-size: 34px; cursor: pointer;}' +
            '.close-btn:hover {color: #000; transition: .3s;}' +
            '.bold {font-weight: bold; margin: 14px 0; font-size: 15px; color: #333;}' +
            '.mt20 {margin-top: 20px;}' +
            '.hcontent {display: flex;}' +
            '.hcontent .left {width: 45%; padding: 0 10px 0 0;}' +
            '.hcontent .right {width: 55%;}' +
            '.hint-invisibleblock {display: none;}' +
            '.hint-invisibleblock-holder {padding: 0;' +
            'transition:height 1s ease-out;' +
                'height:0;' +
                'overflow:hidden;' +
            '}' +
            '.hint-invisibleblock-holder .hint-ul {padding: 6px 14px 0 20px;}' +
            '.hread-more {color: #4D71F1; margin: 4px 0 0 0; text-decoration: underline;}' +
            '@media (max-width: 700px) {' +
            '.hint-invisibleblock {display: block;}' +
            '.hint {padding: 10px 30px 10px 14px;}' +
            '.hint:after, .hint:before {left: 50%;}' +
            '.hcontent .left {width: 100%;}' +
            '.right {display: none;}' +
            '.hint-logo {display: none;}' +
            '.hint-logo {flex-direction: column; align-items: start;}' +
            '.htitle {margin: 14px 0 10px 0;}' +
            '}' +
            '</style>' +
            '<div id="hint-arrow"><div class="arrow"></div></div>' +
            '<div id="skidki_hint" class="hint-holder">' +
            '<div class="hint">' +
            '<div id="closebtn" class="close-btn">+</div>' +
                '<div class="hcontent">' +
                    '<div class="left">' +
                        '<div class="hint-logo">' +
                            '<a href="https://skidki.academic.ru/ru" target="_blank" title="Скидки и промокоды на Академике">' +
                                '<img src="https://skidki.academic.ru/images/akademic_logo_dark.svg" alt="Скидки и промокоды на Академике" style="width: 206px; height: 29px;">' +
                            '</a>' +
                        '</div>' +
                    '<p>Мы разработали для вас новый сервис!</p>' +
                    '<p>' +
                        '<strong>Пользуясь <a href="https://skidki.academic.ru/ru" target="_blank">Скидки.Академик.ру</a>, вы поддерживаете Академик.ру!</strong></p>' +
                '</div>' +
                '<div class="right">' +
                    '<p><strong>💡 Что это такое?</strong></p>' +
                    '<p>' +
                        '<ul class="hint-ul">' +
                            '<li>это бесплатные промокоды на скидку в более чем 800 магазинах</li>' +
                            '<li>это более 400.000 товаров со скидками до 95%</li>' +
                            '<li>это эксклюзивные промо-акции</li>' +
                        '</ul>' +
                    '</p>' +
                '</div>' +
            '</div>' +
            '<div class="hint-invisibleblock">' +
            '<div id="hreadmore" class="hread-more">Читать больше</div>' +
                '<div id="invtext" class="hint-invisibleblock-holder">' +
                    '<p><strong>💡 Что это такое?</strong></p>' +
                    '<p>' +
                        '<ul class="hint-ul">' +
                            '<li>это бесплатные промокоды на скидку в более чем 800 магазинах</li>' +
                            '<li>это более 400.000 товаров со скидками до 95%</li>' +
                            '<li>это эксклюзивные промо-акции</li>' +
                            '<li>без регистрации</li>' +
                        '</ul>' +
                    '</p>' +
                '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

    var divElement = document.createElement("div");
    divElement.innerHTML = hintHtml;
    insertAfter(divElement, prevElement);

    var linkRelativeParent = document.getElementById('page');
    var divOffset = relativeOffset(skidkiLinkElement, linkRelativeParent);

    var linkContainer = document.getElementById('hint-arrow');
    var linkContainerTopMargin = offset(document.getElementsByClassName('hint')[0]).top - offset(skidkiLinkElement).top - skidkiLinkElement.clientHeight + 4;
    var linkContainerLeftMargin = (skidkiLinkElement.clientWidth/2) - linkContainer.clientWidth;

    linkContainer.style = 'left:' + (divOffset.left + linkContainerLeftMargin) + 'px; top:' + (divOffset.top + linkContainerTopMargin) + 'px;';

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);        
    }

    function live(eventType, elementId, cb) {
        document.addEventListener(eventType, event => {
            if (event.target.id === elementId) {
                cb.call(event.target, event);
            }
        });
    }

    function offset(el) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    function relativeOffset(el, parent) {
        var rect = el.getBoundingClientRect();
        var parentRect = parent.getBoundingClientRect();
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        return { top: rect.top + (scrollTop), left: rect.left + (scrollLeft - parentRect.left) }
    }

    live("click", "closebtn", event => {        
        var closebtn = document.getElementById('skidki_hint');
        closebtn.parentNode.removeChild(closebtn);
    });

    live("click", "hreadmore", event => {
        var invisibletext = document.getElementById("invtext");
        var readmorebtn = document.getElementById("hreadmore");
        invisibletext.style.cssText = "padding: 14px 0 0 0;"; 
        invisibletext.style.height = 150 + 'px';
        readmorebtn.parentNode.removeChild(readmorebtn);
    });
});