var firstUnitCalled = !1;
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://powerad.ai/pub', !0);
xhr.setRequestHeader('hostName', window.location.host);
xhr.send();
timeouts = {}, plInfo = {}, delayInject = {}, pbs = {},creativeChanged = {};
xhr.onreadystatechange = function() {
  if (this.status == 200 && this.readyState == 4) {
    var placements = JSON.parse(this.response);
    if (placements.error) {
      console.warn('error with pa units')
      return
    }
    for (let i in placements) {
      plInfo[placements[i].placementIndex] = placements[i];
      plInfo[placements[i].placementIndex].called = !1
    }
    for (let i in placements) {
      placements[i].state && placements[i].state != 'passback' || !placements[i].state ? checkOnPlacement(placements[i]) : !placements[i].state ? console.warn('placement: ' + placements[i].placementIndex + ' database schema is deprecated') : {}
    }
    xhr.abort()
  }
};
var screenType = function() {
  if (window.innerWidth <= 600) {
    return 'mobile'
  } else if (window.innerWidth > 600 && window.innerWidth <= 767) {
    return 'tablet'
  } else if (window.innerWidth > 767) {
    return 'desktop'
  }
}

function devicePass(placement) {
  if (screenType() == 'mobile') {
    if (placement.device.mobile) {
      return !0
    } else {
      return !1
    }
  } else if (screenType() == 'tablet') {
    if (placement.device.tablet) {
      return !0
    } else {
      return !1
    }
  } else if (screenType() == 'desktop') {
    if (placement.device.desktop) {
      return !0
    } else {
      return !1
    }
  }
}

function includeUrlRules(placement) {
  if (placement.rules.urlRules.include[0]) {
    for (a = 0; a < placement.rules.urlRules.include.length; a++) {
      if (window.location.href.toLowerCase().indexOf(placement.rules.urlRules.include[a].toLowerCase()) != -1) {
        return !0
      }
    }
    return !1
  } else {
    return !0
  }
}

function excludeUrlRules(placement) {
  if (placement.rules.urlRules.exclude[0]) {
    for (a = 0; a < placement.rules.urlRules.exclude.length; a++) {
      if (window.location.href.toLowerCase().indexOf(placement.rules.urlRules.exclude[a].toLowerCase()) != -1) {
        return !1
      }
    }
    return !0
  } else {
    return !0
  }
}

function includeDirUrl(placement) {
  if (placement.rules.urlRules.dir) {
    if (placement.rules.urlRules.dir.include[0]) {
      for (a = 0; a < placement.rules.urlRules.dir.include.length; a++) {
        var searchString = placement.rules.urlRules.dir.include[a]
        if (location.href.indexOf(searchString) != -1) {
          if (location.href.length > location.href.indexOf(searchString) + searchString.length) {
            return !0
          } else {
            return !1
          }
        } else {
          return !1
        }
      }
      return !1
    } else {
      return !0
    }
  } else {
    return !0
  }
}

function excludeDirUrl(placement) {
  if (placement.rules.urlRules.dir) {
    if (placement.rules.urlRules.dir.exclude[0]) {
      for (a = 0; a < placement.rules.urlRules.dir.exclude.length; a++) {
        for (a = 0; a < placement.rules.urlRules.dir.exclude.length; a++) {
          var searchString = placement.rules.urlRules.dir.exclude[a]
          if (location.href.indexOf(searchString) != -1) {
            if (location.href.length == location.href.indexOf(searchString) + searchString.length) {
              return !0
            } else {
              return !1
            }
          } else {
            return !1
          }
        }
        return !1
      }
      return !0
    } else {
      return !0
    }
  } else {
    return !0
  }
}

function capPerUserPerDay(placement) {
  var placementIndex = placement.placementIndex
  if (placement.caps) {
    if (placement.caps.userDay != '') {
      if (localStorage.getItem(`${placementIndex}capUserDay`)) {
        var storageCapInfo = JSON.parse(localStorage.getItem(`${placementIndex}capUserDay`))
        if (new Date().getTime() - (storageCapInfo.timeStamp + (60 * 60 * 24 * 1000)) < 0) {
          if (storageCapInfo.number < placement.caps.userDay) {
            var updateStorageCapInfo = {
              number: storageCapInfo.number + 1,
              timeStamp: storageCapInfo.timeStamp
            }
            localStorage.setItem(`${placementIndex}capUserDay`, JSON.stringify(updateStorageCapInfo))
            return !0
          } else {
            return !1
          }
        } else {
          var storageCapInfo = {
            number: 1,
            timeStamp: new Date().getTime()
          }
          localStorage.setItem(`${placementIndex}capUserDay`, JSON.stringify(storageCapInfo))
          return !0
        }
      } else {
        var storageCapInfo = {
          number: 1,
          timeStamp: new Date().getTime()
        }
        localStorage.setItem(`${placementIndex}capUserDay`, JSON.stringify(storageCapInfo))
        return !0
      }
    } else {
      if (localStorage.getItem(`${placementIndex}capUserDay`)) {
        localStorage.removeItem(`${placementIndex}capUserDay`)
      }
      return !0
    }
  } else {
    return !0
  }
}

function capPerUserLife(placement) {
  var placementIndex = placement.placementIndex
  if (placement.caps) {
    if (placement.caps.userLife != '') {
      if (localStorage.getItem(placementIndex + 'capUserLife')) {
        var storageCapInfo = JSON.parse(localStorage.getItem(placementIndex + 'capUserLife'))
        if (storageCapInfo.number < placement.caps.userLife) {
          var updateStorageCapInfo = {
            number: storageCapInfo.number + 1,
          }
          localStorage.setItem(placementIndex + 'capUserLife', JSON.stringify(updateStorageCapInfo))
          return !0
        } else {
          return !1
        }
      } else {
        var storageCapInfo = {
          number: 1,
        }
        localStorage.setItem(placementIndex + 'capUserLife', JSON.stringify(storageCapInfo))
        return !0
      }
    } else {
      if (localStorage.getItem(placementIndex + 'capUserLife')) {
        localStorage.removeItem(placementIndex + 'capUserLife')
      }
      return !0
    }
  } else {
    return !0
  }
}
function pubUrlRules(pl){
  var url = window.location.href
  function urlToArray(url){
    if(url.indexOf('?') != -1){
      url = url.slice(0,url.indexOf('?'))
    }
    if(url.indexOf('//') != -1){
      url = url.slice(url.indexOf('//')+2,url.length)
    }
    url = url.split('/')
    if(url.indexOf('') != -1){
      // url = url.split(url.indexOf(''),1)
      url = url.splice(url.indexOf(''),1)
    }
    return url
  }
  function dirRuleToPath(rule){
    rule = rule.split('/')
    if(rule.indexOf('') != -1){
      // rule = rule.split(rule.indexOf(''),1)
      rule = rule.splice(rule.indexOf(''),1)
    }
    return rule
  }
  if(!pl.pubUrlRules){
    return true
  }
  function checkKey(rules){
    function checkInc(rules){
      if(!rules[0]){
        return true
      }
      for(let rule of rules){
        if(url.indexOf(rule) != -1){
          return true
        }
      }
      return false
    }
    function checkExc(rules){
      if(!rules[0]){
        return true
      }
      for(let rule of rules){
        if(url.indexOf(rule) != -1){
          return false
        }
      }
      return true
    }
    if(checkInc(rules.inc) && checkExc(rules.exc)){
      return true
    } else { 
      return false
    }
  }
  function checkDir(rules){
    var path = urlToArray(url)
    function checkInc(rules){
      if(!rules[0]){
        return true
      }
      for(let rule of rules){
        if(rule.indexOf('/') != -1){
          ruleArray = dirRuleToPath(rule)
          var startingPoint;
          var completeArrayMatch;
          if(path.indexOf(ruleArray[0]) != -1){
            startingPoint = path.indexOf(ruleArray[0])
            for(let i =0;i<ruleArray.length;i++){
              if(path[startingPoint+i] == ruleArray[i]){
                completeArrayMatch = true
              } else {
                completeArrayMatch = false
                break;
              }
            }
            if(completeArrayMatch){
              return true
            }
          }
          
        } else {
          if(path.indexOf(rule) != -1){
            return true
          }
        }
      }
      return false
    }
    function checkExc(rules){
      if(!rules[0]){
        return true
      }
      for(let rule of rules){
        if(rule.indexOf('/') != -1){
          ruleArray = dirRuleToPath(rule)
          var startingPoint;
          var completeArrayMatch;
          if(path.indexOf(ruleArray[0]) != -1){
            startingPoint = path.indexOf(ruleArray[0])
            for(let i =0;i<ruleArray.length;i++){
              if(path[startingPoint+i] == ruleArray[i]){
                completeArrayMatch = true
              } else {
                completeArrayMatch = false
                break;
              }
            }
            if(completeArrayMatch){
              return false
            }
          }
        } else {
          if(path.indexOf(rule) != -1){
            return false
          }
        }
      }
      return true
    }
    if(checkInc(rules.inc) && checkExc(rules.exc)){
      return true
    } else { 
      return false
    }
  }
  if(checkKey(pl.pubUrlRules.key) && checkDir(pl.pubUrlRules.dir)){
    return true
  } else {
    return false
  }
}

function checkOnPlacement(placement) {
  if (!firstUnitCalled) {
    firstUnitCalled = !0;
    console.log('time till inject: ' + (new Date().getTime() - startTimeStamp));
  }
  if (plInfo[placement.placementIndex].called) {
    return
  }
  plInfo[placement.placementIndex].called = !0;
  if ((!placement.state && placement.active)||(placement.state=='active')||(placement.state=='passback')) {
    if (placement.type == 'adhesion' && placement.adhesionParams.passback) {
      if ((window.innerWidth < placement.contentWidth + (placement.styles.width * 2)) || (window.innerHeight < placement.styles.height) || (placement.footStopSide ? (document.querySelector(placement.footStopSide).getBoundingClientRect().top) - (document.querySelector(placement.headStopSide).getBoundingClientRect().height + document.querySelector(placement.headStopSide).getBoundingClientRect().top) < placement.styles.height : window.innerHeight < placement.styles.height)) {
        plInfo[placement.adhesionParams.passback] ? checkOnPlacement(plInfo[placement.adhesionParams.passback]) : console.warn('can\'t passback from placement: ' + placement.placementIndex + ' to placement: ' + placement.adhesionParams.passback + ', \nthe passback placement was not found')
        return
      }
    }
    if (placement.timeouts.inject) {
      if (!delayInject[placement.placementIndex]) {
        delayInject[placement.placementIndex] = {
          waitFinished: !1,
          time: placement.timeouts.inject,
          timeout: setTimeout(() => {
            checkOnPlacement(placement)
          }, placement.timeouts.inject)
        }
        plInfo[placement.placementIndex].called = !1
        return
      } else {
        delayInject[placement.placementIndex].waitFinished = !0
      }
    }
    if (devicePass(placement)) {
      if(pubUrlRules(placement)){
        if (includeUrlRules(placement)) {
          if (excludeUrlRules(placement)) {
            if (includeDirUrl(placement)) {
              if (excludeDirUrl(placement)) {
                if (capPerUserPerDay(placement)) {
                  if (capPerUserLife(placement)) {
                    switch (placement.type) {
                      case 'multiInsert':
                        injectMulti(placement);
                        break;
                      case 'stickyBottom':
                        injectStickyBottom(placement);
                        break;
                      case 'stickyTop':
                        injectStickyTop(placement);
                        break;
                      case 'adhesion':
                        injectAdhesion(placement);
                        break;
                      case 'interstitial':
                        injectInterstitial(placement)
                        break;
                      case 'video':
                        injectVideo(placement);
                        break
                    }
                  }
                }
              } else {}
            } else {}
          } else {}
        } else {}
      } else {}
    } else {}
  } else {}
}

