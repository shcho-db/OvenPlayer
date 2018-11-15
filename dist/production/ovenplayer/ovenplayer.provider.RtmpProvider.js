/*! For license information please see ovenplayer.provider.RtmpProvider.js.LICENSE */
(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{119:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.getBrowser=function(){if(-1!=(navigator.userAgent.indexOf("Opera")||navigator.userAgent.indexOf("OPR")))return"opera";if(-1!=navigator.userAgent.indexOf("Chrome"))return"chrome";if(-1!=navigator.userAgent.indexOf("Safari"))return"safari";if(-1!=navigator.userAgent.indexOf("Firefox"))return"firefox";if(-1!=navigator.userAgent.indexOf("MSIE")){navigator.userAgent.indexOf("MSIE");return function(){for(var e=3,t=document.createElement("div"),n=t.getElementsByTagName("i");t.innerHTML="\x3c!--[if gt IE "+ ++e+"]><i></i><![endif]--\x3e",n[0];);return e>4?e:void 0}()<9?"oldIE":"modernIE"}return"unknown"}},282:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pickCurrentSource=t.errorTrigger=t.separateLive=t.extractVideoElement=void 0;var r=n(8),u=function(e){return e&&e.__esModule?e:{default:e}}(n(6));t.extractVideoElement=function(e){return u.default.isElement(e)?e:e.getVideoElement?e.getVideoElement():e.media?e.media:null},t.separateLive=function(e){return!!e.isDynamic&&e.isDynamic()},t.errorTrigger=function(e,t){t.setState(r.STATE_ERROR),t.pause(),t.trigger(r.ERROR,e)},t.pickCurrentSource=function(e,t,n){var r=Math.max(0,t);if(e)for(var u=0;u<e.length;u++)if(e[u].default&&(r=u),n.getSourceLabel()&&e[u].label===n.getSourceLabel())return u;return r}},283:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(119),u=n(8),i=function(e){return e&&e.__esModule?e:{default:e}}(n(284));t.default=function(e,t){var n={},a=e.getAttribute("data-parent-id"),o="",l=(0,r.getBrowser)();OvenPlayerConsole.log("MediaManager loaded. browserType : "+l);return n.create=function(){return OvenPlayerConsole.log("MediaManager createElement()"),o&&n.destroy(),function(){if(t!==u.PROVIDER_RTMP)(o=document.createElement("video")).setAttribute("disableRemotePlayback",""),o.setAttribute("webkit-playsinline",""),o.setAttribute("playsinline",""),e.appendChild(o);else{var n=void 0,r=void 0,s=void 0,c=void 0,d=void 0,f=void 0,g=void 0,m=void 0,v=void 0;(n=document.createElement("param")).setAttribute("name","movie"),n.setAttribute("value",i.default),(r=document.createElement("param")).setAttribute("name","flashvars"),r.setAttribute("value","playerId="+a),(s=document.createElement("param")).setAttribute("name","allowscriptaccess"),s.setAttribute("value","always"),(c=document.createElement("param")).setAttribute("name","allowfullscreen"),c.setAttribute("value","true"),(d=document.createElement("param")).setAttribute("name","quality"),d.setAttribute("value","height"),(f=document.createElement("param")).setAttribute("name","name"),f.setAttribute("value",a+"-flash"),(g=document.createElement("param")).setAttribute("name","menu"),g.setAttribute("value","false"),(m=document.createElement("param")).setAttribute("name","quality"),m.setAttribute("value","high"),(v=document.createElement("param")).setAttribute("name","bgcolor"),v.setAttribute("value","#000000"),(o=document.createElement("object")).setAttribute("id",a+"-flash"),o.setAttribute("name",a+"-flash"),o.setAttribute("width","100%"),o.setAttribute("height","100%"),"oldIE"!==l?(o.setAttribute("data",i.default),o.setAttribute("type","application/x-shockwave-flash")):(o.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"),o.appendChild(n)),o.appendChild(v),o.appendChild(m),o.appendChild(c),o.appendChild(s),o.appendChild(r),e.appendChild(o)}return o}()},n.destroy=function(){OvenPlayerConsole.log("MediaManager removeElement()"),e.removeChild(o),o=null},n}},284:function(e,t,n){e.exports=n.p+"OvenPlayerFlash.swf"},289:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o(n(60)),u=o(n(290)),i=n(282),a=n(8);function o(e){return e&&e.__esModule?e:{default:e}}t.default=function(e,t){OvenPlayerConsole.log("CORE loaded. ");var n={};(0,r.default)(n);var o=(0,u.default)(e.extendedElement,n),l=(0,i.extractVideoElement)(e.extendedElement),s=function(t){var r=e.sources[e.currentSource];OvenPlayerConsole.log("source loaded : ",r,"lastPlayPosition : "+t);var u=l.getCurrentSource();r.file!==u?l.load(r.file):0===t&&n.getPosition()>0&&n.seek(t),t>0&&(n.seek(t),n.play())};return n.triggerEventFromExternal=function(e,t){return o[e]?o[e](t):null},n.getName=function(){return e.name},n.canSeek=function(){return e.canSeek},n.setCanSeek=function(t){e.canSeek=t},n.isSeeking=function(){return e.seeking},n.setSeeking=function(t){e.seeking=t},n.setState=function(t){e.state=t},n.getState=function(){return e.state},n.setBuffer=function(e){},n.getBuffer=function(){return l.getBuffer?l.getBuffer():null},n.getDuration=function(){return l.getDuration?l.getDuration():0},n.getPosition=function(){return l.getPosition?l.getPosition():0},n.setVolume=function(e){return l.setVolume?l.setVolume(e):0},n.getVolume=function(){return l.setVolume?l.getVolume():0},n.setMute=function(){l.setMute()},n.getMute=function(){return!!l.getMute&&l.getMute()},n.preload=function(n,r){OvenPlayerConsole.log("CORE : preload() ",n,r);var u=0;return e.sources=n,e.currentSource=(0,i.pickCurrentSource)(n,e.currentSource,t),new Promise(function(e,t){!function n(){return u++,l.isFlashReady&&l.isFlashReady()?(s(r||0),e()):u<100?void setTimeout(n,100):t()}()})},n.load=function(n){e.sources=n,e.currentSource=(0,i.pickCurrentSource)(n,e.currentSource,t),s(e.sources_.starttime||0)},n.play=function(){l.play&&l.play()},n.pause=function(){l.pause&&l.pause()},n.seek=function(e){l.seek(e)},n.setPlaybackRate=function(e){return 0},n.getPlaybackRate=function(){return 0},n.getSources=function(){return l?e.sources.map(function(e,t){return{file:e.file,type:e.type,label:e.label,index:t}}):[]},n.getCurrentSource=function(){return e.currentSource},n.setCurrentSource=function(r,u){return e.currentQuality!==r&&(r>-1&&e.sources&&e.sources.length>r?(n.setState(a.STATE_IDLE),OvenPlayerConsole.log("source changed : "+r),e.currentSource=r,n.trigger(a.CONTENT_SOURCE_CHANGED,{currentSource:r}),t.setSourceLabel(e.sources[r].label),u&&s(l.getCurrentTime()||0),e.currentSource):void 0)},n.getQualityLevels=function(){return l?e.qualityLevels:[]},n.getCurrentQuality=function(){return l?e.currentQuality:null},n.setCurrentQuality=function(e){},n.isAutoQuality=function(){},n.setAutoQuality=function(e){},n.stop=function(){OvenPlayerConsole.log("CORE : stop() "),l.stop()},n.destroy=function(){OvenPlayerConsole.log("CORE : destroy() player stop, listener, event destroied"),l.remove()},n.super=function(e){var t=n[e];return function(){return t.apply(n,arguments)}},n}},290:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(8);t.default=function(e,t){var n={isJSReady:function(){return!0},time:function(e){t.trigger(r.CONTENT_TIME,e),t.trigger(r.CONTENT_BUFFER,e)},volumeChanged:function(e){t.trigger(r.CONTENT_VOLUME,e)},stateChanged:function(e){t.setState(e.newstate),t.trigger(r.PLAYER_STATE,e)},metaChanged:function(e){t.trigger(r.CONTENT_META,e)},error:function(e){t.setState(r.STATE_ERROR),t.pause(),t.trigger(r.ERROR,e)}};return n}},66:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(n(283)),u=n(8),i=a(n(289));function a(e){return e&&e.__esModule?e:{default:e}}t.default=function(e,t){var n={},a=null,o=(0,r.default)(e,u.PROVIDER_RTMP),l=o.create(),s={name:u.PROVIDER_RTMP,extendedElement:l,listener:null,canSeek:!1,isLive:!1,seeking:!1,state:u.STATE_IDLE,buffer:0,currentQuality:-1,currentSource:-1,qualityLevels:[],sources:[]};return n=(0,i.default)(s,t,null),a=n.super("destroy"),OvenPlayerConsole.log("RTMP PROVIDER LOADED."),n.destroy=function(){o.destroy(),o=null,l=null,OvenPlayerConsole.log("RTMP : PROVIDER DESTROYED."),a()},n}}}]);
//# sourceMappingURL=ovenplayer.provider.RtmpProvider.js.map