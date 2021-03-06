import CaptionManager from "api/caption/Manager";
import Configurator from "api/Configurator";
import EventEmitter from "api/EventEmitter";
import LazyCommandExecutor from "api/LazyCommandExecutor";
import PlaylistManager from "api/playlist/Manager";
import ProviderController from "api/provider/Controller";
import {READY, ERRORS, ERROR, CONTENT_TIME_MODE_CHANGED, INIT_UNKNWON_ERROR, INIT_UNSUPPORT_ERROR, DESTROY, NETWORK_UNSTABLED,
    PLAYER_FILE_ERROR, PROVIDER_DASH, PROVIDER_HLS, PROVIDER_WEBRTC, PROVIDER_HTML5, PROVIDER_RTMP} from "api/constants";
import {version} from 'version';
import {ApiRtmpExpansion} from 'api/ApiExpansions';

/**
 * @brief   This object connects UI to the provider.
 * @param   {object}    container  dom element
 *
 * */

const Api = function(container){
    const that = {};
    EventEmitter(that);


    OvenPlayerConsole.log("[[OvenPlayer]] v."+ version);
    OvenPlayerConsole.log("API loaded.");

    let playlistManager = PlaylistManager();
    let providerController = ProviderController();
    let currentProvider = "";
    let playerConfig = "";
    let lazyQueue = "";
    let captionManager = "";

    const initProvider = function(lastPlayPosition){
        const pickQualityFromSource = (sources) =>{
            var quality = 0;
            if (sources) {
                for (var i = 0; i < sources.length; i++) {
                    if (sources[i].default) {
                        quality = i;
                    }
                    if (playerConfig.getSourceLabel() && sources[i].label === playerConfig.getSourceLabel() ) {
                        return i;
                    }
                }
            }
            return quality;
        };

        return providerController.loadProviders(playlistManager.getPlaylist()).then(Providers => {
            if(Providers.length < 1){
                throw ERRORS[INIT_UNSUPPORT_ERROR];
            }

            if(currentProvider){
                currentProvider.destroy();
                currentProvider = null;
            }


            let currentSourceIndex = pickQualityFromSource(playlistManager.getCurrentSources());
            OvenPlayerConsole.log( "current source index : "+ currentSourceIndex);

            //Call Provider.
            currentProvider = Providers[currentSourceIndex](container, playerConfig);


            if(currentProvider.getName() === PROVIDER_RTMP){
                //If provider type is RTMP, we accepts RtmpExpansion.
                Object.assign(that, ApiRtmpExpansion(currentProvider));
            }

            //This passes the event created by the Provider to API.
            currentProvider.on("all", function(name, data){

                that.trigger(name, data);

                //Auto switching next source when player load failed by amiss source.
                //data.code === PLAYER_FILE_ERROR
                if( name === ERROR || name === NETWORK_UNSTABLED ){
                    let currentSourceIndex = that.getCurrentSource();
                    if(currentSourceIndex+1 < that.getSources().length){
                        //this sequential has available source.
                        that.pause();

                        that.setCurrentSource(currentSourceIndex+1);
                    }
                }
            });

        }).then(()=>{

            //provider's preload() have to made Promise. Cuz it overcomes 'flash loading timing problem'.
            currentProvider.preload(playlistManager.getCurrentSources(), lastPlayPosition ).then(function(){
                lazyQueue.flush();
                //This is no reason to exist anymore.
                lazyQueue.destroy();

                that.trigger(READY);
            }).catch((error) => {
                if(error && error.code && ERRORS[error.code]){
                    that.trigger(ERROR, ERRORS[error.code]);
                }else {
                    let tempError = ERRORS[INIT_UNKNWON_ERROR];
                    tempError.error = error;
                    that.trigger(ERROR, tempError);
                }
            });
        }).catch((error) => {
            //INIT ERROR
            if(error && error.code && ERRORS[error.code]){
                that.trigger(ERROR, ERRORS[error.code]);
            }else {
                let tempError = ERRORS[INIT_UNKNWON_ERROR];
                tempError.error = error;
                that.trigger(ERROR, tempError);
            }

            //xxx : If you init empty sources. (I think this is strange case.)
            //This works for this case.
            //player = OvenPlayer.create("elId", {});
            //player.load(soruces);
            lazyQueue.off();
            //lazyQueue.removeAndExcuteOnce("load");
        });
    };


    /**
     * API 초기화 함수
     * init
     * @param      {object} options player initial option value.
     * @returns
     **/
    that.init = (options) =>{
        //It collects the commands and executes them at the time when they are executable.
        lazyQueue = LazyCommandExecutor(that, [
            'load','play','pause','seek','stop', 'getDuration', 'getPosition', 'getVolume'
            , 'getMute', 'getBuffer', 'getState' , 'getQualityLevels'
        ]);
        playerConfig = Configurator(options, that);
        OvenPlayerConsole.log("API : init()");
        OvenPlayerConsole.log("API : init() config : ", playerConfig);

        playlistManager.setPlaylist(playerConfig.getPlaylist());
        OvenPlayerConsole.log("API : init() sources : " , playlistManager.getCurrentSources());


        captionManager = CaptionManager(that);
        OvenPlayerConsole.log("API : init() captions");

        initProvider();
    };
    that.getConfig = () => {
        OvenPlayerConsole.log("API : getConfig()", playerConfig.getConfig());
        return playerConfig.getConfig();
    };
    that.setTimecodeMode = (isShow) =>{
        OvenPlayerConsole.log("API : setTimecodeMode()", isShow);
        playerConfig.setTimecodeMode(isShow);
    };
    that.isTimecodeMode = () => {
        OvenPlayerConsole.log("API : isTimecodeMode()");
        return playerConfig.isTimecodeMode();
    };
    that.getFramerate = () => {
        OvenPlayerConsole.log("API : getFramerate()", currentProvider.getFramerate());
        return currentProvider.getFramerate();
    };
    that.seekFrame = (frameCount) => {
        if(!currentProvider){return null;}
        OvenPlayerConsole.log("API : seekFrame()", frameCount);
        return currentProvider.seekFrame(frameCount);
    };

    that.getDuration = () => {
        if(!currentProvider){return null;}
        OvenPlayerConsole.log("API : getDuration()", currentProvider.getDuration());
        return currentProvider.getDuration();
    };
    that.getPosition = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getPosition()", currentProvider.getPosition());
        return currentProvider.getPosition();
    };
    that.getVolume = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getVolume()", currentProvider.getVolume());
        return currentProvider.getVolume();
    };
    that.setVolume = (volume) => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : setVolume() " + volume);
        currentProvider.setVolume(volume);
    };
    that.setMute = (state) => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : setMute() " + state);
        return currentProvider.setMute(state);
    };
    that.getMute = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getMute() " + currentProvider.getMute());
        return currentProvider.getMute();
    };
    that.load = (playlist) => {
        OvenPlayerConsole.log("API : load() ", playlist);
        lazyQueue = LazyCommandExecutor(that, ['play','seek','stop']);

        if(playlist){
            if(currentProvider){
                currentProvider.setCurrentQuality(0);
            }
            playlistManager.setPlaylist(playlist);
        }
        return initProvider();

    };
    that.play = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : play() ");
        currentProvider.play();
    }
    that.pause = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : pause() ");
        currentProvider.pause();
    };
    that.seek = (position) => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : seek() "+ position);
        currentProvider.seek(position);
    };
    that.setPlaybackRate = (playbackRate) =>{
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : setPlaybackRate() ", playbackRate);
        return currentProvider.setPlaybackRate(playerConfig.setPlaybackRate(playbackRate));
    };
    that.getPlaybackRate = () =>{
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getPlaybackRate() ", currentProvider.getPlaybackRate());
        return currentProvider.getPlaybackRate();
    };

    that.getSources = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getSources() ", currentProvider.getSources());
        return currentProvider.getSources();
    };
    that.getCurrentSource = () =>{
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getCurrentSource() ", currentProvider.getCurrentSource());
        return currentProvider.getCurrentSource();
    };
    that.setCurrentSource = (sourceIndex) =>{
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : setCurrentSource() ", sourceIndex);

        let sources = currentProvider.getSources();
        let currentSource = sources[currentProvider.getCurrentSource()];
        let newSource = sources[sourceIndex];
        let lastPlayPosition = currentProvider.getPosition();
        let isSameProvider = providerController.isSameProvider(currentSource, newSource);
        // provider.serCurrentQuality -> playerConfig setting -> load
        let resultSourceIndex = currentProvider.setCurrentSource(sourceIndex, isSameProvider);

        if(!newSource){
            return null;
        }

        OvenPlayerConsole.log("API : setCurrentQuality() isSameProvider", isSameProvider);

        if(!isSameProvider){
            lazyQueue = LazyCommandExecutor(that, ['play']);
            initProvider(lastPlayPosition);
        }

        return resultSourceIndex;
    };



    that.getQualityLevels = () =>{
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getQualityLevels() ", currentProvider.getQualityLevels());
        return currentProvider.getQualityLevels();
    };
    that.getCurrentQuality = () =>{
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : getCurrentQuality() ", currentProvider.getCurrentQuality());
        return currentProvider.getCurrentQuality();
    };
    that.setCurrentQuality = (qualityIndex) =>{
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : setCurrentQuality() ", qualityIndex);

        return currentProvider.setCurrentQuality(qualityIndex);
    };
    that.isAutoQuality = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : isAutoQuality()");
        return currentProvider.isAutoQuality();
    };
    that.setAutoQuality = (isAuto) => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : setAutoQuality() ", isAuto);
        return currentProvider.setAutoQuality(isAuto);
    }

    that.getCaptionList = () => {
        OvenPlayerConsole.log("API : getCaptionList() ", captionManager.getCaptionList());
        return captionManager.getCaptionList();
    }
    that.getCurrentCaption = () => {
        OvenPlayerConsole.log("API : getCurrentCaption() ", captionManager.getCurrentCaption());
        return captionManager.getCurrentCaption();
    }
    that.setCurrentCaption = (index) => {
        OvenPlayerConsole.log("API : setCurrentCaption() ", index);
        captionManager.setCurrentCaption(index);
    }
    that.addCaption = (track) => {
        OvenPlayerConsole.log("API : addCaption() ")
        return captionManager.addCaption(track);
    }
    that.removeCaption = (index) => {
        OvenPlayerConsole.log("API : removeCaption() ", index)
        return captionManager.removeCaption(index);
    }

    that.getBuffer = () => {
        if(!currentProvider){return null;}
        OvenPlayerConsole.log("API : getBuffer() ", currentProvider.getBuffer());
        currentProvider.getBuffer();
    };
    that.getState = () => {
        if(!currentProvider){return null;}
        OvenPlayerConsole.log("API : getState() ", currentProvider.getState());
        return currentProvider.getState();
    };
    that.stop = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : stop() ");
        currentProvider.stop();
    };
    that.remove = () => {
        if(!currentProvider){return null;}

        OvenPlayerConsole.log("API : remove() ");
        lazyQueue.destroy();
        if(captionManager){
            captionManager.destroy();
            captionManager = null;
        }

        if(currentProvider){
            currentProvider.destroy();
            currentProvider = null;
        }

        providerController = null;
        playlistManager = null;
        playerConfig = null;
        lazyQueue = null;

        that.trigger(DESTROY);
        that.off();

        OvenPlayerConsole.log("API : remove() - lazyQueue, currentProvider, providerController, playlistManager, playerConfig, api event destroed. ");
        OvenPlayerSDK.removePlayer(that.getContainerId());
        if(OvenPlayerSDK.getPlayerList().length  === 0){
            console.log("OvenPlayerSDK.playerList",  OvenPlayerSDK.getPlayerList());
        }
    };



    return that;
};



export default Api;