function getScroll() {
  return window.scrollY || document.body.scrollTop
};

function compileTag(placementNumber, a) {
  if (plInfo[placementNumber].demandType == 'live') {
    switch (plInfo[placementNumber].liveDemand[a].partner) {
      case 'google':
        return `
<html><head>
${plInfo[placementNumber].liveDemand[a].adLight ? '<script src="https://tagan.adlightning.com/nextmillenium/op.js"></script>' : ''}
<script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script>
<script>var googletag = googletag || {};googletag.cmd = googletag.cmd || [];googletag.cmd.push(function() {googletag.defineSlot('/90814396/${plInfo[placementNumber].liveDemand[a].unitName}', [${plInfo[placementNumber].styles.width}, ${plInfo[placementNumber].styles.height}], 'inject-google-slot-id-${a}').addService(googletag.pubads());googletag.pubads().enableSingleRequest();googletag.enableServices();});
var impression = new Event('impression');var noImpression = new Event('noImpression');
googletag.cmd.push(function(){googletag.pubads().addEventListener('slotRenderEnded',function(info){if(info.isEmpty==!1){
document.dispatchEvent(impression);
console.log('impression');
}else if(info.isEmpty==!0){
document.dispatchEvent(noImpression);
console.log('no impression');
}})})</script>
</head><body><div id='inject-google-slot-id-${a}'><script>googletag.cmd.push(function() { googletag.display('inject-google-slot-id-${a}'); });
</script></div></body></html>`
        break;
      case 'amazon':
        return `<html><head>${plInfo[placementNumber].liveDemand[a].adLight ? '<script src="https://tagan.adlightning.com/nextmillenium/op.js"></script>' : ''}<script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script><script>var googletag=googletag||{};googletag.cmd=googletag.cmd||[];googletag.cmd.push(function(){googletag.defineSlot('/90814396/${plInfo[placementNumber].liveDemand[a].unitName}',[[${plInfo[placementNumber].styles.width},${plInfo[placementNumber].styles.height}]],'inject-amazon-slot-id-${a}').addService(googletag.pubads());googletag.pubads().disableInitialLoad();googletag.pubads().enableSingleRequest();googletag.enableServices()});</script><script type='text/javascript'>!function(a9,a,p,s,t,A,g){if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function(){q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},targetingKeys:function(){return[]},_Q:[]};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)}("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");apstag.init({pubID:'79e40b05-e673-4b6c-85f9-79252a7f96a5',adServer:'googletag',bidTimeout:2e3});apstag.fetchBids({slots:[{slotID:'inject-amazon-slot-id-${a}',slotName:'/90814396/${plInfo[placementNumber].liveDemand[a].unitName}',sizes:[${plInfo[placementNumber].styles.width},${plInfo[placementNumber].styles.height}]}]},function(bids){googletag.cmd.push(function(){apstag.setDisplayBids();googletag.pubads().refresh()})});var impression=new Event('impression')
var noImpression=new Event('noImpression');
googletag.cmd.push(function(){googletag.pubads().addEventListener('slotRenderEnded',function(info){if(info.isEmpty==!1){
document.dispatchEvent(impression)
console.log('impression')
}else if(info.isEmpty==!0){
document.dispatchEvent(noImpression)
console.log('no impression')
}})})</script></head><body><div id='inject-amazon-slot-id-${a}'>
<script>
googletag.cmd.push(function(){googletag.display('inject-amazon-slot-id-${a}')});
</script></div></body></html>`
        break;
      case 'hb':
        return `
<html><head></head><body><\/body>
<script>
var impression = new Event('impression');var noImpression = new Event('noImpression');
var removeThisAd = new Event('removeThisAd');
var frame = document.createElement('iframe');frame.src='about:blank';frame.setAttribute('frameborder','0');frame.setAttribute('marginwidth','0');frame.setAttribute('marginheight','0');frame.setAttribute('scrolling','no');frame.style.width='${plInfo[placementNumber].styles.width}px';frame.style.height='${plInfo[placementNumber].styles.height}px';document.querySelector('body').appendChild(frame)
var jsonCall = new XMLHttpRequest();jsonCall.open('get','https://hb.brainlyads.com/json-parts/${plInfo[placementNumber].liveDemand[a].linkNumber}');jsonCall.send();jsonCall.onreadystatechange = function(){if(this.status == 200 && this.readyState == 4){
var parts = JSON.parse(this.response);frame.contentDocument.open();
frame.contentDocument.write(\`
<html><head>
${plInfo[placementNumber].liveDemand[a].adLight ? '<script src="https://tagan.adlightning.com/nextmillenium/op.js"><\\/script>' : ''}
<script>
var removeThisAd = new Event('removeThisAd');
document.addEventListener('apAds',()=>{
  console.log('now fired apAds, firing remove ad event to parent frame');
  var removeThisAd = new Event('removeThisAd');
  document.dispatchEvent(removeThisAd);
 })
<\\/script>
\${parts.head}
<script>
document.addEventListener('apAds',()=>{
  console.log('now fired apAds, firing remove ad to code directly (using parnet.)')
  parent.document.dispatchEvent(removeThisAd)
})
googletag.cmd.push(function(){
googletag.pubads().addEventListener('slotRenderEnded',function(info){
if(info.isEmpty==!1){
parent.document.dispatchEvent(parent.impression);
console.log('impression');
} else if(info.isEmpty==!0){
parent.document.dispatchEvent(parent.noImpression);console.log('no impression');
}})})
<\\/script>
</head><body>
\${parts.body}
</body></html>
\`)
frame.contentDocument.close()}}
frame.contentDocument.addEventListener('removeThisAd',()=>{
  console.log('now fired removeThisAd, telling code to remove ad');
  var removeThisAd = new Event('removeThisAd');
  document.dispatchEvent(removeThisAd);
})
</script>
</html>
`
        break;
      case 'other':
        return `<html><head>${plInfo[placementNumber].liveDemand[a].adLight ? '<script src="https://tagan.adlightning.com/nextmillenium/op.js"></script>' : ''}<script>var impression=new Event('impression');var noImpression=new Event('noImpression');
var impTimeout=setTimeout(function(){
document.dispatchEvent(impression);
console.log('impression from other')
},${plInfo[placementNumber].liveDemand[a].timeout})</script>${plInfo[placementNumber].liveDemand[a].headTag}</head><body>${plInfo[placementNumber].liveDemand[a].bodyTag}</body><script>document.addEventListener('noImpression',()=>{console.log('no impression event fired from passback')
if(document.querySelector('iframe')){
document.querySelector('iframe').addEventListener('noImpression',()=>{
impTimeout ? clearTimeout(impTimeout) : console.log('skipping clearTimeout, already cleared')
console.log('no impression fired from passback in iframe')
})}})
</script></html>`
        break
    }
  } else {
    var creativeInfo = getCurrentCreative(placementNumber, a)
    return `
      <html>
      <head>
        <title>Yukshy inject</title>
        <script>
        var impression=new Event('impression')
        var noImpression=new Event('noImpression');
        function creativeLoaded(){
          document.dispatchEvent(impression)
        }
        </script>
        </head>
        <body>
          <a ${creativeInfo.clickThrough ? 'href="'+creativeInfo.clickThrough+'",':''} target="_blank">
            ${plInfo[placementNumber].foldingAdOn ? getFoldedParts(placementNumber, creativeInfo.link) : '<img src="'+creativeInfo.link+'" onload="creativeLoaded()">'}
            
          </a>
        </body>
        </html>
      `
  }
}
function getCurrentCreative(placementNumber, a){
  var clickThrough;
  var link;
  if(!plInfo[placementNumber].creativeArray){
    clickThrough = plInfo[placementNumber].creativeClickThrough,
    link = plInfo[placementNumber].creativeLink
  } else {
    
    var creativeNumber;
    // console.log(creativeChanged)

    if(localStorage.getItem(placementNumber+'dcr')){
      
      if(!creativeChanged[placementNumber]){
        creativeNumber = parseInt(localStorage.getItem(placementNumber+'dcr'))
        localStorage.setItem(placementNumber+'dcr',creativeNumber+1)
      } else {
        creativeNumber = parseInt(localStorage.getItem(placementNumber+'dcr'))-1
      }
    } else {
      localStorage.setItem(placementNumber+'dcr',a+1)
      creativeNumber = 0;
    }
    if(creativeNumber >= plInfo[placementNumber].creativeArray.length){
      creativeNumber = 0
      localStorage.setItem(placementNumber+'dcr',1)
    }
    clickThrough = plInfo[placementNumber].creativeArray[creativeNumber].clickThrough;
    link = plInfo[placementNumber].creativeArray[creativeNumber].link
    creativeChanged[placementNumber] = true 
  }
  return {
    clickThrough : clickThrough,
    link: link
  }
}
function getFoldedParts(placementNumber, creativeLink){
  var index = parseInt(creativeLink.split('/')[creativeLink.split('/').length-1])
  var result = ''
  for(let i=1;i<plInfo[placementNumber].foldingAd.splitAmount+2;i++){
    result += '<img style="position:absolute"'+(i==1?'':' class="folding-image"')+' src="https://powerad.ai/creatives/part/'+placementNumber+'/'+index+'/'+i+'"'+' onload="creativeLoaded()">'
  }
  return result
}

function addAttributes(frame) {
  frame.src = 'about:blank';
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('marginwidth', '0');
  frame.setAttribute('marginheight', '0');
  frame.setAttribute('scrolling', 'no');
  frame.style.width = 'inherit';
  frame.style.height = 'inherit';
  frame.style.display = 'inherit'
  frame.style.margin = 0
  frame.className = 'pa-original-frame'
}
var tagHolders = [],
  unitStatus = {},
  refreshTimeouts = {},
  foldingAdCalled={};
