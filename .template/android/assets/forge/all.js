/*! Copyright 2011 Trigger Corp. All rights reserved. */
(function(){var k={};var g={};k.config={modules:{logging:{level:"DEBUG"}}};k.config.uuid="UUID_HERE";g.listeners={};var c={};var f=[];var e=null;var i=false;var l=function(){if(f.length>0){if(!g.debug||window.catalystConnected){i=true;while(f.length>0){var m=f.shift();if(m[0]=="logging.log"){console.log(m[1].message)}g.priv.call.apply(g.priv,m)}i=false}else{e=setTimeout(l,500)}}};g.priv={call:function(t,s,r,n){if((!g.debug||window.catalystConnected||t==="internal.showDebugWarning")&&(f.length==0||i)){var m=k.tools.UUID();var p=true;if(t==="button.onClicked.addListener"||t==="message.toFocussed"){p=false}if(r||n){c[m]={success:r,error:n,onetime:p}}var o={callid:m,method:t,params:s};g.priv.send(o);if(window._forgeDebug){try{o.start=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiRequest(o)}catch(q){}}}else{f.push(arguments);if(!e){e=setTimeout(l,500)}}},send:function(m){throw new Error("Forge error: missing bridge to privileged code")},receive:function(m){if(m.callid){if(typeof c[m.callid]===undefined){k.log("Nothing stored for call ID: "+m.callid)}var o=c[m.callid];var n=(typeof m.content==="undefined"?null:m.content);if(o&&o[m.status]){o[m.status](m.content)}if(o&&o.onetime){delete c[m.callid]}if(window._forgeDebug){try{m.end=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiResponse(m)}catch(p){}}}else{if(m.event){if(g.listeners[m.event]){g.listeners[m.event].forEach(function(q){if(m.params){q(m.params)}else{q()}})}if(g.listeners["*"]){g.listeners["*"].forEach(function(q){if(m.params){q(m.event,m.params)}else{q(m.event)}})}if(window._forgeDebug){try{m.start=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiEvent(m)}catch(p){}}}}}};g.addEventListener=function(m,n){if(g.listeners[m]){g.listeners[m].push(n)}else{g.listeners[m]=[n]}};g.generateQueryString=function(n){if(!n){return""}if(!(n instanceof Object)){return new String(n).toString()}var o=[];var m=function(t,s){if(t===null){return}else{if(t instanceof Array){var q=0;for(var p in t){var r=(s?s:"")+"["+q+"]";q+=1;if(!t.hasOwnProperty(p)){continue}m(t[p],r)}}else{if(t instanceof Object){for(var p in t){if(!t.hasOwnProperty(p)){continue}var r=p;if(s){r=s+"["+p+"]"}m(t[p],r)}}else{o.push(encodeURIComponent(s)+"="+encodeURIComponent(t))}}}};m(n);return o.join("&").replace("%20","+")};g.generateMultipartString=function(n,p){if(typeof n==="string"){return""}var o="";for(var m in n){if(!n.hasOwnProperty(m)){continue}if(n[m]===null){continue}o+="--"+p+"\r\n";o+='Content-Disposition: form-data; name="'+m.replace('"','\\"')+'"\r\n\r\n';o+=n[m].toString()+"\r\n"}return o};g.generateURI=function(n,m){var o="";if(n.indexOf("?")!==-1){o+=n.split("?")[1]+"&";n=n.split("?")[0]}o+=this.generateQueryString(m)+"&";o=o.substring(0,o.length-1);return n+(o?"?"+o:"")};g.disabledModule=function(m,n){var o="The '"+n+"' module is disabled for this app, enable it in your app config and rebuild in order to use this function";k.logging.error(o);m&&m({message:o,type:"UNAVAILABLE",subtype:"DISABLED_MODULE"})};k.enableDebug=function(){g.debug=true;g.priv.call("internal.showDebugWarning",{},null,null);g.priv.call("internal.hideDebugWarning",{},null,null)};setTimeout(function(){if(window.forge&&window.forge.debug){alert("Warning!\n\n'forge.debug = true;' is no longer supported\n\nUse 'forge.enableDebug();' instead.")}},3000);k.barcode={scan:function(n,m){g.disabledModule(m,"barcode")}};k.button={setIcon:function(n,o,m){g.disabledModule(m,"button")},setURL:function(n,o,m){g.disabledModule(m,"button")},onClicked:{addListener:function(m){g.disabledModule(error,"button")}},setBadge:function(n,o,m){g.disabledModule(m,"button")},setBadgeBackgroundColor:function(n,o,m){g.disabledModule(m,"button")},setTitle:function(o,n,m){g.disabledModule(m,"button")}};k.calendar={addEvent:function(n,m){g.disabledModule(m,"calendar")}};k.contact={select:function(n,m){g.priv.call("contact.select",{},n,m)},selectById:function(o,n,m){g.priv.call("contact.selectById",{id:o},n,m)},selectAll:function(n,m){g.priv.call("contact.selectAll",{},n,m)}};k.display={orientation:{forcePortrait:function(n,m){g.priv.call("display.orientation_forcePortrait",{},n,m)},forceLandscape:function(n,m){g.priv.call("display.orientation_forceLandscape",{},n,m)},allowAny:function(n,m){g.priv.call("display.orientation_allowAny",{},n,m)}}};k.document={reload:function(){return document.location.reload()},location:function(n,m){n(document.location)}};var j={};g.currentOrientation=j;g.currentConnectionState=j;g.addEventListener("internal.orientationChange",function(m){if(g.currentOrientation!=m.orientation){g.currentOrientation=m.orientation;g.priv.receive({event:"event.orientationChange"})}});g.addEventListener("internal.connectionStateChange",function(m){if(m.connected!=g.currentConnectionState.connected||m.wifi!=g.currentConnectionState.wifi){g.currentConnectionState=m;g.priv.receive({event:"event.connectionStateChange"})}});k.event={menuPressed:{addListener:function(n,m){g.disabledModule(m,"event")}},backPressed:{addListener:function(n,m){g.disabledModule(m,"event")},preventDefault:function(n,m){g.disabledModule(m,"event")}},messagePushed:{addListener:function(n,m){g.disabledModule(m,"event")}},orientationChange:{addListener:function(n,m){g.disabledModule(m,"event")}},connectionStateChange:{addListener:function(n,m){g.disabledModule(m,"event")}},appPaused:{addListener:function(n,m){g.disabledModule(m,"event")}},appResumed:{addListener:function(n,m){g.disabledModule(m,"event")}}};k.facebook={authorize:function(o,n,p,m){if(typeof o=="function"){m=n;p=o;o=[];n=undefined}else{if(typeof n==="function"){m=p;p=n;n=undefined}}g.priv.call("facebook.authorize",{permissions:o,audience:n,dialog:true},p,m)},hasAuthorized:function(o,n,p,m){if(typeof o=="function"){m=n;p=o;o=[];n=undefined}else{if(typeof n==="function"){m=p;p=n;n=undefined}}g.priv.call("facebook.authorize",{permissions:o,audience:n,dialog:false},p,m)},logout:function(n,m){g.priv.call("facebook.logout",{},n,m)},api:function(o,r,q,p,m){if(typeof r=="function"||arguments.length==1){m=q;p=r;r="GET";q={}}else{if(typeof q=="function"||arguments.length==2){m=p;p=q;q=r;r="GET"}}if(q){for(var n in q){q[n]=String(q[n])}}g.priv.call("facebook.api",{path:o,method:r,params:q},p,m)},ui:function(p,o,m){function n(v){var q={};for(var t in v){if(!v.hasOwnProperty(t)){continue}var s=t.search(/\[\d+\]/);if(s>0){var u=t.substring(0,s),r=t.substring(s+1,t.length-1);if(typeof q[u]==="undefined"){q[u]=[]}q[u][Number(r)]=v[t]}else{q[t]=v[t]}}return q}g.priv.call("facebook.ui",p,function(q){if(o){o(n(q))}},m)}};k.file={getImage:function(n,o,m){if(typeof n==="function"){m=o;o=n;n={}}if(!n){n={}}g.priv.call("file.getImage",n,o&&function(q){var p={uri:q,name:"Image",type:"image"};if(n.width){p.width=n.width}if(n.height){p.height=n.height}o(p)},m)},getVideo:function(n,o,m){if(typeof n==="function"){m=o;o=n;n={}}if(!n){n={}}g.priv.call("file.getVideo",n,o&&function(q){var p={uri:q,name:"Video",type:"video"};o(p)},m)},getLocal:function(n,o,m){k.tools.getURL(n,function(p){o({uri:p,name:n})},m)},base64:function(n,o,m){g.priv.call("file.base64",n,o,m)},string:function(n,o,m){k.request.ajax({url:n.uri,success:o,error:m})},URL:function(o,p,q,n){if(typeof p==="function"){n=q;q=p}var m={};for(prop in o){m[prop]=o[prop]}m.height=p.height||o.height||undefined;m.width=p.width||o.width||undefined;g.priv.call("file.URL",m,q,n)},isFile:function(n,o,m){if(!n||!("uri" in n)){o(false)}else{g.priv.call("file.isFile",n,o,m)}},cacheURL:function(n,o,m){g.priv.call("file.cacheURL",{url:n},o&&function(p){o({uri:p})},m)},saveURL:function(n,o,m){g.priv.call("file.saveURL",{url:n},o&&function(p){o({uri:p})},m)},remove:function(n,o,m){g.priv.call("file.remove",n,o,m)},clearCache:function(n,m){g.priv.call("file.clearCache",{},n,m)}};k.file["getLocal"]=function(n,o,m){g.priv.call("file.getLocal",{name:n},o,m)};k.file["string"]=function(n,o,m){g.priv.call("file.string",n,o,m)};k.flurry={customEvent:function(n,o,p,m){if(typeof o==="function"){m=p;p=o}g.disabledModule(m,"flurry")},startTimedEvent:function(n,o,p,m){if(typeof o==="function"){m=p;p=o}g.disabledModule(m,"flurry")},endCustomEvent:function(n,o,m){g.disabledModule(m,"flurry")},setDemographics:function(n,o,m){g.disabledModule(m,"flurry")},setLocation:function(n,o,m){g.disabledModule(m,"flurry")}};k.geolocation={getCurrentPosition:function(p,o,q){if(typeof(p)==="object"){var n=p,r=o,m=q}else{var r=p,m=o,n=q}return navigator.geolocation.getCurrentPosition(r,m,n)}};k.internal={ping:function(n,o,m){g.priv.call("internal.ping",{data:[n]},o,m)},call:g.priv.call,addEventListener:g.addEventListener};k.is={mobile:function(){return false},desktop:function(){return false},android:function(){return false},ios:function(){return false},chrome:function(){return false},firefox:function(){return false},safari:function(){return false},ie:function(){return false},web:function(){return false},orientation:{portrait:function(){return false},landscape:function(){return false}},connection:{connected:function(){return true},wifi:function(){return true}}};k.is["mobile"]=function(){return true};k.is["android"]=function(){return true};k.is["orientation"]["portrait"]=function(){return g.currentOrientation=="portrait"};k.is["orientation"]["landscape"]=function(){return g.currentOrientation=="landscape"};k.is["connection"]["connected"]=function(){return g.currentConnectionState.connected};k.is["connection"]["wifi"]=function(){return g.currentConnectionState.wifi};k.launchimage={hide:function(n,m){g.priv.call("launchimage.hide",{},n,m)}};if(window.addEventListener){window.addEventListener("load",function(){k.launchimage.hide()},false)}var d=function(s,q,t){var o=[];stylize=function(v,u){return v};function m(u){return u instanceof RegExp||(typeof u==="object"&&Object.prototype.toString.call(u)==="[object RegExp]")}function n(u){return u instanceof Array||Array.isArray(u)||(u&&u!==Object.prototype&&n(u.__proto__))}function p(w){if(w instanceof Date){return true}if(typeof w!=="object"){return false}var u=Date.prototype&&Object.getOwnPropertyNames(Date.prototype);var v=w.__proto__&&Object.getOwnPropertyNames(w.__proto__);return JSON.stringify(v)===JSON.stringify(u)}function r(G,D){try{if(G&&typeof G.inspect==="function"&&!(G.constructor&&G.constructor.prototype===G)){return G.inspect(D)}switch(typeof G){case"undefined":return stylize("undefined","undefined");case"string":var u="'"+JSON.stringify(G).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return stylize(u,"string");case"number":return stylize(""+G,"number");case"boolean":return stylize(""+G,"boolean")}if(G===null){return stylize("null","null")}if(G instanceof Document){return(new XMLSerializer()).serializeToString(G)}var A=Object.keys(G);var H=q?Object.getOwnPropertyNames(G):A;if(typeof G==="function"&&H.length===0){var v=G.name?": "+G.name:"";return stylize("[Function"+v+"]","special")}if(m(G)&&H.length===0){return stylize(""+G,"regexp")}if(p(G)&&H.length===0){return stylize(G.toUTCString(),"date")}var w,E,B;if(n(G)){E="Array";B=["[","]"]}else{E="Object";B=["{","}"]}if(typeof G==="function"){var z=G.name?": "+G.name:"";w=" [Function"+z+"]"}else{w=""}if(m(G)){w=" "+G}if(p(G)){w=" "+G.toUTCString()}if(H.length===0){return B[0]+w+B[1]}if(D<0){if(m(G)){return stylize(""+G,"regexp")}else{return stylize("[Object]","special")}}o.push(G);var y=H.map(function(J){var I,K;if(G.__lookupGetter__){if(G.__lookupGetter__(J)){if(G.__lookupSetter__(J)){K=stylize("[Getter/Setter]","special")}else{K=stylize("[Getter]","special")}}else{if(G.__lookupSetter__(J)){K=stylize("[Setter]","special")}}}if(A.indexOf(J)<0){I="["+J+"]"}if(!K){if(o.indexOf(G[J])<0){if(D===null){K=r(G[J])}else{K=r(G[J],D-1)}if(K.indexOf("\n")>-1){if(n(G)){K=K.split("\n").map(function(L){return"  "+L}).join("\n").substr(2)}else{K="\n"+K.split("\n").map(function(L){return"   "+L}).join("\n")}}}else{K=stylize("[Circular]","special")}}if(typeof I==="undefined"){if(E==="Array"&&J.match(/^\d+$/)){return K}I=JSON.stringify(""+J);if(I.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){I=I.substr(1,I.length-2);I=stylize(I,"name")}else{I=I.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");I=stylize(I,"string")}}return I+": "+K});o.pop();var F=0;var x=y.reduce(function(I,J){F++;if(J.indexOf("\n")>=0){F++}return I+J.length+1},0);if(x>50){y=B[0]+(w===""?"":w+"\n ")+" "+y.join(",\n  ")+" "+B[1]}else{y=B[0]+w+" "+y.join(", ")+" "+B[1]}return y}catch(C){return"[No string representation]"}}return r(s,(typeof t==="undefined"?2:t))};var h=function(n,o){if("logging" in k.config){var m=k.config.logging.marker||"FORGE"}else{var m="FORGE"}n="["+m+"] "+(n.indexOf("\n")===-1?"":"\n")+n;g.priv.call("logging.log",{message:n,level:o});if(typeof console!=="undefined"){switch(o){case 10:if(console.debug!==undefined&&!(console.debug.toString&&console.debug.toString().match("alert"))){console.debug(n)}break;case 30:if(console.warn!==undefined&&!(console.warn.toString&&console.warn.toString().match("alert"))){console.warn(n)}break;case 40:case 50:if(console.error!==undefined&&!(console.error.toString&&console.error.toString().match("alert"))){console.error(n)}break;default:case 20:if(console.info!==undefined&&!(console.info.toString&&console.info.toString().match("alert"))){console.info(n)}break}}};var a=function(m,n){if(m in k.logging.LEVELS){return k.logging.LEVELS[m]}else{k.logging.__logMessage("Unknown configured logging level: "+m);return n}};var b=function(n){var q=function(r){if(r.message){return r.message}else{if(r.description){return r.description}else{return""+r}}};if(n){var p="\nError: "+q(n);try{if(n.lineNumber){p+=" on line number "+n.lineNumber}if(n.fileName){var m=n.fileName;p+=" in file "+m.substr(m.lastIndexOf("/")+1)}}catch(o){}if(n.stack){p+="\r\nStack trace:\r\n"+n.stack}return p}return""};k.logging={LEVELS:{ALL:0,DEBUG:10,INFO:20,WARNING:30,ERROR:40,CRITICAL:50},debug:function(n,m){k.logging.log(n,m,k.logging.LEVELS.DEBUG)},info:function(n,m){k.logging.log(n,m,k.logging.LEVELS.INFO)},warning:function(n,m){k.logging.log(n,m,k.logging.LEVELS.WARNING)},error:function(n,m){k.logging.log(n,m,k.logging.LEVELS.ERROR)},critical:function(n,m){k.logging.log(n,m,k.logging.LEVELS.CRITICAL)},log:function(n,m,q){if(typeof(q)==="undefined"){var q=k.logging.LEVELS.INFO}try{var o=a(k.config.logging.level,k.logging.LEVELS.ALL)}catch(p){var o=k.logging.LEVELS.ALL}if(q>=o){h(d(n,false,10)+b(m),q)}}};k.media={videoPlay:function(n,o,m){if(!n.uri){n={uri:n}}g.priv.call("media.videoPlay",n,o,m)}};k.message={listen:function(n,o,m){g.disabledModule(m,"message")},broadcast:function(n,o,p,m){g.disabledModule(m,"message")},broadcastBackground:function(n,o,p,m){g.disabledModule(m,"message")},toFocussed:function(n,o,p,m){g.disabledModule(m,"message")}};k.notification={create:function(p,o,n,m){g.disabledModule(m,"notification")},setBadgeNumber:function(n,o,m){g.disabledModule(m,"notification")}};k.payments={purchaseProduct:function(n,o,m){g.disabledModule(m,"payments")},restoreTransactions:function(n,m){g.disabledModule(m,"payments")},transactionReceived:{addListener:function(n,m){g.disabledModule(m,"payments")}}};k.prefs={get:function(n,o,m){g.priv.call("prefs.get",{key:n.toString()},o&&function(p){if(p==="undefined"){p=undefined}else{try{p=JSON.parse(p)}catch(q){m({message:q.toString()});return}}o(p)},m)},set:function(n,o,p,m){if(o===undefined){o="undefined"}else{o=JSON.stringify(o)}g.priv.call("prefs.set",{key:n.toString(),value:o},p,m)},keys:function(n,m){g.priv.call("prefs.keys",{},n,m)},all:function(n,m){var n=n&&function(o){for(key in o){if(o[key]==="undefined"){o[key]=undefined}else{o[key]=JSON.parse(o[key])}}n(o)};g.priv.call("prefs.all",{},n,m)},clear:function(n,o,m){g.priv.call("prefs.clear",{key:n.toString()},o,m)},clearAll:function(n,m){g.priv.call("prefs.clearAll",{},n,m)}};k.reload={updateAvailable:function(n,m){g.priv.call("reload.updateAvailable",{},n,m)},update:function(n,m){g.priv.call("reload.update",{},n,m)},applyNow:function(n,m){k.logging.error("reload.applyNow has been disabled, please see docs.trigger.io for more information.");m({message:"reload.applyNow has been disabled, please see docs.trigger.io for more information.",type:"UNAVAILABLE"})},switchStream:function(n,o,m){g.priv.call("reload.switchStream",{streamid:n},o,m)},updateReady:{addListener:function(n,m){g.addEventListener("reload.updateReady",n)}}};k.request={get:function(n,o,m){k.request.ajax({url:n,dataType:"text",success:o&&function(){try{arguments[0]=JSON.parse(arguments[0])}catch(p){}o.apply(this,arguments)},error:m})}};k.request["ajax"]=function(o){var s=(o.files?o.files:null);var B=(o.fileUploadMethod?o.fileUploadMethod:"multipart");var r=(o.url?o.url:null);var t=(o.success?o.success:undefined);var A=(o.error?o.error:undefined);var q=(o.username?o.username:null);var m=(o.password?o.password:null);var F=(o.accepts?o.accepts:["*/*"]);var x=(o.cache?o.cache:false);var D=(o.contentType?o.contentType:null);var G=(o.data?o.data:null);var z=(o.dataType?o.dataType:null);var n=(o.headers?o.headers:{});var u=(o.timeout?o.timeout:60000);var p=(o.type?o.type:"GET");if(typeof F==="string"){F=[F]}var C=null;if(s){p="POST";if(B=="multipart"){C=k.tools.UUID().replace(/-/g,"");G=g.generateMultipartString(G,C);D="multipart/form-data; boundary="+C}else{if(B=="raw"){if(s.length>1){k.logging.warning("Only one file can be uploaded at once with type 'raw'");s=[s[0]]}G=null;D="image/jpg"}}}else{if(p=="GET"){r=g.generateURI(r,G);G=null}else{if(G){G=g.generateQueryString(G);if(!D){D="application/x-www-form-urlencoded"}}}}if(x){x={};x["wm"+Math.random()]=Math.random();r=g.generateURI(r,x)}if(F){n.Accept=F.join(",")}if(D){n["Content-Type"]=D}var y={};if(window._forgeDebug){try{y.id=k.tools.UUID();y.fromUrl=window.location.href;y.reqTime=(new Date()).getTime()/1000;y.method=p;y.data=G;y.url=r;_forgeDebug.wi.NetworkNotify.identifierForInitialRequest(y.id,y.url,{url:y.fromUrl,frameId:0,loaderId:0},[]);_forgeDebug.wi.NetworkNotify.willSendRequest(y.id,y.reqTime,{url:y.url,httpMethod:y.method,httpHeaderFields:{},requestFormData:y.data},{isNull:true})}catch(E){}}var w=false;var v=setTimeout(function(){if(w){return}w=true;if(window._forgeDebug){try{y.respTime=(new Date()).getTime()/1000;y.respText=G;_forgeDebug.wi.NetworkNotify.didReceiveResponse(y.id,y.reqTime,"XHR",{mimeType:"Unknown",textEncodingName:"",httpStatusCode:1,httpStatusText:"Failure",httpHeaderFields:{},connectionReused:false,connectionID:0,wasCached:false});_forgeDebug.wi.NetworkNotify.setInitialContent(y.id,y.respText,"XHR");_forgeDebug.wi.NetworkNotify.didFinishLoading(y.id,y.respTime)}catch(H){}}A&&A({message:"Request timed out",type:"EXPECTED_FAILURE"})},u);g.priv.call("request.ajax",{url:r,username:q,password:m,data:G,headers:n,timeout:u,type:p,boundary:C,files:s,fileUploadMethod:B},function(J){clearTimeout(v);if(w){return}w=true;if(window._forgeDebug){try{y.respTime=(new Date()).getTime()/1000;y.respText=J;_forgeDebug.wi.NetworkNotify.didReceiveResponse(y.id,y.reqTime,"XHR",{mimeType:"Unknown",textEncodingName:"",httpStatusCode:1,httpStatusText:"Success",httpHeaderFields:{},connectionReused:false,connectionID:0,wasCached:false});_forgeDebug.wi.NetworkNotify.setInitialContent(y.id,y.respText,"XHR");_forgeDebug.wi.NetworkNotify.didFinishLoading(y.id,y.respTime)}catch(K){}}try{if(z=="xml"){var I,H;if(window.DOMParser){I=new DOMParser();H=I.parseFromString(J,"text/xml")}else{H=new ActiveXObject("Microsoft.XMLDOM");H.async="false";H.loadXML(J)}J=H}else{if(z=="json"){J=JSON.parse(J)}}}catch(K){}t&&t(J)},function(){clearTimeout(v);if(w){return}w=true;if(window._forgeDebug){try{y.respTime=(new Date()).getTime()/1000;y.respText=G;_forgeDebug.wi.NetworkNotify.didReceiveResponse(y.id,y.reqTime,"XHR",{mimeType:"Unknown",textEncodingName:"",httpStatusCode:1,httpStatusText:"Failure",httpHeaderFields:{},connectionReused:false,connectionID:0,wasCached:false});_forgeDebug.wi.NetworkNotify.setInitialContent(y.id,y.respText,"XHR");_forgeDebug.wi.NetworkNotify.didFinishLoading(y.id,y.respTime)}catch(H){}}A&&A.apply(this,arguments)})};k.sms={send:function(o,n,m){g.disabledModule(m,"sms")}};k.tabbar={show:function(n,m){g.disabledModule(m,"tabbar")},hide:function(n,m){g.disabledModule(m,"tabbar")},addButton:function(o,n,m){g.disabledModule(m,"tabbar")},removeButtons:function(n,m){g.disabledModule(m,"tabbar")},setTint:function(m,o,n){g.disabledModule(n,"tabbar")},setActiveTint:function(m,o,n){g.disabledModule(n,"tabbar")},setInactive:function(n,m){g.disabledModule(m,"tabbar")}};k.tabs={open:function(n,o,p,m){if(typeof o==="function"){m=p;p=o;o=false}g.disabledModule(m,"tabs")},openWithOptions:function(n,o,m){g.disabledModule(m,"tabs")},closeCurrent:function(m){g.disabledModule(m,"tabs")}};k.tools={UUID:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(o){var n=Math.random()*16|0;var m=o=="x"?n:(n&3|8);return m.toString(16)}).toUpperCase()},getURL:function(n,o,m){g.priv.call("tools.getURL",{name:n.toString()},o,m)}};k.topbar={show:function(n,m){g.priv.call("topbar.show",{},n,m)},hide:function(n,m){g.priv.call("topbar.hide",{},n,m)},setTitle:function(o,n,m){g.priv.call("topbar.setTitle",{title:o},n,m)},setTitleImage:function(n,o,m){if(n&&n[0]==="/"){n=n.substr(1)}g.priv.call("topbar.setTitleImage",{icon:n},o,m)},setTint:function(m,o,n){g.priv.call("topbar.setTint",{color:m},o,n)},addButton:function(n,o,m){if(n.icon&&n.icon[0]==="/"){n.icon=n.icon.substr(1)}g.priv.call("topbar.addButton",n,function(p){o&&g.addEventListener("topbar.buttonPressed."+p,o)},m)},removeButtons:function(n,m){g.priv.call("topbar.removeButtons",{},n,m)},homePressed:{addListener:function(n,m){g.addEventListener("topbar.homePressed",n)}}};k.ui={enhanceInput:function(m,o,n){g.disabledModule(n,"ui")},enhanceAllInputs:function(n,m){g.disabledModule(m,"ui")}};k.urlhandler={urlLoaded:{addListener:function(n,m){g.disabledModule(m,"urlhandler")}}};g.priv.send=function(n){if(window.__forge["callJavaFromJavaScript"]===undefined){return}var m=((n.params!==undefined)?JSON.stringify(n.params):"");window.__forge["callJavaFromJavaScript"](n.callid,n.method,m)};g.priv.send({callid:"ready",method:""});k._receive=g.priv.receive;window.forge=k;window.forge["reload"]={updateAvailable:k.reload.updateAvailable,update:k.reload.update,applyNow:k.reload.applyNow,switchStream:k.reload.switchStream,updateReady:{addListener:k.reload.updateReady.addListener}};window.forge["ajax"]=k.request.ajax;window.forge["getPage"]=k.request.get;window.forge["createNotification"]=k.notification.create;window.forge["UUID"]=k.tools.UUID;window.forge["getURL"]=k.tools.getURL;window.forge["log"]=k.logging.log;window.forge["button"]["setUrl"]=k.button.setURL;window.forge["button"]["setBadgeText"]=k.button.setBadge;window.forge["file"]["delete"]=k.file.remove;window.forge["file"]["imageURL"]=k.file.URL})();