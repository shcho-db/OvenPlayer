import _ from "utils/underscore";
import {
    CONTENT_TIME_MODE_CHANGED
} from "api/constants";

/**
 * @brief   This initializes the input options.
 * @param   options
 *
 * */
const Configurator = function(options, provider){
    //sources, tracks,


    const composeSourceOptions = function(options){
        const Defaults = {
            playbackRates: [2, 1.5, 1, 0.5, 0.25],
            playbackRate: 1,
            mute: false,
            volume: 100,
            loop : false,
            controls : true,
            autoStart : false,
            timecode : true
        };
        const serialize = function (val) {
            if (val === undefined) {
                return null;
            }
            if (typeof val === 'string' && val.length < 6) {
                const lowercaseVal = val.toLowerCase();
                if (lowercaseVal === 'true') {
                    return true;
                }
                if (lowercaseVal === 'false') {
                    return false;
                }
                if (!isNaN(Number(val)) && !isNaN(parseFloat(val))) {
                    return Number(val);
                }
            }
            return val;
        }
        const deserialize = function (options) {
            Object.keys(options).forEach((key) => {
                if (key === 'id') {
                    return;
                }
                options[key] = serialize(options[key]);
            });
        }

        deserialize(options);
        let config = Object.assign({}, Defaults, options);

        let playbackRates = config.playbackRates;

        playbackRates = playbackRates.filter(rate => _.isNumber(rate) && rate >= 0.25 && rate <= 4).map(rate => Math.round(rate * 4) / 4);

        if (playbackRates.indexOf(1) < 0) {
            playbackRates.push(1);
        }
        playbackRates.sort();

        config.playbackRates = playbackRates;


        if (config.playbackRates.indexOf(config.playbackRate) < 0) {
            config.playbackRate = 1;
        }

        const configPlaylist = config.playlist;
        if (!configPlaylist) {
            const obj = _.pick(config, [
                'title',
                'description',
                'type',
                'image',
                'file',
                'sources',
                'tracks',
                'host',
                'application',
                'stream'
            ]);

            config.playlist = [ obj ];
        } else if (_.isArray(configPlaylist.playlist)) {
            config.feedData = configPlaylist;
            config.playlist = configPlaylist.playlist;
        }

        delete config.duration;
        return config;
    };
    OvenPlayerConsole.log("Configurator loaded.", options);
    let spec = composeSourceOptions(options);


    const that = {};
    that.getConfig = () => {
        return spec;
    };
    that.setConfig = (config, value) => {
        spec[config] = value;
    };

    that.getPlaybackRate =()=>{
        return spec.playbackRate;
    };
    that.setPlaybackRate =(playbackRate)=>{
        spec.playbackRate = playbackRate;
        return playbackRate;
    };

    that.getQualityLabel = () => {
        return spec.qualityLabel;
    };
    that.setQualityLabel = (newLabel) => {
        spec.qualityLabel = newLabel;
    };

    that.getSourceLabel = () => {
        return spec.sourceLabel;
    };
    that.setSourceLabel = (newLabel) => {
        spec.sourceLabel = newLabel;
    };

    that.setTimecodeMode = (timecode) => {
        if(spec.timecode !== timecode){
            spec.timecode = timecode;
            provider.trigger(CONTENT_TIME_MODE_CHANGED, timecode);
        }
    };
    that.isTimecodeMode = () => {
        return spec.timecode;
    };

    that.isMute = () =>{
        return spec.mute;
    };
    that.getVolume = () =>{
        return spec.volume;
    };
    that.isLoop = () =>{
        return spec.loop;
    };
    that.isAutoStart = () =>{
        return spec.autoStart;
    };
    that.isControls = () =>{
        return spec.controls;
    };

    that.getPlaybackRates =()=>{
        return spec.playbackRates;
    };

    that.getPlaylist =()=>{
        return spec.playlist;
    };
    that.setPlaylist =(playlist)=>{
        if(_.isArray(playlist)){
            spec.playlist = playlist;
        }else{
            spec.playlist = [playlist];
        }
        return spec.playlist;
    };

    return that;
};

export default Configurator;
