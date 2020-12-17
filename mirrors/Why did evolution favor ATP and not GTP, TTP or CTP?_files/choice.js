'use strict';(function(){(function(){var cmpScriptElement=document.createElement('script');var firstScript=document.getElementsByTagName('script')[0];cmpScriptElement.async=true;cmpScriptElement.type='text/javascript';var cmpVersion='https://quantcast.mgr.consensu.org/tcfv2/23/cmp2.js';cmpScriptElement.src=cmpVersion;firstScript.parentNode.insertBefore(cmpScriptElement,firstScript);})();(function(){var css=""
+" .qc-cmp-button { "
+"   background-color: #0080ff !important; "
+"   border-color: #0080ff !important; "
+" } "
+" .qc-cmp-button:hover { "
+"   border-color: #0080ff !important; "
+" } "
+" .qc-cmp-alt-action, "
+" .qc-cmp-link { "
+"   color: #0080ff !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button:hover { "
+"   background-color: #0080ff !important; "
+"   border-color: #0080ff !important; "
+" } "
+" .qc-cmp-button { "
+"   color: #FFFFFF !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button:hover { "
+"   color: #FFFFFF !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button { "
+"   color: #FFFFFF !important; "
+" } "
+" .qc-cmp-button.qc-cmp-secondary-button { "
+"   background-color: #555 !important; "
+"   border-color: transparent !important; "
+" } "
+" .qc-cmp-ui, "
+" .qc-cmp-ui .qc-cmp-title, "
+" .qc-cmp-ui .qc-cmp-table, "
+" .qc-cmp-ui .qc-cmp-messaging, "
+" .qc-cmp-ui .qc-cmp-sub-title, "
+" .qc-cmp-ui .qc-cmp-vendor-list, "
+" .qc-cmp-ui .qc-cmp-purpose-info, "
+" .qc-cmp-ui .qc-cmp-table-header, "
+" .qc-cmp-ui .qc-cmp-beta-messaging, "
+" .qc-cmp-ui .qc-cmp-main-messaging, "
+" .qc-cmp-ui .qc-cmp-vendor-list-title{ "
+"   color: #111 !important; "
+" } "
+" .qc-cmp-ui a, "
+" .qc-cmp-ui .qc-cmp-alt-action { "
+"   color: #0080ff !important; "
+" } "
+".qc-cmp2-container > *,.qc-cmp2-container p,.qc-cmp2-container button,.qc-cmp2-container h1,.qc-cmp2-container h2,.qc-cmp2-container h3 { font-family: \"Roboto\",Arial,sans-serif!important;}.qc-cmp2-footer { max-height: 100% !important;}.qc-cmp2-summary-buttons { justify-content: center !important;}.qc-cmp2-footer { max-height: 100%;}.qc-cmp2-summary-buttons { justify-content: center;}.qc-cmp2-container h2 { font-weight: 700!important; font-size: 14px!important;}.qc-cmp2-container p { font-weight: 400!important; font-size: 14px!important; line-height: 1.3!important;}@media screen and (min-width: 992px) { .qc-cmp2-container p { font-size: 14px!important; } .qc-cmp2-container h2 { font-size: 22px!important; }}.qc-cmp2-container button[mode=secondary] { border: 1px solid #0080FF!important; color: #0080FF!important; background-color: #FFF!important;}.qc-cmp2-container button[mode=secondary]:hover { color: #FFF!important; background-color: #0080FF!important;}.qc-cmp2-container button[mode=primary] { border: 1px solid #0080FF!important;}.qc-cmp2-container button[mode=primary]:hover { color: #FFF!important; background-color: #034AA6!important; border: 1px solid #034AA6!important;}.qc-cmp2-container button[mode=secondary]:hover { color: #FFF!important; background-color: #0080FF!important;}.qc-cmp2-container button[mode=link]:hover { text-decoration: underline;}.qc-cmp2-summary-buttons { padding-right: 2px!important;}.qc-cmp2-toggle[aria-checked=true] { border-color: #0080FF!important; background: #0080FF!important;}"
+""
+"";var stylesElement=document.createElement('style');var re=new RegExp('&quote;','g');css=css.replace(re,'"');stylesElement.type='text/css';if(stylesElement.styleSheet){stylesElement.styleSheet.cssText=css;}else{stylesElement.appendChild(document.createTextNode(css));}
var head=document.head||document.getElementsByTagName('head')[0];head.appendChild(stylesElement);})();var autoDetectedLanguage='en';function splitLang(lang){return lang.length>2?lang.split('-')[0]:lang;};function isSupported(lang){var langs=['en','fr','de','it','es','da','nl','el','hu','pt','ro','fi','pl','sk','sv','no','ru','bg','ca','cs','et','hr','lt','lv','mt','sl','tr','zh'];return langs.indexOf(lang)===-1?false:true;};if(isSupported(splitLang(document.documentElement.lang))){autoDetectedLanguage=splitLang(document.documentElement.lang);}else if(isSupported(splitLang(navigator.language))){autoDetectedLanguage=splitLang(navigator.language);};var choiceMilliSeconds=(new Date).getTime();window.__tcfapi('init',2,function(){},{'premiumProperties':{'nonIabVendorListUrl':'https://quantcast.mgr.consensu.org/choice/AaqDBHcavs6a0/www.researchgate.net/.well-known/noniab-vendorlist.json',},'premiumUiLabels':{'initScreenCustomLinks':[{label:'Please refer to our Privacy Policy. ',link:'https://www.researchgate.net/privacy-policy'}]},'coreUiLabels':{},'theme':{'uxPrimaryButtonColor':'#0080ff','uxSecondaryButtonColor':'#555','uxPrimaryButtonTextColor':'#FFFFFF','uxSecondaryButtonTextColor':'#FFFFFF','uxLinkColor':'#0080ff','uxFontColor':'#111',},'coreConfig':{'quantcastAccountId':'AaqDBHcavs6a0','privacyMode':["GDPR"],'hashCode':'masj86br8fU43ukN6bulCQ','publisherCountryCode':'DE','publisherName':'ResearchGate','vendorPurposeIds':[1,2,3,4,5,6,7,8,9,10],'vendorFeaturesIds':[1,2,3],'vendorPurposeLegitimateInterestIds':[2,3,4,5,6,7,8,9,10],'vendorSpecialFeaturesIds':[1,2],'vendorSpecialPurposesIds':[1,2],'googleEnabled':true,'consentScope':'service group','consentScopeGroupURL':'https://www.researchgate.net/html/cookieConsent3.html','thirdPartyStorageType':'iframe','consentIdentityEnabled':false,'initScreenBodyTextOption':1,'consentOnSafari':false,'lang_':'en','displayUi':'inEU','defaultToggleValue':'off','initScreenRejectButtonShowing':false,'publisherConsentRestrictionIds':[],'publisherLIRestrictionIds':[],'softOptInEnabled':false,'showSummaryView':true,'persistentConsentLinkLocation':3,'displayPersistentConsentLink':false,'uiLayout':'banner','publisherPurposeIds':[],'publisherPurposeLegitimateInterestIds':[],'publisherSpecialPurposesIds':[],'publisherFeaturesIds':[],'publisherSpecialFeaturesIds':[],'stacks':[1,42],'vendorListUpdateFreq':30,},'nonIabVendorsInfo':{"nonIabVendorList":[{"vendorId":6,"pCode":"AaqDBHcavs6a0","name":"Twitter","description":"Allow twitter and their technology partners to collect data and use cookies for ad personalisation and measurement.","privacyPolicyUrl":"https://help.twitter.com/rules-and-policies/twitter-cookies","nonIabPurposeConsentIds":[1,2,3,4,5,6,7,8,9,10],"nonIabPurposeLegitimateInterestIds":[]},{"vendorId":7,"pCode":"AaqDBHcavs6a0","name":"Google Analytics","privacyPolicyUrl":"https://policies.google.com/privacy","nonIabPurposeConsentIds":[1,2,3,4,5,6,7,8,9,10],"nonIabPurposeLegitimateInterestIds":[]}],"updateAt":"2020-12-09T14:11:42.542570Z","nonIabVendorsHash":"BA6A90E4ADC1D41474B6DD8F131CE71A"}});})();