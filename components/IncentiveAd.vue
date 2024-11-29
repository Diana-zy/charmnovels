<template>
  <div></div>
</template>

<script>
let rewardedSlot;
let rewardPayload;
export default {
  data() {
    return {
      rewardedSlotEvent: null
    };
  },
  mounted() {
    this.initIncentiveAd();
  },
  methods: {
    initIncentiveAd() {
      googletag.cmd.push(() => {
        rewardedSlot = googletag.defineOutOfPageSlot(
          "/23197833490/charmnovels/charmnovels_reward",
          googletag.enums.OutOfPageFormat.REWARDED
        );

        // Slot returns null if the page or device does not support rewarded ads.
        if (rewardedSlot) {
          // console.log(rewardedSlot);
          // console.log(googletag);
          // console.log(googletag.pubads());
          // console.log(rewardedSlot.getSlotElementId());
          rewardedSlot.addService(googletag.pubads());

          googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
            console.log("rewardedSlotReady", event);
            this.$emit("init-incentive-ad", true);
            this.rewardedSlotEvent = event;
          });

          // 广告关闭
          googletag.pubads().addEventListener("rewardedSlotClosed", () => {
            console.log("rewardedSlotClosed");
            this.dismissRewardedAd();
            this.secondInitIncentiveAd();
          });

          // 广告发放奖励
          googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
            console.log("rewardedSlotGranted", event.payload);
            rewardPayload = event.payload;
          });

          googletag.pubads().addEventListener("slotRenderEnded", (event) => {
            // 未加载到广告
            if (event.slot === rewardedSlot && event.isEmpty) {
              console.log("slotRenderEnded", event);
              this.$emit("init-incentive-ad", false);
            }
          });

          googletag.enableServices();
          googletag.display(rewardedSlot);
        }
      });
    },

    secondInitIncentiveAd() {
      googletag.pubads().clear(rewardedSlot);
      rewardedSlot = null;

      googletag.cmd.push(() => {
        rewardedSlot = googletag.defineOutOfPageSlot(
          "/23197833490/charmnovels/charmnovels_reward",
          googletag.enums.OutOfPageFormat.REWARDED
        );
        if (rewardedSlot) {
          rewardedSlot.addService(googletag.pubads());

          googletag.enableServices();
          googletag.display(rewardedSlot);
        }
      });
    },

    dismissRewardedAd() {
      // 观看完激励广告后，关闭广告
      if (rewardPayload) {
        this.$emit("close-incentive-ad", true);
        rewardPayload = null;
      }
      // 未观看完激励广告，关闭广告
      else {
        this.$emit("close-incentive-ad", false);
      }
      if (rewardedSlot) {
        googletag.destroySlots([rewardedSlot]);
      }
    },

    // 显示激励广告
    showRewardedAd() {
      console.log("showRewardedAd", this.rewardedSlotEvent);
      if (this.rewardedSlotEvent) {
        dataLayer.push({
          event: "C_IR"
        });
        this.rewardedSlotEvent.makeRewardedVisible();
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>