var defaultStyles = function(placement, div) {
  var result = `
height: 0; 
${!placement.styles.animationOff ? 'transition: height 0.5s;' : ''}
position: ${placement.type == 'multiInsert' ? placement.contentPosition : placement.type == 'stickyBottom' || placement.type == 'stickyTop' || placement.type == 'adhesion' || placement.type == 'interstitial' ? 'fixed': 'relative'};
z-index: ${placement.styles.zIndex || 100000}; 
${placement.foldingAdOn ? '' : 'overflow: hidden;'}
${placement.type == 'stickyBottom' ? 'bottom: '+placement.baseOffsetBottom +'px;' : ''}
${placement.type == 'stickyTop' ? 'top: '+placement.leadOffsetTop + 'px;' : ''}
${placement.type == 'stickyBottom' || placement.type == 'stickyTop' ? 'margin: 0 auto;left:0;right:0;' : ''}
display: ${placement.type == 'multiInsert' ? placement.contentDisplay : 'block'};
width: ${placement.styles.width}px;${placement.styles.margin ? 'margin:'+placement.styles.margin+';' : ''}
${placement.type == 'multiInsert' && placement.contentPosition == 'sticky' ? 'top: ' + ((window.innerHeight / 2) - (placement.styles.height / 2)) + 'px;' : ''}${placement.type == 'multiInsert' && placement.contentPosition == 'fixed' ? placement.inContentParams.stickyFootStop ? document.querySelector(placement.selector).getBoundingClientRect().top + document.querySelector(placement.selector).getBoundingClientRect().height + placement.inContentParams.fixedTopOffset > (window.innerHeight / 2) - (placement.styles.height / 2) ? 'top: '+ (document.querySelector(placement.selector).getBoundingClientRect().height + document.querySelector(placement.selector).getBoundingClientRect().top + placement.inContentParams.fixedTopOffset) +  'px;' : document.querySelector(placement.inContentParams.stickyFootStop).getBoundingClientRect().top < ((window.innerHeight/2)+(placement.styles.height/2)+placement.inContentParams.stickyFootOffset) ? 'top: ' + (document.querySelector(placement.inContentParams.stickyFootStop).getBoundingClientRect().top - div.offsetHeight - placement.inContentParams.stickyFootOffset - placement.styles.height) + 'px;' : 'top: '+ ((window.innerHeight / 2) - (placement.styles.height / 2)) + 'px;' : document.querySelector(placement.selector).getBoundingClientRect().top + document.querySelector(placement.selector).getBoundingClientRect().height + placement.inContentParams.fixedTopOffset > ((window.innerHeight / 2) - (placement.styles.height / 2)) ? 'top: '+ (document.querySelector(placement.selector).getBoundingClientRect().height + document.querySelector(placement.selector).getBoundingClientRect().top + placement.inContentParams.fixedTopOffset) + 'px;'  : 'top: '+ ((window.innerHeight / 2) - (placement.styles.height / 2)) + 'px;' : ''}
${placement.type == 'multiInsert' && placement.contentPosition == 'sticky' ? placement.inContentParams.marginLeft == 'auto' ? 'margin-left: '+(document.querySelector(placement.selector).offsetWidth - placement.styles.width) / 2 + 'px;' : 'margin-left: '+placement.inContentParams.marginLeft+'px;' : ''}${placement.type == 'multiInsert' && placement.contentPosition == 'sticky' ? placement.inContentParams.marginRight == 'auto' ? 'margin-right: '+(document.querySelector(placement.selector).offsetWidth - placement.styles.width) / 2 + 'px;' : 'margin-right: '+placement.inContentParams.marginRight+'px;' : ''}${placement.type == 'multiInsert' && placement.contentPosition == 'fixed' ? 'left: ' + ((document.querySelector(placement.selector).getBoundingClientRect().left + (document.querySelector(placement.selector).offsetWidth - placement.styles.width) / 2) - placement.inContentParams.offsetLeft + placement.inContentParams.offsetRight) + 'px;' : ''}${placement.type == 'adhesion' ? placement.adhesionParams.side != 'both' ?[placement.adhesionParams.side]+': '+ ((((window.innerWidth - placement.contentWidth)/2)/2)-(placement.styles.width/2))+'px;' : div.classList[3] ? 'right: '+ ((((window.innerWidth - placement.contentWidth)/2)/2)-(placement.styles.width/2))+'px;' : 'left: '+ ((((window.innerWidth - placement.contentWidth)/2)/2)-(placement.styles.width/2))+'px;' :''}
/* here */
${placement.type == 'adhesion' ? !placement.adhesionParams.noStick ? placement.headStopSide && placement.footStopSide ? document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset > (window.innerHeight/2)-(placement.styles.height/2) ? 'top: '+(document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset) + 'px;' : document.querySelector(placement.footStopSide).getBoundingClientRect().top < (window.innerHeight/2)+(placement.styles.height/2)+placement.adhesionParams.footOffset ? 'top: '+(document.querySelector(placement.footStopSide).getBoundingClientRect().top - placement.adhesionParams.footOffset - placement.styles.height)+'px;' : 'top: '+((window.innerHeight/2)-(placement.styles.height/2))+'px;' : placement.headStopSide && !placement.footStopSide ? document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset > (window.innerHeight/2)-(placement.styles.height/2) ? 'top: '+(document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset) + 'px;' : 'top: '+((window.innerHeight/2)-(placement.styles.height/2))+'px;' : !placement.headStopSide && placement.footStopSide ? document.querySelector(placement.footStopSide).getBoundingClientRect().top < (window.innerHeight/2)+(placement.styles.height/2)+placement.adhesionParams.footOffset ? 'top: '+(document.querySelector(placement.footStopSide).getBoundingClientRect().top - placement.adhesionParams.footOffset - placement.styles.height)+'px;' : 'top: '+((window.innerHeight/2)-(placement.styles.height/2))+'px;' : !placement.headStopSide && !placement.footStopSide ? 'top: '+((window.innerHeight/2)-(placement.styles.height/2))+'px;' : '' : 'top: '+(document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset)+'px' : ''}

${placement.type == 'interstitial' ? 'top: '+((window.innerHeight/2)-(placement.styles.height/2))+'px;' : ''}
${placement.type == 'interstitial' ? 'left: '+((window.innerWidth/2)-(placement.styles.width/2))+'px;' : ''}`

if (placement.type == 'multiInsert' && placement.contentPosition == 'fixed') {
    window.addEventListener('resize', () => {
      div.style.left = ((document.querySelector(placement.selector).getBoundingClientRect().left + (document.querySelector(placement.selector).offsetWidth - placement.styles.width) / 2) - placement.inContentParams.offsetLeft + placement.inContentParams.offsetRight) + 'px'
    })
    document.addEventListener('scroll', () => {
      placement.inContentParams.stickyFootStop ? document.querySelector(placement.selector).getBoundingClientRect().top + document.querySelector(placement.selector).getBoundingClientRect().height + placement.inContentParams.fixedTopOffset > (window.innerHeight / 2) - (placement.styles.height / 2) ? div.style.top = (document.querySelector(placement.selector).getBoundingClientRect().height + document.querySelector(placement.selector).getBoundingClientRect().top + placement.inContentParams.fixedTopOffset) + 'px' : document.querySelector(placement.inContentParams.stickyFootStop).getBoundingClientRect().top < ((window.innerHeight / 2) + (placement.styles.height / 2) + placement.inContentParams.stickyFootOffset) ? div.style.top = document.querySelector(placement.inContentParams.stickyFootStop).getBoundingClientRect().top - placement.styles.height - placement.inContentParams.stickyFootOffset + 'px' : div.style.top = (window.innerHeight / 2) - (placement.styles.height / 2) + 'px' : document.querySelector(placement.selector).getBoundingClientRect().top + document.querySelector(placement.selector).getBoundingClientRect().height + placement.inContentParams.fixedTopOffset > (window.innerHeight / 2) - (placement.styles.height / 2) ? div.style.top = (document.querySelector(placement.selector).getBoundingClientRect().height + document.querySelector(placement.selector).getBoundingClientRect().top + placement.inContentParams.fixedTopOffset) + 'px' : div.style.top = (window.innerHeight / 2) - (placement.styles.height / 2) + 'px'
    })
  }
  if (placement.type == 'adhesion') {
    window.addEventListener('resize', () => {
      changeSide();
      changeTop()
    })
    document.addEventListener('scroll', () => {
      changeTop()
    })

    function changeSide() {
      if (placement.adhesionParams.side != 'both') {
        div.style[placement.adhesionParams.side] = ((((window.innerWidth - placement.contentWidth) / 2) / 2) - (placement.styles.width / 2)) + 'px'
      } else {
        if (div.classList[3]) {
          div.style.right = ((((window.innerWidth - placement.contentWidth) / 2) / 2) - (placement.styles.width / 2)) + 'px'
        } else {
          div.style.left = ((((window.innerWidth - placement.contentWidth) / 2) / 2) - (placement.styles.width / 2)) + 'px'
        }
      }
    }

    function changeTop() {
      if (!unitStatus[div.id.split('-')[div.id.split('-').length - 1]].closed) {
        if(!placement.adhesionParams.noStick){
          placement.headStopSide && placement.footStopSide ? document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset > (window.innerHeight / 2) - (placement.styles.height / 2) ? div.style.top = (document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset) + 'px' : document.querySelector(placement.footStopSide).getBoundingClientRect().top < (window.innerHeight / 2) + (placement.styles.height / 2) + placement.adhesionParams.footOffset ? div.style.top = (document.querySelector(placement.footStopSide).getBoundingClientRect().top - placement.adhesionParams.footOffset - placement.styles.height) + 'px' : div.style.top = ((window.innerHeight / 2) - (placement.styles.height / 2)) + 'px' : placement.headStopSide && !placement.footStopSide ? document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset > (window.innerHeight / 2) - (placement.styles.height / 2) ? div.style.top = (document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset) + 'px' : div.style.top = ((window.innerHeight / 2) - (placement.styles.height / 2)) + 'px' : !placement.headStopSide && placement.footStopSide ? document.querySelector(placement.footStopSide).getBoundingClientRect().top < (window.innerHeight / 2) + (placement.styles.height / 2) + placement.adhesionParams.footOffset ? div.style.top = (document.querySelector(placement.footStopSide).getBoundingClientRect().top - placement.adhesionParams.footOffset - placement.styles.height) + 'px' : div.style.top = ((window.innerHeight / 2) - (placement.styles.height / 2)) + 'px' : !placement.headStopSide && !placement.footStopSide ? div.style.top = ((window.innerHeight / 2) - (placement.styles.height / 2)) + 'px' : ''
        } else {
          // this is a no stick
          var headNumber = document.querySelector(placement.headStopSide).getBoundingClientRect().top + document.querySelector(placement.headStopSide).getBoundingClientRect().height + placement.adhesionParams.headOffset
          div.style.top = headNumber + 'px'
          

        }
      }
    }
  }
  return result
}

