<template>
  <s-model :value.sync="visible" click-layer-hide :showCloseIcon="false">
    <template v-slot:content>
      <div class="content">
        <div class="rating rating-mobile">
          <i
            v-for="(item, i) in starList"
            @click="handleClick(item.value)"
            :key="i"
            :class="item.style"
            class="rating-item"
          ></i>
          <span class="score">{{ score }}</span>
        </div>
        <footer class="submit-box" @click="handleSave">save</footer>
      </div>
    </template>
  </s-model>
</template>

<script>
import {
  getStarListStyle,
  getStarScore,
  shuffleArray,
  simulateClick,
  getIsWatchedIncentiveVideo,
  setWatchedIncentiveVideo
} from "~/utils/utils";
import Storage from "@/utils/storage";
export default {
  name: "RatingBox",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      starList: [
        {
          value: 2,
          style: "icon-star-off"
        },
        {
          value: 4,
          style: "icon-star-off"
        },
        {
          value: 6,
          style: "icon-star-off"
        },
        {
          value: 8,
          style: "icon-star-off"
        },
        {
          value: 10,
          style: "icon-star-off"
        }
      ],
      score: 0
    };
  },
  watch: {
    visible(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    getStarListStyle,
    getStarScore,
    handleClick(val) {
      this.starList = this.starList.map((item) => {
        if (item.value <= val) {
          item.style = "icon-star-on";
        } else {
          item.style = "icon-star-off";
        }
        return item;
      });
      this.score = val;
    },
    handleSave() {
      // Storage.setItem()
      this.$emit("handleCloseRatingBook");
    }
  }
};
</script>

<style scoped lang="scss">
.icon-star-on,
.icon-star-off,
.icon-star-half {
  width: vw(60);
  height: vw(60);
}
.content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.score {
  margin-left: vw(32);
  font-size: vw(32);
  color: $color2;
}
.submit-box {
  width: 100%;
  background: #ff9345;
  margin-top: vw(32);
  padding: vw(20) vw(32);
  border-radius: vw(80);
  text-align: center;
  line-height: 100%;
  color: $color1;
  font-weight: bold;
  font-size: vw(36);
}
</style>
