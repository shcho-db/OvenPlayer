import {extractExtension} from "utils/strings";

export const isRtmp = function (file, type) {
    return (file.indexOf('rtmp:') == 0 || type == 'rtmp');
};
export const isWebRTC = function (file, type) {
    if(file){
        return (file.indexOf('ws:') === 0 || file.indexOf('wss:') === 0 || type === 'webrtc');
    }
    return false;
};
export const isDash = function (file, type) {
    return ( type === 'mpd' ||  type === 'dash' || type === 'application/dash+xml' || extractExtension(file) == 'mpd');
};