function addCloseBtn(unit) {
  var closeBtn = document.createElement('span');
  closeBtn.className = 'pa-close-btn';
  closeBtn.style = `
  position: absolute; top: 0; right: 0; height: 17px; font-size: 14px; font-weight: 900; line-height: 17px; text-align: center; color: white; padding: 1px; font-family: monospace; background: grey;z-index: 1;
  `
  closeBtn.style.width = unit.offsetWidth/100*8 < 30 ? '30px' : '8%'
  unit.appendChild(closeBtn);
  closeBtn.innerHTML = 'X';
  closeBtn.onmouseenter = function() {
    // this.innerHTML = 'Close Ad';
    // this.style.color = 'white';
    // this.style.background = 'rgb(0,0,0,0.8)';
    // this.style.padding = '1px';
    // this.style.width = '100px';
    // this.style.textAlign = 'center';
    this.style.cursor = 'pointer';
    // this.style.top = 0;
    // this.style.right = 0
  }
  // closeBtn.onmouseleave = function() {
  //   this.innerHTML = '&#10060';
  //   this.style.width = '18px';
  //   this.style.background = 'none';
  //   this.style.right = '1px'
  // }
  closeBtn.addEventListener('click', () => {
    unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
    placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length);
    unitStatus[unitNumber].closed = !0;
    !plInfo[placementNumber].styles.animationOff ? unit.style.transition = 'height 0.5s' : {};
    unit.style.height = 0;
    if (document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')) {
      fullPageCover = document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')
      fullPageCover.style.height = 0;
      fullPageCover.style.opacity = 0
    }
    if(!plInfo[placementNumber].styles.animationOff){
      setTimeout(() => {
        unit.style.display = 'none';
        unit.style.opacity = 0;
        unit.remove()
      }, 500);
    } else {
      unit.style.display = 'none';
      unit.style.opacity = 0;
      unit.remove()
    }
    if (refreshTimeouts[unitNumber]) {
      if (refreshTimeouts[unitNumber].started) {
        clearTimeout(refreshTimeouts[unitNumber].timeout);
        refreshTimeouts[unitNumber].running = !1;
        document.removeEventListener('scroll', refreshTimeouts[unitNumber].listeners);
        window.removeEventListener('resize', refreshTimeouts[unitNumber].listeners);
        document.removeEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners)
      }
    }
    if (timeouts[unitNumber]) {
      clearTimeout(timeouts[unitNumber].timeout);
      timeouts[unitNumber].running = !1
    }
  })
}

function injectMulti(placement) {
  if (document.querySelector(placement.selector) != null) {
    plInfo[placement.placementIndex] = placement;
    var newDiv = document.createElement('div');
    newDiv.className = 'pa-global-class';
    newDiv.classList.add('pa-multi-insert');
    newDiv.classList.add('pa-multi-insert-' + placement.placementIndex);
    newDiv.id = 'pa-multi-insert-' + document.querySelectorAll('.pa-global-class').length;
    newDiv.style = defaultStyles(placement, newDiv);
    if (!placement.firstNodeContent || placement.contentPosition == 'sticky') {
      if (placement.contentInsertMode == 'append') {
        document.querySelector(placement.selector).appendChild(newDiv)
      } else if (placement.contentInsertMode == 'after') {
        selector = document.querySelector(placement.selector);
        selectorParent = document.querySelector(placement.selector).parentNode;
        selectorParent.insertBefore(newDiv, selector.nextElementSibling)
      } else if (placement.contentInsertMode == 'before') {
        selector = document.querySelector(placement.selector);
        selectorParent = document.querySelector(placement.selector).parentNode;
        selectorParent.insertBefore(newDiv, selector)
      } else if (placement.contentInsertMode == 'firstChild') {
        if (document.querySelector(placement.selector).childNodes[0]) {
          document.querySelector(placement.selector).childNodes[0].before(newDiv)
        } else {
          console.warn('can\'t inject in content placement ' + placement.placementIndex + ', due to selector not having any children')
        }
      }
    } else if (placement.contentPosition != 'fixed') {
      if (placement.contentInsertMode == 'append') {
        document.querySelectorAll(placement.selector)[placement.firstNodeContent - 1].appendChild(newDiv);
        var holder = placement.cloneEveryContent;
        for (a = placement.cloneEveryContent; a < document.querySelectorAll(placement.selector).length; a += holder) {
          if (document.querySelectorAll(placement.selector)[a + placement.firstNodeContent - 1]) {
            var clone = newDiv.cloneNode();
            clone.id = 'pa-multi-insert-' + document.querySelectorAll('.pa-global-class').length;
            document.querySelectorAll(placement.selector)[a + placement.firstNodeContent - 1].appendChild(clone)
          }
        }
      } else if (placement.contentInsertMode == 'after') {
        selector = document.querySelector(placement.selector);
        selectorParent = document.querySelectorAll(placement.selector)[placement.firstNodeContent].parentNode;
        selectorParent.insertBefore(newDiv, document.querySelectorAll(placement.selector)[placement.firstNodeContent]);
        var holder = placement.cloneEveryContent;
        for (a = placement.cloneEveryContent; a < document.querySelectorAll(placement.selector).length; a += holder) {
          if (document.querySelectorAll(placement.selector)[a + placement.firstNodeContent]) {
            var clone = newDiv.cloneNode();
            clone.id = 'pa-multi-insert-' + document.querySelectorAll('.pa-global-class').length;
            selectorParent = document.querySelectorAll(placement.selector)[a + placement.firstNodeContent].parentNode;
            selectorParent.insertBefore(clone, document.querySelectorAll(placement.selector)[a + placement.firstNodeContent])
          }
        }
      } else if (placement.contentInsertMode == 'before') {
        selector = document.querySelector(placement.selector);
        selectorParent = document.querySelectorAll(placement.selector)[placement.firstNodeContent].parentNode;
        selectorParent.insertBefore(newDiv, document.querySelectorAll(placement.selector)[placement.firstNodeContent - 1]);
        var holder = placement.cloneEveryContent;
        for (a = placement.cloneEveryContent; a < document.querySelectorAll(placement.selector).length; a += holder) {
          if (document.querySelectorAll(placement.selector)[a + placement.firstNodeContent - 1]) {
            var clone = newDiv.cloneNode();
            clone.id = 'pa-multi-insert-' + document.querySelectorAll('.pa-global-class').length;
            selectorParent = document.querySelectorAll(placement.selector)[a + placement.firstNodeContent - 1].parentNode;
            selectorParent.insertBefore(clone, document.querySelectorAll(placement.selector)[a + placement.firstNodeContent - 1])
          }
        }
      } else if (placement.contentInsertMode == 'firstChild') {
        if (document.querySelectorAll(placement.selector)[placement.firstNodeContent]) {
          document.querySelectorAll(placement.selector)[placement.firstNodeContent - 1].childNodes[0].before(newDiv);
          var holder = placement.cloneEveryContent;
          for (a = placement.cloneEveryContent; a < document.querySelectorAll(placement.selector).length; a += holder) {
            if (document.querySelectorAll(placement.selector)[a + placement.firstNodeContent - 1]) {
              var clone = newDiv.cloneNode();
              clone.id = 'pa-multi-insert-' + document.querySelectorAll('.pa-global-class').length;
              document.querySelectorAll(placement.selector)[a + placement.firstNodeContent - 1].childNodes[0].before(clone)
            }
          }
        } else {
          console.warn('can\'t inject in content placement ' + placement.placementIndex + ', due to selector not having any children')
        }
      }
    }
    for (let i of document.querySelectorAll('.pa-multi-insert-' + placement.placementIndex)) {
      var unitNumber = i.id.slice(i.id.lastIndexOf('-') + 1, i.id.length);
      unitStatus[unitNumber] = {
        firstLoad: !1,
        opened: !1,
        closed: !1,
        listening: !1
      }
      // if(!placement.nonView){
        !unitStatus[unitNumber].closed ? plInView(i) : {}
        document.addEventListener('scroll', () => {
          !unitStatus[unitNumber].closed ? plInView(i) : {}
        })
        window.addEventListener('resize', () => {
          !unitStatus[unitNumber].closed ? plInView(i) : {}
        })
        document.addEventListener('visibilitychange', () => {
          !unitStatus[unitNumber].closed ? plInView(i) : {}
        })
      // } else {
      //   // load when not in view
      //   !unitStatus[unitNumber].closed ? addFrames(i) : {}
      // }

      if (placement.timeouts.refresh || placement.timeouts.noImpRefresh) {
        refreshTimeouts[unitNumber] = {
          started: !1,
          running: !1
        }
      }
      if (placement.styles.closeBtn) {
        addCloseBtn(i)
      }
      if (placement.timeouts.remove) {
        timeouts[unitNumber] = {
          running: !1
        }
        timeoutRemove(i)
      }
    }
  }
}

