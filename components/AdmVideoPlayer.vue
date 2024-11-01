<template>
  <div id="main-container">
    <div id="content">
      <video id="content-element">
        <source :src="videoDetail" />
      </video>
      <div id="ad-container"></div>
    </div>
    <div v-if="playBtn" id="play-button" @click="playBtn = false">
      <i class="icon-play"></i>
    </div>
  </div>
</template>

<script>
let adsManager;
let adsLoader;
let adDisplayContainer;
let intervalTimer;
let playButton;
let videoContent;

export default {
  props: {
    videoDetail: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      playBtn: true
    };
  },
  mounted() {
    console.log("mounted");
    this.init();
  },
  methods: {
    init() {
      videoContent = document.getElementById("content-element");
      playButton = document.getElementById("play-button");
      playButton.addEventListener("click", this.playAds);
      this.setUpIMA();
    },
    setUpIMA() {
      // Create the ad display container.
      this.createAdDisplayContainer();
      // Create ads loader.

      adsLoader = new google.ima.AdsLoader(adDisplayContainer);
      // Listen and respond to ads loaded and error events.
      adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        this.onAdsManagerLoaded,
        false
      );

      adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false);

      // An event listener to tell the SDK that our content video
      // is completed so the SDK can play any post-roll ads.
      const contentEndedListener = function () {
        adsLoader.contentComplete();
      };
      videoContent.onended = contentEndedListener;

      // Request video ads.

      const adsRequest = new google.ima.AdsRequest();
      adsRequest.adTagUrl = `https://pubads.g.doubleclick.net/gampad/ads?iu=/23197833490/charmnovels/charmnovels_video_pre&description_url=https%3A%2F%2F${window.location.hostname}${window.location.pathname}&tfcd=0&npa=0&sz=400x300&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&vpa=auto&vpmute=1&plcmt=1&correlator=`;

      // Specify the linear and nonlinear slot sizes. This helps the SDK to
      // select the correct creative if multiple are returned.
      adsRequest.linearAdSlotWidth = videoContent.clientWidth;
      adsRequest.linearAdSlotHeight = videoContent.clientHeight;
      adsRequest.nonLinearAdSlotWidth = videoContent.clientWidth;
      adsRequest.nonLinearAdSlotHeight = videoContent.clientHeight / 3;

      adsLoader.requestAds(adsRequest);
    },
    createAdDisplayContainer() {
      // We assume the adContainer is the DOM id of the element that will house
      // the ads.

      adDisplayContainer = new google.ima.AdDisplayContainer(
        document.getElementById("ad-container"),
        videoContent
      );
    },
    playAds() {
      // Initialize the container. Must be done via a user action on mobile devices.
      videoContent.load();
      adDisplayContainer.initialize();

      try {
        // Initialize the ads manager. Ad rules playlist will start at this time.

        adsManager.init(
          videoContent.clientWidth,
          videoContent.clientHeight,

          google.ima.ViewMode.NORMAL
        );
        // Call play to start showing the ad. Single video and overlay ads will
        // start at this time; the call will be ignored for ad rules.
        adsManager.start();
      } catch (adError) {
        // An error may be thrown if there was a problem with the VAST response.
        videoContent.play();
      }
    },
    onAdsManagerLoaded(adsManagerLoadedEvent) {
      // Get the ads manager.

      const adsRenderingSettings = new google.ima.AdsRenderingSettings();
      adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
      // videoContent should be set to the content video element.
      adsManager = adsManagerLoadedEvent.getAdsManager(videoContent, adsRenderingSettings);

      // Add listeners to the required events.

      adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError);
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        this.onContentPauseRequested
      );
      adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        this.onContentResumeRequested
      );
      adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAdEvent);

      // Listen to any additional events, if necessary.
      adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onAdEvent);
      adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdEvent);
      adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onAdEvent);
    },
    onAdEvent(adEvent) {
      // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
      // don't have ad object associated.
      const ad = adEvent.getAd();
      switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
          // This is the first event sent for an ad - it is possible to
          // determine whether the ad is a video ad or an overlay.
          if (!ad.isLinear()) {
            // Position AdDisplayContainer correctly for overlay.
            // Use ad.width and ad.height.
            videoContent.play();
          }
          break;
        case google.ima.AdEvent.Type.STARTED:
          // This event indicates the ad has started - the video player
          // can adjust the UI, for example display a pause button and
          // remaining time.
          if (ad.isLinear()) {
            // For a linear ad, a timer can be started to poll for
            // the remaining time.
            intervalTimer = setInterval(function () {
              // Example: const remainingTime = adsManager.getRemainingTime();
            }, 300); // every 300ms
          }
          break;
        case google.ima.AdEvent.Type.COMPLETE:
          // This event indicates the ad has finished - the video player
          // can perform appropriate UI actions, such as removing the timer for
          // remaining time detection.
          if (ad.isLinear()) {
            clearInterval(intervalTimer);
          }
          break;
      }
    },
    onAdError(adErrorEvent) {
      // Handle the error logging.
      console.log(adErrorEvent.getError());
      if (adsManager) {
        adsManager.destroy();
      }
    },
    onContentPauseRequested() {
      videoContent.pause();
      // This function is where you should setup UI for showing ads (e.g.
      // display ad timer countdown, disable seeking etc.)
      // setupUIForAds();
    },
    onContentResumeRequested() {
      videoContent.play();
      // This function is where you should ensure that your UI is ready
      // to play content. It is the responsibility of the Publisher to
      // implement this function when necessary.
      // setupUIForContent();
    }
  }
};
</script>

<style scoped lang="scss">
#main-container {
  position: relative;
  width: 600px;
  height: 470px;
  margin: 19px auto 0;
}

#content {
  position: relative;
  /* forces the container to match a 16x9 aspect ratio */
  /* replace with 75% for a 4:3 aspect ratio, if needed */
  padding-bottom: 75%;
}

#content-element {
  /* forces the contents to fill the container */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#ad-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
#play-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.icon-play {
  @include icon(144px, 144px, "icon-play.png");
}
@media (max-width: 750px) {
  #main-container {
    width: 100%;
    height: vw(493.5);
    height: vw(553.5);
    margin-top: vw(38);
  }
  .icon-play {
    @include icon(vw(144), vw(144), "icon-play.png");
  }
}
</style>