function injectStickyBottom(placement) {
  plInfo[placement.placementIndex] = placement;
  var newDiv = document.createElement('div');
  newDiv.className = 'pa-global-class';
  newDiv.classList.add('pa-sticky-bototm');
  newDiv.classList.add('pa-sticky-bottom-' + placement.placementIndex);
  newDiv.id = 'pa-sticky-bottom-' + document.querySelectorAll('.pa-global-class').length
  newDiv.style = defaultStyles(placement, newDiv)
  document.querySelector('body').appendChild(newDiv)
  unitNumber = newDiv.id.slice(newDiv.id.lastIndexOf('-') + 1, newDiv.id.length);
  unitStatus[unitNumber] = {
    firstLoad: !1,
    opened: !1,
    closed: !1,
    listening: !1
  }
  // if(!placement.nonView){
    !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    document.addEventListener('scroll', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
    window.addEventListener('resize', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
    document.addEventListener('visibilitychange', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
  // } else {
  //   // inject when not in view
  //   !unitStatus[unitNumber].closed ? addFrames(newDiv) : {}
  // }
  if (placement.timeouts.refresh || placement.timeouts.noImpRefresh) {
    refreshTimeouts[unitNumber] = {
      started: !1,
      running: !1
    }
  }
  if (placement.styles.closeBtn) {
    addCloseBtn(newDiv)
  }
  if (placement.timeouts.remove) {
    timeouts[unitNumber] = {
      running: !1
    }
    timeoutRemove(newDiv)
  }
}

function injectStickyTop(placement) {
  plInfo[placement.placementIndex] = placement;
  var newDiv = document.createElement('div');
  newDiv.className = 'pa-global-class';
  newDiv.classList.add('pa-sticky-top');
  newDiv.classList.add('pa-sticky-top-' + placement.placementIndex);
  newDiv.id = 'pa-sticky-top-' + document.querySelectorAll('.pa-global-class').length
  newDiv.style = defaultStyles(placement, newDiv)
  document.querySelector('body').appendChild(newDiv)
  unitNumber = newDiv.id.slice(newDiv.id.lastIndexOf('-') + 1, newDiv.id.length);
  unitStatus[unitNumber] = {
    firstLoad: !1,
    opened: !1,
    closed: !1,
    listening: !1
  }
  // if(!placement.nonView){
    !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    document.addEventListener('scroll', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
    window.addEventListener('resize', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
    document.addEventListener('visibilitychange', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
  // } else {
  //   !unitStatus[unitNumber].closed ? addFrames(newDiv) : {}
  // }
  if (placement.timeouts.refresh || placement.timeouts.noImpRefresh) {
    refreshTimeouts[unitNumber] = {
      started: !1,
      running: !1
    }
  }
  if (placement.styles.closeBtn) {
    addCloseBtn(newDiv)
  }
  if (placement.timeouts.remove) {
    timeouts[unitNumber] = {
      running: !1
    }
    timeoutRemove(newDiv)
  }
}

function injectAdhesion(placement) {
  if ((!placement.headStopSide || document.querySelector(placement.headStopSide) != null) && (!placement.footStopSide || document.querySelector(placement.footStopSide))) {
    plInfo[placement.placementIndex] = placement;
    var newDiv = document.createElement('div');
    newDiv.className = 'pa-global-class';
    newDiv.classList.add('pa-adhesion');
    newDiv.classList.add('pa-adhesion-' + placement.placementIndex);
    newDiv.id = 'pa-adhesion-' + document.querySelectorAll('.pa-global-class').length
    newDiv.style = defaultStyles(placement, newDiv)
    document.querySelector('body').appendChild(newDiv)
    // document.querySelector(placement.headStopSide).appendChild(newDiv)
    var unitNumber = newDiv.id.slice(newDiv.id.lastIndexOf('-') + 1, newDiv.id.length);
    unitStatus[unitNumber] = {
      firstLoad: !1,
      opened: !1,
      closed: !1,
      listening: !1
    }
    // if(!placement.nonView){
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
      document.addEventListener('scroll', () => {
        !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
      })
      window.addEventListener('resize', () => {
        !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
      })
      document.addEventListener('visibilitychange', () => {
        !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
      })
    // } else {
      // !unitStatus[unitNumber].closed ? addFrames(newDiv) : {}
    // }
    if (placement.timeouts.refresh || placement.timeouts.noImpRefresh) {
      refreshTimeouts[unitNumber] = {
        started: !1,
        running: !1
      }
    }
    if (placement.styles.closeBtn) {
      addCloseBtn(newDiv)
    }
    if (placement.timeouts.remove) {
      timeouts[unitNumber] = {
        running: !1
      }
      timeoutRemove(newDiv)
    }
    if (placement.adhesionParams.side == 'both') {
      var clone = newDiv.cloneNode()
      clone.classList.add('pa-adhesion-right')
      clone.id = 'pa-adhesion-' + document.querySelectorAll('.pa-global-class').length
      clone.style = defaultStyles(placement, clone)
      document.querySelector('body').appendChild(clone)
      var unitNumber = clone.id.slice(clone.id.lastIndexOf('-') + 1, clone.id.length);
      unitStatus[unitNumber] = {
        firstLoad: !1,
        opened: !1,
        closed: !1,
        listening: !1
      }
      // if(!placement.nonView){
        !unitStatus[unitNumber].closed ? plInView(clone) : {}
        document.addEventListener('scroll', () => {
          !unitStatus[unitNumber].closed ? plInView(clone) : {}
        })
        window.addEventListener('resize', () => {
          !unitStatus[unitNumber].closed ? plInView(clone) : {}
        })
        document.addEventListener('visibilitychange', () => {
          !unitStatus[unitNumber].closed ? plInView(clone) : {}
        })
      // } else {
      //   !unitStatus[unitNumber].closed ? addFrames(clone) : {}
      // }
      if (placement.timeouts.refresh || placement.timeouts.noImpRefresh) {
        refreshTimeouts[unitNumber] = {
          started: !1,
          running: !1
        }
      }
      if (placement.styles.closeBtn) {
        addCloseBtn(clone)
      }
      if (placement.timeouts.remove) {
        timeouts[unitNumber] = {
          running: !1
        }
        timeoutRemove(clone)
      }
    }
  }
}

function injectInterstitial(placement) {
  plInfo[placement.placementIndex] = placement;
  var newDiv = document.createElement('div');
  newDiv.className = 'pa-global-class';
  newDiv.classList.add('pa-interstitial');
  newDiv.classList.add('pa-interstitial-' + placement.placementIndex);
  newDiv.id = 'pa-interstitial-' + document.querySelectorAll('.pa-global-class').length;
  newDiv.style = defaultStyles(placement, newDiv);
  document.querySelector('body').appendChild(newDiv);
  unitNumber = newDiv.id.slice(newDiv.id.lastIndexOf('-') + 1, newDiv.id.length);
  unitStatus[unitNumber] = {
    firstLoad: !1,
    opened: !1,
    closed: !1,
    listening: !1
  }
  // if(!placement.nonView){
    !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    document.addEventListener('scroll', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
    window.addEventListener('resize', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
    document.addEventListener('visibilitychange', () => {
      !unitStatus[unitNumber].closed ? plInView(newDiv) : {}
    })
  // } else {
  //   !unitStatus[unitNumber].closed ? addFrames(newDiv) : {}
  // }
  if (placement.styles.closeBtn) {
    addCloseBtn(newDiv)
  }
  if (placement.timeouts.remove) {
    timeouts[unitNumber] = {
      running: !1
    }
    timeoutRemove(newDiv)
  }
}

function injectVideo(placement) {
  plInfo[placement.placementIndex] = placement
  if (document.querySelector(placement.selector) != null || placement.videoParams.position == 'fixed') {
    var videoDiv = document.createElement('div');
    videoDiv.className = 'pa-global-class';
    videoDiv.classList.add('pa-video')
    videoDiv.classList.add('pa-video-' + placement.placementIndex);
    videoDiv.id = 'pa-video-' + document.querySelectorAll('.pa-global-class').length;
    userCliked = !1;
    document.addEventListener('click', () => {
      userCliked = !0
    })
    switch (placement.videoParams.position) {
      case 'relative':
      case 'sticky':
      case 'static':
        switch (placement.videoParams.insertMode) {
          case 'after':
            selector = document.querySelector(placement.selector)
            selectorParent = selector.parentNode
            selectorParent.insertBefore(videoDiv, selector.nextElementSibling);
            break;
          case 'before':
            selector = document.querySelector(placement.selector);
            selectorParent = selector.parentNode;
            selectorParent.insertBefore(videoDiv, selector);
            break;
          case 'append':
            document.querySelector(placement.selector).appendChild(videoDiv);
            break;
          case 'firstChild':
            if (document.querySelector(placement.selector).childNodes[0]) {
              document.querySelector(placement.selector).childNodes[0].before(videoDiv)
            } else {
              console.warn('can\'t inject video placement ' + placement.placementIndex + ', due to selector not having any children')
            }
            break
        }
        break;
      case 'fixed':
        document.querySelector('body').appendChild(videoDiv)
        break
    }
    videoDiv.style = `max-height: 0; margin: ${placement.styles.margin || '0 auto'}; overflow: hidden; text-align: center; ${!placement.styles.animationOff ?'transition: max-height 500ms ease-out;' : ''} width: 100%; position:${placement.videoParams.position}; z-index: ${placement.styles.zIndex || 100000};`
    placement.videoParams.position == 'sticky' ? videoDiv.style.top = placement.videoParams.offsetTop + 'px' : {}
    var videoCloseBtn = document.createElement('span');
    videoCloseBtn.style = 'position: absolute; top: 0; right: 0; height: 17px; font-size: 14px; font-weight: 900; line-height: 17px; text-align: center; color: white; padding: 1px; font-family: monospace; background: grey;'
    videoCloseBtn.style.width = videoDiv.offsetWidth/100*8 < 30 ? '30px' : '8%'

    videoDiv.appendChild(videoCloseBtn)
    if (placement.videoParams.position == 'fixed') {
      videoCloseBtn.innerHTML = 'X'
      addCloseBtnHover()
    } else {
      if (placement.styles.closeBtn) {
        videoCloseBtn.innerHTML = 'X'
        addCloseBtnHover()
      }
    }
    videoCloseBtn.addEventListener('click', () => {
      closeAndRemove()
    })
    switch (placement.videoParams.position) {
      case 'relative':
      case 'static':
        videoDiv.style.maxWidth = placement.videoParams.maxWidth + 'px';
        videoDiv.style.position = placement.videoParams.position;
        videoInView() ? injectVideo() : {}
        document.addEventListener('scroll', () => {
          videoInView() ? injectVideo() : {}
        })
        break;
      case 'fixed':
        videoDiv.style.maxWidth = placement.videoParams.fixedMaxWidth + placement.videoParams.fixedMaxWidthType;
        videoDiv.style.position = 'fixed';
        videoDiv.style[placement.videoParams.verticalSide] = placement.videoParams.verticalOffset + placement.videoParams.verticalOffsetType;
        videoDiv.style[placement.videoParams.horizontalSide] = placement.videoParams.horizontalOffset + placement.videoParams.horizontalOffsetType;
        videoInView() ? injectVideo() : {}
        document.addEventListener('scroll', () => {
          videoInView() ? injectVideo() : {}
        })
        break;
      case 'sticky':
        videoDiv.style.maxWidth = '100%';
        videoInView() ? injectVideo() : {}
        document.addEventListener('scroll', () => {
          videoInView() ? injectVideo() : {}
        })
        break
    }

    function getVideoHeight() {
      return videoDiv.offsetWidth * 0.5625
    }

    function videoInView() {
      if (placement.videoParams.position != 'fixed') {
        if (placement.videoParams.scrollAction == 'pause') {
          return videoDiv.getBoundingClientRect().top + (getVideoHeight() / 2) >= 0 && videoDiv.getBoundingClientRect().top + (getVideoHeight() / 2) <= screen.availHeight
        } else if (placement.videoParams.scrollAction == 'move') {
          return videoDiv.getBoundingClientRect().top + (getVideoHeight() / 2) <= screen.availHeight
        }
      } else {
        return !0
      }
    }

    function addCloseBtnHover() {
      videoCloseBtn.onmouseenter = function() {
    //     this.innerHTML = 'Close Ad';
    //     this.style.color = 'white';
    //     this.style.background = 'rgb(0,0,0,0.7)';
    //     this.style.padding = '2px';
    //     this.style.width = '53px';
    //     this.style.textAlign = 'right';
        this.style.cursor = 'pointer'
      }
    //   videoCloseBtn.onmouseleave = function() {
    //     this.innerHTML = '&#10060';
    //     this.style.width = '15px';
    //     this.style.background = 'none'
    //   }
    }
    var paJwPlayerInstance;
    var paJwContainerDiv;
    var paJwVideoDiv;
    var paAlreadyPlayed = !1;

    function injectVideo() {
      if (document.querySelector('#' + videoDiv.id + ' > script') == null && document.querySelector('#' + videoDiv.id + ' > div') == null && !paAlreadyPlayed) {
        var jwScript = document.createElement('script');
        jwScript.src = placement.videoParams.playerLink;
        jwScript.id = 'jw-library-script';
        videoDiv.appendChild(jwScript)
        paJwContainerDiv = document.createElement('div')
        paJwContainerDiv.className - 'pa-jw-media-container';
        videoDiv.appendChild(paJwContainerDiv);
        paJwVideoDiv = document.createElement('div')
        paJwVideoDiv.id = 'pa-jw-player'
        paJwContainerDiv.appendChild(paJwVideoDiv)
        placement.videoParams.position != 'fixed' ? paJwContainerDiv.style = 'max-height: inherit;position: inherit;max-width: inherit;height: inherit;width: inherit; ' : {}
        jwScript.addEventListener('load', () => {
          paJwPlayerInstance = jwplayer('pa-jw-player');
          paJwPlayerInstance.setup({
            file: placement.videoParams.videoLink
          })
          paJwPlayerInstance.on('ready', () => {
            openAndPlay()
          })
        })
      }
    }

    function openAndPlay() {
      switch (placement.videoParams.live) {
        case false:
          videoDiv.style.maxHeight = getVideoHeight() + 'px';
          paJwPlayerInstance.play()
          paJwPlayerInstance.setMute(!0)
          videoDiv.style.height = getVideoHeight() + 'px';
          resizeVideo()
          togglePlay();
          toggleSound();
          toggleFixed();
          break;
        case true:
          paJwPlayerInstance.play();
          paJwPlayerInstance.setMute(!0);
          paJwPlayerInstance.on('adImpression', () => {
            console.log('impression recieved for video');
            videoDiv.style.maxHeight = getVideoHeight() + 'px';
            videoDiv.style.height = getVideoHeight() + 'px';
            resizeVideo();
            togglePlay();
            toggleSound();
            toggleFixed()
          })
          break
      }
      paJwPlayerInstance.on('error adError complete adComplete adSkipped', () => {
        closeAndRemove()
      })
      paJwPlayerInstance.on('adRequest', (info) => {})
      paJwPlayerInstance.on('adError', (err) => {
        var placementNumber = videoDiv.classList[2].slice(videoDiv.classList[2].lastIndexOf('-') + 1, videoDiv.classList[2].length)
        if (plInfo[placementNumber].noImpPassback) {
          if (plInfo[plInfo[placementNumber].noImpPassback]) {
            checkOnPlacement(plInfo[plInfo[placementNumber].noImpPassback])
            closeAndRemove()
          } else {
            console.warn('can\'t passback from placement: ' + placementNumber + ' to placement: ' + plInfo[placementNumber].noImpPassback + ', \nthe passback placement was not found')
          }
        }
      })
    }

    function togglePlay() {
      document.addEventListener('scroll', () => {
        videoInView() ? paJwPlayerInstance.play() : paJwPlayerInstance.pause()
      })
    }

    function toggleSound() {
      !!window.chrome ? userCliked ? toggleSound() : document.addEventListener('click', () => {
        toggleSound()
      }) : toggleSound()

      function toggleSound() {
        paJwContainerDiv.onmouseenter = function() {
          paJwPlayerInstance.setMute(!1)
        }
      }
    }

    function toggleFixed() {
      if (placement.videoParams.scrollAction == 'move' && placement.videoParams.position != 'fixed') {
        document.addEventListener('scroll', () => {
          if (!paAlreadyPlayed) {
            videoDiv.getBoundingClientRect().top + (getVideoHeight() / 2) >= 0 ? changeFromFixed() : changeToFixed()
          }
        })

        function changeToFixed() {
          paJwContainerDiv.appendChild(videoCloseBtn);
          videoCloseBtn.innerHTML = 'X'
          placement.styles.closeBtn ? {} : addCloseBtnHover();
          paJwContainerDiv.style = `
position: fixed;
${placement.videoParams.horizontalSide+':'+placement.videoParams.horizontalOffset+placement.videoParams.horizontalOffsetType};
${placement.videoParams.verticalSide+':'+placement.videoParams.verticalOffset+placement.videoParams.verticalOffsetType};
width: ${placement.videoParams.fixedMaxWidth+placement.videoParams.fixedMaxWidthType};z-index: ${placement.videoParams.fixedZIndex || 1000000};`
          paJwContainerDiv.style.height = (paJwContainerDiv.offsetWidth * 0.562) + 'px'
          resizeVideo()
        };

        function changeFromFixed() {
          placement.styles.closeBtn ? videoDiv.appendChild(videoCloseBtn) : videoCloseBtn.remove();
          paJwContainerDiv.style = `
${placement.videoParams.horizontalSide}: 0;
${placement.videoParams.verticalSide}: 0;
maxHeight: inherit; height: inherit; position: inherit; width: inherit;`
          resizeVideo()
        }
      }
    }

    function resizeVideo() {
      paJwPlayerInstance.resize(paJwContainerDiv.offsetWidth, paJwContainerDiv.offsetHeight)
      var resizeInterval = setInterval(() => {
        paJwPlayerInstance.resize(paJwContainerDiv.offsetWidth, paJwContainerDiv.offsetHeight)
      }, 10);
      setTimeout(() => {
        clearInterval(resizeInterval)
      }, 2100)
    }

    function closeAndRemove() {
      paAlreadyPlayed = !0
      videoDiv.style.maxHeight = '0px';
      paJwContainerDiv.style.maxHeight = 'inherit'
      if(!placement.styles.animationOff){
        setTimeout(function() {
          paJwPlayerInstance.remove();
          videoDiv.removeChild(paJwContainerDiv);
          videoDiv.style.display = 'none'
        }, 500)
      } else {
        paJwPlayerInstance.remove();
        videoDiv.removeChild(paJwContainerDiv);
        videoDiv.style.display = 'none'
      }
    }
  }
}
function smallerBox(unit) {
  var frameImg = unit.querySelector('iframe.pa-original-frame');
  frameImg.style.position = 'absolute';
  frameImg.style.left = 0;
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length);
  frameImg.style.height = plInfo[placementNumber].styles.height + 'px'
  
  // here
  positionFrame();
  document.addEventListener('scroll', positionFrame);
  function positionFrame() {
    var theNumber = (window.innerHeight / 2) - (frameImg.getBoundingClientRect().height / 2);
    // var theNumber = 0
    if (unit.getBoundingClientRect().top + unit.getBoundingClientRect().height + theNumber <= window.innerHeight) { // the full unit is in view 
      if (unit.getBoundingClientRect().top > window.innerHeight - frameImg.getBoundingClientRect().height - theNumber) { // the unit is still in the ad height zone of the bottom of screen
      // if (unit.getBoundingClientRect().top > window.innerHeight - plInfo[placementNumber].styles.height - theNumber) { // the unit is still in the ad height zone of the bottom of screen
        var dif = window.innerHeight - unit.getBoundingClientRect().top;
        // frameImg.style.top = ((window.innerHeight - unit.getBoundingClientRect().top) - frameImg.getBoundingClientRect().height - theNumber) + 'px';
        frameImg.style.top = ((window.innerHeight - unit.getBoundingClientRect().top) - frameImg.getBoundingClientRect().height - theNumber) + 'px';
      } else {
        frameImg.style.top = 0;
      }
    } else {
      // frameImg.style.top = (unit.getBoundingClientRect().height - frameImg.getBoundingClientRect().height) + 'px';
      frameImg.style.top = (plInfo[placementNumber].smallerBoxHeight - plInfo[placementNumber].styles.height) + 'px';
    }
  }
}
function foldingAd(unit){
  var positoinFoldsListenerAdded = false
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length);
  var imgHeight = plInfo[placementNumber].styles.height
  var foldHeight = imgHeight-plInfo[placementNumber].foldingAd.firstHeight
  var eachFoldHeight = foldHeight/plInfo[placementNumber].foldingAd.splitAmount
  var foldAmount = plInfo[placementNumber].foldingAd.splitAmount
  var foldAtPercent = plInfo[placementNumber].foldingAd.foldAtPercent
  var img = unit.querySelector('iframe').contentDocument.querySelector('a')
  var imgs = img.querySelectorAll('img')
  var foldingImgs = img.querySelectorAll('.folding-image')
  var eachTop = 0;
  for(let i of imgs){
    i.style.top = eachTop+'px'
    eachTop +=eachFoldHeight
  }
  var firstHeight = plInfo[placementNumber].foldingAd.firstHeight
  var foldHeight = (imgHeight-firstHeight)/plInfo[placementNumber].foldingAd.splitAmount
  var eachHeight = [firstHeight]
  for(let i=0;i<foldingImgs.length;i++){
    eachHeight.push(foldHeight)
  }
  function getOdd(i){
    if(i%2 == 1){
      return true
    } else {
      return false
    }
  }
  function getOffsetTop(i){
    result = 0
    for(let a = 0;a<i+1;a++){
      result+= imgs[a].getBoundingClientRect().height
    }
    if(getOdd(i)) {
      result -= imgs[i].offsetHeight - imgs[i].getBoundingClientRect().height
    }
    return result
  }
  function foldAd(){  
    function positionFolds(){
      if(unit.getBoundingClientRect().top + imgHeight >= window.innerHeight/100*foldAtPercent){
        for(let i =0;i<foldingImgs.length;i++){
          var percent = window.innerHeight/100*foldAtPercent
          var imgOffset = unit.getBoundingClientRect().top
          var pxOut = percent - imgOffset
          pxIn = imgHeight - pxOut
          pxToDeg = foldHeight / 90
          var deg = pxIn / pxToDeg
          deg = deg/foldAmount
          deg = deg >= 90 ? 90 : deg <= 0 ? 0 : deg
          foldingImgs[i].style.transform = 'skew('+(getOdd(i) ? '-' : '')+deg+'deg) rotateX('+(getOdd(i) ? '-' : '') +deg+'deg)'
          foldingImgs[i].style.transformOrigin = getOdd(i) ? 'bottom' : 'top'
          foldingImgs[i].style.top = getOffsetTop(i) + 'px'
          unit.querySelector('iframe').style.width = (foldingImgs[i].getBoundingClientRect().width)+'px'
        }
      } else {
        offsetTop = 0
        for(let i=0;i<imgs.length;i++){
          imgs[i].style.transform = 'skew(0deg) rotateX(0deg)'
          imgs[i].style.top = offsetTop+'px'
          offsetTop+=imgs[i].getBoundingClientRect().height
        }
      }
      unitHeight = 0;
      for(let i of imgs){
        unitHeight += i.getBoundingClientRect().height
      }
      unit.style.height = unitHeight+'px'
    }
    positionFolds()
    if(!positoinFoldsListenerAdded){
      positoinFoldsListenerAdded = true
      document.addEventListener('scroll',positionFolds)
      function removeTransition(){
        unit.style.transition= ''
      }
      document.addEventListener('scroll',removeTransition)
      setTimeout(() => {
        document.removeEventListener('scroll',removeTransition)
        removeTransition()
      }, 1000);
    }
  }
  foldAd()
  var foldNowInt = setInterval(() => {
    foldAd()
  }, 100);
  setTimeout(() => {
    clearInterval(foldNowInt)
  }, 1000);
}


function iframeWrite(unit, className) {
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
  unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
  unitStatus[unitNumber].listening = !0;
  if (!unitStatus[unitNumber].closed) {
    if (tagHolders[unitNumber] < plInfo[placementNumber].liveDemand.length || plInfo[placementNumber].demandType != 'live') {
      newFrame = document.querySelector('#' + unit.id + ' > iframe.' + className).cloneNode();
      document.querySelector('#' + unit.id + ' > iframe.' + className).remove();
      unit.appendChild(newFrame);
      var frame = document.querySelector('#' + unit.id + ' > iframe.' + className);
      frame.contentDocument.open();
      frame.contentDocument.write(compileTag(placementNumber, tagHolders[unitNumber]));
      frame.contentDocument.close()
      frame.contentDocument.addEventListener('removeThisAd',()=>{
        console.log('should remove the ad now')
        unitStatus[unitNumber].closed = true;
        unit.style = 'opacity:0;display:none;height:0;width:0;overflow:none;'
        if (refreshTimeouts[unitNumber]) {
          if (refreshTimeouts[unitNumber].started) {
            clearTimeout(refreshTimeouts[unitNumber].timeout);
            refreshTimeouts[unitNumber].running = !1;
            document.removeEventListener('scroll', refreshTimeouts[unitNumber].listeners);
            window.removeEventListener('resize', refreshTimeouts[unitNumber].listeners);
            document.removeEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners)
          }
        }
        if (timeouts[unitNumber]) {
          clearTimeout(timeouts[unitNumber].timeout);
          timeouts[unitNumber].running = !1
        }
        // try {
          // addCloseBtn(unit)
          // document.querySelector('#'+unit.id+' > span').click()


          // console.log('successfully removed ad for apAds')
        // } catch(e){
          // console.log('failed to remove the ad for adAps, error: \n'+e)
        // }
      })
    }
  }
  if (className == 'pa-original-frame') {
    impressionListeners(unit)
  } else if (className == 'pa-refresh-frame') {
    refreshImpListeners(unit)
  } else {
    console.warn('couldn\'t add listeners for class name: ' + className)
  }
}

function addFrames(unit) {
  if(!unit){
    console.warn('can\'t add frames to a unit that doesn\'t exist')
    return
  }
  unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
  if (unitStatus[unitNumber]) {
    if (!unitStatus[unitNumber].firstLoad && !unitStatus[unitNumber].closed) {
      unitStatus[unitNumber].firstLoad = !0;
      tagHolders[unitNumber] = 0;
      var newIframe = document.createElement('iframe');
      addAttributes(newIframe);
      document.querySelector('#' + unit.id).appendChild(newIframe)
      iframeWrite(unit, 'pa-original-frame');
      impressionListeners(unit);
      var refreshFrame = newIframe.cloneNode();
      refreshFrame.className = 'pa-refresh-frame';
      refreshFrame.style.display = 'none';
      document.querySelector('#' + unit.id).appendChild(refreshFrame)
      // if(plInfo[placementNumber].type == 'multiInsert' && plInfo[placementNumber].smallerBoxOn){
      //   smallerBox(unit)
      // }
    }
  }
}
function impressionListeners(unit) {
  unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
  if (!unitStatus[unitNumber].closed) {
    frameDoc = document.querySelector('#' + unit.id + ' > iframe.pa-original-frame').contentDocument;
    frameDoc.addEventListener('impression', () => {
      var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
      var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
      if(plInfo[placementNumber].smallerBoxOn){
        unit.style.height = plInfo[placementNumber].smallerBoxHeight + 'px'
        smallerBox(unit)
      } else if(plInfo[placementNumber].foldingAdOn){
        // temp
        // here
        if(!foldingAdCalled[unitNumber]){
          foldingAdCalled[unitNumber] = true
          foldingAd(unit)        
        }
        // console.log('this ad should be folded')
      } else {
        unit.style.height = plInfo[placementNumber].styles.height + 'px';
      }
      plInfo[placementNumber].impression = !0
      unitStatus[unitNumber].opened = !0;
      unitStatus[unitNumber].listening = !1;
      if (plInfo[placementNumber].timeouts.refresh) {
        refresh(unit, plInfo[placementNumber].timeouts.refresh)
      }
      if (plInfo[placementNumber].type == 'interstitial' && !document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')) {
        var fullPageCover = document.createElement('div')
        fullPageCover.className = 'pa-interstitial-full-page-cover'
        fullPageCover.style = 'height: 0; width: 100%; position: fixed; top: 0; bottom:0;right:0;left:0; background: black; opacity:0'
        fullPageCover.style.transition = !plInfo[placementNumber].styles.animationOff ? 'height 0.5s, opacity 0.5s' : 'opacity 0.5s';
        setTimeout(() => {
          fullPageCover.style.opacity = '0.85';
          fullPageCover.style.height = '100%'
        }, 2);
        fullPageCover.style.zIndex = '-1';
        unit.appendChild(fullPageCover)
      }
    })
    frameDoc.addEventListener('noImpression', () => {
      var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
      var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
      tagHolders[unitNumber] = tagHolders[unitNumber] + 1;
      iframeWrite(unit, 'pa-original-frame')
      if (tagHolders[unitNumber] >= plInfo[placementNumber].liveDemand.length) {
        unitStatus[unitNumber].listening = !1;
        if (plInfo[placementNumber].noImpPassback) {
          noImpPassback(unit)
        }
        if (plInfo[placementNumber].timeouts.noImpRefresh) {
          refresh(unit, plInfo[placementNumber].timeouts.noImpRefresh)
        } else {
          if (plInfo[placementNumber].timeouts.refresh) {
            refresh(unit, plInfo[placementNumber].timeouts.refresh)
          }
        }
      }
    })
  }
}

function noImpPassback(unit) {
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
  for (let i of document.querySelectorAll('.' + unit.classList[2])) {
    unitNumber = i.id.slice(i.id.lastIndexOf('-') + 1, i.id.length)
    if (unitStatus[unitNumber].opened || unitStatus[unitNumber].listening) {
      return
    }
  }
  if (plInfo[plInfo[placementNumber].noImpPassback]) {
    for (let i of document.querySelectorAll('.' + unit.classList[2])) {
      unitNumber = i.id.split('-')[i.id.split('-').length - 1]
      unitStatus[unitNumber].closed = !0;
      if (refreshTimeouts[unitNumber]) {
        if (refreshTimeouts[unitNumber].started) {
          clearTimeout(refreshTimeouts[unitNumber].timeout);
          refreshTimeouts[unitNumber].running = !1;
          document.removeEventListener('scroll', refreshTimeouts[unitNumber].listeners);
          window.removeEventListener('resize', refreshTimeouts[unitNumber].listeners);
          document.removeEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners)
        }
      }
      if (timeouts[unitNumber]) {
        clearTimeout(timeouts[unitNumber].timeout);
        timeouts[unitNumber].running = !1
      }
    }
    checkOnPlacement(plInfo[plInfo[placementNumber].noImpPassback])
  } else {}
}

function changeDisplay(inView, unit) {
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
  if (unitStatus[unitNumber] && unitStatus[unitNumber].opened) {
    if (plInfo[placementNumber].type != 'adhesion') {
      if (!inView) {
        unit.style.height = 0
        if (document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')) {
          fullPageCover = document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover');
          fullPageCover.style.height = 0;
          fullPageCover.style.opacity = 0
        }
      } else {
        // unit.style.height = plInfo[placementNumber].styles.height + 'px'
        if(plInfo[placementNumber].smallerBoxOn){
          unit.style.height = plInfo[placementNumber].smallerBoxHeight + 'px'
        } else {
          unit.style.height = plInfo[placementNumber].styles.height + 'px';
        }
        if (document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')) {
          fullPageCover = document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover');
          fullPageCover.style.height = '100%';
          fullPageCover.style.opacity = 0.85
        }
      }
    } else {
      !plInfo[placementNumber].styles.animationOff ? unit.style.transition = 'width 0.5s' : {}
      if (!inView) {
        unit.style.width = 0
      } else {
        unit.style.width = plInfo[placementNumber].styles.width + 'px'
      }
    }
  }
}

function plInView(unit) {
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length);
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
  if(plInfo[placementNumber].type == 'multiInsert' && plInfo[placementNumber].nonView && !unitStatus[unitNumber].firstLoad){
    addFrames(unit)
    setTimeout(() => {
      var scrollEvent = new Event('scroll')
      document.dispatchEvent(scrollEvent) //this is for refresh on nonView to stop the automatic refresh timers  
    }, 2000);
    return true
  }
  
  if (document.visibilityState == 'hidden') {
    return !1
  }
  if (plInfo && plInfo[placementNumber] && plInfo[placementNumber].type == 'adhesion') {
    if (window.innerWidth < plInfo[placementNumber].contentWidth + (plInfo[placementNumber].styles.width * 2)) {
      changeDisplay(!1, unit);
      return !1
    }
    if (plInfo[placementNumber].headStopSide && plInfo[placementNumber].footStopSide) {
      if ((document.querySelector(plInfo[placementNumber].footStopSide).getBoundingClientRect().top) - (document.querySelector(plInfo[placementNumber].headStopSide).getBoundingClientRect().height + document.querySelector(plInfo[placementNumber].headStopSide).getBoundingClientRect().top) < plInfo[placementNumber].styles.height) {
        changeDisplay(!1, unit);
        return !1
      }
    }
  }
  if (plInfo[placementNumber].rules.widthRules.minWidth && window.innerWidth < plInfo[placementNumber].rules.widthRules.minWidth) {
    changeDisplay(!1, unit)
    return !1
  } else {
    changeDisplay(!0, unit)
  }
  if (plInfo[placementNumber].rules.widthRules.maxWidth && window.innerWidth > plInfo[placementNumber].rules.widthRules.maxWidth) {
    changeDisplay(!1, unit)
    return !1
  } else {
    changeDisplay(!0, unit)
  }
  if (plInfo[placementNumber].styles.showScroll && getScroll() < plInfo[placementNumber].styles.showScroll) {
    changeDisplay(!1, unit)
    return !1
  } else {
    changeDisplay(!0, unit)
  }
  if (plInfo[placementNumber].styles.hideScroll && getScroll() > plInfo[placementNumber].styles.hideScroll) {
    changeDisplay(!1, unit)
    return !1
  } else {
    changeDisplay(!0, unit)
  }
  if (unit.getBoundingClientRect().top + (plInfo[placementNumber].styles.height / 2) > 0 && unit.getBoundingClientRect().bottom - (plInfo[placementNumber].styles.height / 2) < window.innerHeight) {
    addFrames(unit);
    return !0
  } else {
    return !1
  }
}

function refreshNow(unit) {
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
  if (!unitStatus[unitNumber].closed) {
    tagHolders[unitNumber] = 0;
    iframeWrite(unit, 'pa-refresh-frame')
  }
}

function refreshImpListeners(unit) {
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
  if (!unitStatus[unitNumber].closed) {
    frameDoc = document.querySelector('#' + unit.id + ' > iframe.pa-refresh-frame').contentDocument;
    frameDoc.addEventListener('impression', () => {
      switchFrames(unit);
      if (plInfo[placementNumber].timeouts.refresh) {
        refresh(unit, plInfo[placementNumber].timeouts.refresh)
      }
    })
    frameDoc.addEventListener('noImpression', () => {
      var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
      var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length)
      tagHolders[unitNumber] = tagHolders[unitNumber] + 1;
      iframeWrite(unit, 'pa-refresh-frame');
      if (tagHolders[unitNumber] >= plInfo[placementNumber].liveDemand.length) {
        if (plInfo[placementNumber].timeouts.noImpRefresh) {
          refresh(unit, plInfo[placementNumber].timeouts.noImpRefresh)
        } else {
          if (plInfo[placementNumber].timeouts.refresh) {
            refresh(unit, plInfo[placementNumber].timeouts.refresh)
          }
        }
      }
    })
  }
}

function switchFrames(unit) {
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length);
  if (!unitStatus[unitNumber].opened) {
    // here
    // unit.style.height = plInfo[placementNumber].styles.height + 'px';
    if(plInfo[placementNumber].smallerBoxOn){
      unit.style.height = plInfo[placementNumber].smallerBoxHeight + 'px'
      // console.log('has smaller size!!')
      // smallerBox(unit)
    } else {
      unit.style.height = plInfo[placementNumber].styles.height + 'px';
    }
    unitStatus[unitNumber].opened = !0
  }
  document.querySelector('#' + unit.id + ' > iframe.pa-original-frame').style.display = 'none';
  document.querySelector('#' + unit.id + ' > iframe.pa-refresh-frame').style.display = 'inherit';
  document.querySelector('#' + unit.id + ' > iframe.pa-refresh-frame').className = 'pa-original-frame';
  document.querySelector('#' + unit.id + ' > iframe.pa-original-frame').className = 'pa-refresh-frame'
}

function refresh(unit, time) {
  placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length);
  unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
  refreshTimeouts[unitNumber].started = !0;
  refreshTimeouts[unitNumber].running = !0;
  refreshTimeouts[unitNumber].startTS = new Date().getTime();
  refreshTimeouts[unitNumber].timeout = setTimeout(() => {
    timeoutFinished(unit)
  }, time);
  if (!refreshTimeouts[unitNumber].listenersAdded) {
    refreshTimeouts[unitNumber].listenersAdded = !0;
    addListeners(unit, time)
    // var scrollEvent = new Event('scroll')
    // document.dispatchEvent(scrollEvent) //this is for refresh on nonView to stop the automatic refresh timers
  }

  function addListeners(unit, time) {
    refreshTimeouts[unitNumber].listeners = function() {
      var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length)
      if (refreshTimeouts[unitNumber].started && !unitStatus[unitNumber].closed) {
        if (plInView(unit)) {
          if (!refreshTimeouts[unitNumber].running) {
            var dif = refreshTimeouts[unitNumber].stopTS - refreshTimeouts[unitNumber].startTS;
            refreshTimeouts[unitNumber].running = !0;
            refreshTimeouts[unitNumber].startTS = new Date().getTime() - dif;
            refreshTimeouts[unitNumber].timeout = setTimeout(() => {
              timeoutFinished(unit)
            }, time - dif);
            var temp = time - dif
          }
        } else {
          if (refreshTimeouts[unitNumber].running) {
            refreshTimeouts[unitNumber].running = !1;
            refreshTimeouts[unitNumber].stopTS = new Date().getTime();
            clearTimeout(refreshTimeouts[unitNumber].timeout);
            var dif = refreshTimeouts[unitNumber].stopTS - refreshTimeouts[unitNumber].startTS
          }
        }
      }
    }
    document.addEventListener('scroll', refreshTimeouts[unitNumber].listeners);
    window.addEventListener('resize', refreshTimeouts[unitNumber].listeners);
    document.addEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners)
    // if(!unitStatus[unitNumber].firstLoad){
      var scrollEvent = new Event('scroll')
      document.dispatchEvent(scrollEvent) //this is for refresh on nonView to stop the automatic refresh timers
    // }
  }

  function timeoutFinished(unit) {
    unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
    refreshTimeouts[unitNumber].running = !1;
    refreshTimeouts[unitNumber].started = !1;
    refreshTimeouts[unitNumber].startTS = '';
    refreshTimeouts[unitNumber].stopTS = '';
    clearTimeout(refreshTimeouts[unitNumber].timeout);
    removeListeners(unit);
    if (!unitStatus[unitNumber].closed) {
      refreshNow(unit)
    }
  }

  function removeListeners(unit) {
    var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
    document.removeEventListener('scroll', refreshTimeouts[unitNumber].listeners);
    window.removeEventListener('resize', refreshTimeouts[unitNumber].listeners);
    document.removeEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners);
    refreshTimeouts[unitNumber].listenersAdded = !1
  }
}

function timeoutRemove(unit) {
  var placementNumber = unit.classList[2].slice(unit.classList[2].lastIndexOf('-') + 1, unit.classList[2].length);
  var unitNumber = unit.id.slice(unit.id.lastIndexOf('-') + 1, unit.id.length);
  if (!unitStatus[unitNumber].cloed) {
    timeouts[unitNumber].startTS = new Date().getTime();
    timeouts[unitNumber].running = !0;
    timeouts[unitNumber].timeout = setTimeout(() => {
      unitStatus[unitNumber].closed = !0;
      unit.style.height = 0;
      if (document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')) {
        fullPageCover = document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover');
        fullPageCover.style.height = 0;
        fullPageCover.style.opacity = 0
      }
      if(!plInfo[placementNumber].styles.animationOff){
        setTimeout(() => {
          unit.style.display = 'none';
          unit.style.opacity = 0;
          unit.remove()
        }, 500);
      } else {
        unit.style.display = 'none';
        unit.style.opacity = 0;
        unit.remove()
      }
      if (refreshTimeouts[unitNumber] && refreshTimeouts[unitNumber].started) {
        clearTimeout(refreshTimeouts[unitNumber].timeout);
        refreshTimeouts[unitNumber].running = !1;
        document.addEventListener('scroll', refreshTimeouts[unitNumber].listeners);
        window.addEventListener('resize', refreshTimeouts[unitNumber].listeners);
        document.addEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners)
      }
    }, plInfo[placementNumber].timeouts.remove)
  }
  document.addEventListener('scroll', () => {
    listenersChanges(unit)
  });
  window.addEventListener('resize', () => {
    listenersChanges(unit)
  });
  document.addEventListener('visibilitychange', () => {
    listenersChanges(unit)
  });

  function listenersChanges(unit) {
    if (plInView(unit)) {
      if (!timeouts[unitNumber].running && !unitStatus[unitNumber].closed) {
        timeouts[unitNumber].running = !0
        if (!timeouts[unitNumber].stopTS) {
          timeouts[unitNumber].startTS = new Date().getTime();
          timeouts[unitNumber].timeout = setTimeout(() => {
            unitStatus[unitNumber].closed = !0;
            unit.style.height = 0;
            if (document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')) {
              fullPageCover = document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')
              fullPageCover.style.height = 0;
              fullPageCover.style.opacity = 0
            }
            if(!plInfo[placementNumber].styles.animationOff){
              setTimeout(() => {
                unit.style.display = 'none';
                unit.style.opacity = 0;
                unit.remove()
              }, 500);
            } else {
              unit.style.display = 'none';
              unit.style.opacity = 0;
              unit.remove()
            }
            if (refreshTimeouts && refreshTimeouts[unitNumber] && refreshTimeouts[unitNumber].started) {
              clearTimeout(refreshTimeouts[unitNumber].timeout);
              refreshTimeouts[unitNumber].running = !1;
              document.removeEventListener('scroll', refreshTimeouts[unitNumber].listeners);
              window.removeEventListener('resize', refreshTimeouts[unitNumber].listeners);
              document.removeEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners)
            }
          }, plInfo[placementNumber].timeouts.remove)
        } else {
          var dif = timeouts[unitNumber].stopTS - timeouts[unitNumber].startTS;
          timeouts[unitNumber].startTS = new Date().getTime() - dif;
          timeouts[unitNumber].timeout = setTimeout(() => {
            unitStatus[unitNumber].closed = !0;
            
            unit.style.height = 0;
            if (document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover')) {
              fullPageCover = document.querySelector('#' + unit.id + ' > div.pa-interstitial-full-page-cover');
              fullPageCover.style.height = 0;
              fullPageCover.style.opacity = 0
            }
            if(!plInfo[placementNumber].styles.animationOff){
              setTimeout(() => {
                unit.style.display = 'none';
                unit.style.opacity = 0;
                unit.remove()
              }, 500);
            } else {
              unit.style.display = 'none';
              unit.style.opacity = 0;
              unit.remove()   
            }
            if (refreshTimeouts && refreshTimeouts[unitNumber] && refreshTimeouts[unitNumber].started) {
              clearTimeout(refreshTimeouts[unitNumber].timeout);
              refreshTimeouts[unitNumber].running = !1;
              document.removeEventListener('scroll', refreshTimeouts[unitNumber].listeners);
              window.removeEventListener('resize', refreshTimeouts[unitNumber].listeners);
              document.removeEventListener('visibilitychange', refreshTimeouts[unitNumber].listeners)
            }
          }, plInfo[placementNumber].timeouts.remove - dif)
        }
      }
    } else {
      if (timeouts[unitNumber].running && !unitStatus[unitNumber].closed) {
        timeouts[unitNumber].running = !1;
        timeouts[unitNumber].stopTS = new Date().getTime();
        clearTimeout(timeouts[unitNumber].timeout)
      }
    }
  }
}
var startTimeStamp = new Date().getTime();