<template>
  <div>
    <section class="read-reward-box">
      <i class="icon-money"></i>
      <span v-if="isShowMoney" class="text-money">$ {{ taskData.money }}</span>
      <!-- <div
        :class="['btn-get', isShowHandAnima ? 'get-anima' : '']"
        @click="handleShowReadRewardPopup"
        >Get</div
      > -->
      <div class="btn-get-gif">
        <img
          src="~/assets/images/get-read-reward.gif"
          alt="get-read-reward"
          @click="handleShowReadRewardPopup"
        />
      </div>
    </section>

    <!-- 奖励模块 -->
    <transition name="fade">
      <div v-show="isShowReadReward" class="read-reward-popup">
        <div class="mask"></div>
        <transition name="slide">
          <div v-show="isShowReadReward" class="reward-content">
            <i class="icon-close" @click="handleHideReadRewardPopup"></i>
            <h3>Super Surprise Reward</h3>
            <div class="money-box">
              <img src="~/assets/images/icon-money.png" alt="icon-money" />
              <span>$ {{ taskData.money }}</span>
            </div>
            <div>
              <div
                v-if="chapterProgress >= 100 && timeProgress >= 100"
                class="level-box"
                :class="{ 'disabled-anima': isShowDisabledTip }"
              >
                <div class="level-item">
                  My <div>Lv {{ taskData.level }}</div>
                </div>
                <div class="level-progress">
                  <div> {{ taskData.levelExp }} %</div>
                  <div class="progress-bar">
                    <div
                      class="progress-bar-inner"
                      :style="{ width: `${taskData.levelExp}%` }"
                    ></div>
                  </div>
                </div>
                <div class="level-item">
                  Goal <div>Lv {{ taskData.level + 1 }}</div>
                </div>
              </div>
              <p class="task-title">Eligibility for Collection</p>
              <div>
                <div
                  class="task-item"
                  :class="{ 'disabled-anima': chapterProgress < 100 && isShowDisabledTip }"
                >
                  <p class="task-item-title"
                    >Read for {{ Math.min(taskData.chapter, 150) }}/150 Chapters</p
                  >
                  <div class="task-progress">
                    <div class="progress-bar">
                      <div
                        class="progress-bar-inner"
                        :style="{ width: `${chapterProgress}%` }"
                      ></div>
                    </div>
                    <div class="progress-num"> {{ chapterProgress }}%</div>
                  </div>
                </div>
                <div
                  v-if="chapterProgress >= 100"
                  class="task-item"
                  :class="{ 'disabled-anima': timeProgress < 100 && isShowDisabledTip }"
                >
                  <p class="task-item-title"
                    >Read for {{ Math.min(taskData.time, 1000) }}/1000 minutes</p
                  >
                  <div class="task-progress">
                    <div class="progress-bar">
                      <div class="progress-bar-inner" :style="{ width: `${timeProgress}%` }"></div>
                    </div>
                    <div class="progress-num"> {{ timeProgress }}%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pay">
              <div class="pay-list">
                <div
                  v-for="(item, i) in payTypeArr"
                  :key="i"
                  :class="['pay-item', payType === item.type ? 'pay-item-active' : '']"
                  @click="payType = item.type"
                >
                  <img :src="item.img" alt="pay-type-img" />
                </div>
              </div>
              <div class="pay-btn" @click="handleGetRewardPay"
                ><i class="icon-star"></i> Get ${{ taskData.money }}
              </div>
              <div class="go-read" @click="handleHideReadRewardPopup">
                <i class="icon-back"></i>
                Go Read
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- 观看完激励的弹窗展示 -->
    <section v-if="isShowRewardWatchedDialog" class="reward-watched-dialog">
      <div class="mask"></div>
      <div class="dialog-content">
        <div :class="[isSuccessGetReward ? 'get-anima-reward' : '']">
          <img class="icon-money" src="~/assets/images/icon-money-2.png" alt="icon-money" />
        </div>
        <span class="text-money">+$1</span>
        <p class="desc">You can get an extra $1 after watching an ad!</p>
        <div class="check-container" @click="handleCheckRemind">
          <div class="check-box"><i v-if="isCheckedRemind" class="icon-checkmark"></i></div>
          <div>Don't remind me again.</div>
        </div>
        <div class="get-btn" @click="handleCloseRewardWatchedDialog">
          <i class="icon-star"></i>Get It！
          <span v-if="dialogCountdown > 0"></span>
          <!-- <span v-if="dialogCountdown > 0">{{ dialogCountdown }}s</span> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Storage from "~/utils/storage";
export default {
  data() {
    return {
      isShowHandAnima: true, // 是否显示手部动画
      isShowReadReward: false, // 阅读奖励弹窗
      progress: 70, // 阅读进度
      payTypeArr: [
        { type: "paypal", img: require("~/assets/images/icon-pay-paypal.png") },
        { type: "ios", img: require("~/assets/images/icon-pay-ios.png") },
        { type: "google", img: require("~/assets/images/icon-pay-google.png") }
      ],
      payType: "paypal", // 支付方式
      isShowMoney: false,
      taskData: {
        chapter: 0,
        level: 1,
        levelExp: 0,
        money: 100,
        time: 0
      },
      isShowDisabledTip: false,
      isShowRewardWatchedDialog: false,
      isCheckedRemind: true,
      dialogCountdown: 3,
      isSuccessGetReward: false
    };
  },
  computed: {
    chapterProgress() {
      // 上限为100
      return Math.min(Math.floor((this.taskData.chapter / 150) * 100), 100);
    },
    timeProgress() {
      // 上限为100
      return Math.min(Math.floor((this.taskData.time / 1000) * 100), 100);
    }
  },
  mounted() {
    this.getRewardTaskData();
  },
  methods: {
    handleShowReadRewardPopup() {
      this.isShowHandAnima = false;
      this.isShowReadReward = true;
      document.body.classList.add("no-scroll");
      window.setUserFirstAction("click_right_button");
      window.setUserReadPageClickAction("click_right_button");
    },
    handleHideReadRewardPopup() {
      this.isShowReadReward = false;
      document.body.classList.remove("no-scroll");
    },

    getRewardTaskData() {
      this.isShowMoney = true;
      const taskData = Storage.getItem("novel_rewardTask");
      if (taskData) {
        this.taskData = taskData;
      } else {
        Storage.setItem("novel_rewardTask", this.taskData);
      }
    },

    setRewardTaskData(type) {
      switch (type) {
        case "chapter":
          this.taskData.chapter++;
          this.taskData.levelExp += 10;
          if (this.taskData.levelExp >= 100) {
            this.taskData.level += 1;
            this.taskData.levelExp = 0;
          }
          break;
        case "money":
          this.taskData.money++;
          break;
        case "time":
          this.taskData.time++;
          break;
        default:
          break;
      }
      Storage.setItem("novel_rewardTask", this.taskData);
    },

    handleGetRewardPay() {
      this.isShowDisabledTip = true;
      setTimeout(() => {
        this.isShowDisabledTip = false;
      }, 1000);
      window.setUserReadPageClickAction("click_popup_money_button");
    },

    handleOpenRewardWatchedDialog() {
      this.isShowRewardWatchedDialog = true;
      window.dataLayer.push({
        event: "IR_Reward_Dialog",
        dialog_action: "dialog_show"
      });
      // this.dialogCountdown = 3;
      // this.countdownInterval = setInterval(() => {
      //   this.dialogCountdown--;
      //   if (this.dialogCountdown <= 0) {
      //     this.handleCloseRewardWatchedDialog();
      //   }
      // }, 1000);
      // window.addEventListener("beforeunload", () => {
      //   clearInterval(this.countdownInterval);
      // });
    },
    handleCloseRewardWatchedDialog() {
      this.isSuccessGetReward = true;
      // clearInterval(this.countdownInterval);
      Storage.setItem("novel_isDontRemindWatchedDialog", this.isCheckedRemind);
      this.setRewardTaskData("money");
      setTimeout(() => {
        this.isShowRewardWatchedDialog = false;
        this.isSuccessGetReward = false;
        this.$emit("handle-close-reward-watched-dialog");
      }, 500);

      window.dataLayer.push({
        event: "IR_Reward_Dialog",
        dialog_action: "dialog_button_click"
      });
    },
    handleCheckRemind() {
      this.isCheckedRemind = !this.isCheckedRemind;
    }
  }
};
</script>

<style scoped lang="scss">
.read-reward-box {
  position: fixed;
  right: 12px;
  top: 12px;
  z-index: 999;
  @include center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 40px;
  border: 1px solid rgba($color_fff, 0.6);
  .icon-money {
    @include icon(36px, 36px, "icon-money.png");
  }
  .text-money {
    font-size: 20px;
    font-family: "seb";
    color: $color8;
  }
  .btn-get {
    position: relative;
    @include center;
    width: 48px;
    height: 30px;
    border-radius: 30px;
    color: $color_fff;
    background: $color3;
    font-size: 18px;
    font-family: "seb";
    cursor: pointer;
  }
  .get-anima {
    &::after {
      content: "";
      position: absolute;
      top: 12px;
      left: 14px;
      @include icon(80px, 80px, "icon-hand.png");
      animation: handAnim 0.4s linear infinite alternate;
    }
    @keyframes handAnim {
      0% {
        transform: translate(13px, 13px);
      }
      100% {
        transform: translate(0);
      }
    }
  }
  .btn-get-gif {
    position: relative;
    width: 56px;
    height: 30px;
    img {
      position: absolute;
      width: 70px;
      height: 55px;
      cursor: pointer;
    }
  }
}

.read-reward-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($color6, 0.4);
  }
}
.reward-content {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 24px 32px 50px;
  border-radius: 32px 32px 0 0;
  background: #222;
  color: $color8;
  .icon-close {
    position: absolute;
    top: 24px;
    right: 32px;
    @include icon(36px, 36px, "icon-close-reward.png");
    cursor: pointer;
  }
  h3 {
    font-size: 24px;
    font-family: "seb";
    text-align: center;
  }
  .money-box {
    @include center;
    margin: 16px 0 32px;
    img {
      width: 64px;
      height: 64px;
    }
    span {
      margin-left: 14px;
      font-size: 38px;
      font-family: "seb";
      color: $color3;
    }
  }

  .level-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    .level-item {
      text-align: center;
      div {
        padding: 4px 8px;
        margin-top: 4px;
        border-radius: 4px;
        font-size: 16px;
        background-color: #333;
      }
    }
    .level-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 20px;
      color: $color3;
    }
    .progress-bar {
      width: 300px;
      height: 12px;
      border-radius: 12px;
      background-color: rgba($color_fff, 0.1);
      overflow: hidden;
    }
    .progress-bar-inner {
      height: 100%;
      background-color: $color3;
      border-radius: 12px;
    }
  }
  .task-title {
    margin-bottom: 12px;
  }
  .task-item {
    width: 100%;
    height: 120px;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    background: linear-gradient(to top, #241502 0%, #523808 100%);
    border: 1px solid rgba($color_fff, 0.3);
    .task-item-title {
      margin-bottom: 16px;
      font-size: 20px;
      font-family: "sesb";
    }
    .task-progress {
      display: flex;
      align-items: center;
      .progress-bar {
        width: 100%;
        height: 12px;
        border-radius: 12px;
        background-color: rgba($color_000, 0.5);
        overflow: hidden;
      }
      .progress-bar-inner {
        height: 100%;
        background-color: $color3;
        border-radius: 12px;
      }
      .progress-num {
        width: 70px;
        margin-left: 24px;
        font-size: 20px;
        color: $color3;
      }
    }
  }
  .pay {
    margin-top: 40px;
    .pay-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .pay-item {
      flex: 1;
      @include center;
      height: 50px;
      border-radius: 50px;
      background-color: rgba($color_fff, 0.1);
      cursor: pointer;
      img {
        height: 24px;
      }
      &.pay-item-active {
        background-color: $color_fff;
      }
    }
    .pay-btn {
      margin: 40px auto 0;
      width: 244px;
      height: 77px;
      @include center;
      gap: 4px;
      background-image: url("~/assets/images/icon-get-money.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      font-size: 22px;
      font-family: "sesb";
      cursor: pointer;
      .icon-star {
        @include icon(26px, 26px, "icon-get-money-star.png");
      }
    }
    .go-read {
      margin: 16px auto 0;
      @include center;
      gap: 4px;
      font-size: 18px;
      font-family: "sesb";
      color: rgba($color8, 0.6);
      cursor: pointer;
      .icon-back {
        @include icon(20px, 20px, "icon-go-read.png");
      }
    }
  }
}

.disabled-anima {
  animation: shake-bottom 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  @keyframes shake-bottom {
    0%,
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
    }
    10% {
      -webkit-transform: rotate(2deg);
      transform: rotate(2deg);
    }
    20%,
    40%,
    60% {
      -webkit-transform: rotate(-4deg);
      transform: rotate(-4deg);
    }
    30%,
    50%,
    70% {
      -webkit-transform: rotate(4deg);
      transform: rotate(4deg);
    }
    80% {
      -webkit-transform: rotate(-2deg);
      transform: rotate(-2deg);
    }
    90% {
      -webkit-transform: rotate(2deg);
      transform: rotate(2deg);
    }
  }
}

.reward-watched-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  @include center;
  color: $color8;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($color6, 0.4);
  }
  .dialog-content {
    position: absolute;
    width: 650px;
    padding: 28px 36px 18px;
    z-index: 1;
    @include center;
    flex-direction: column;
    border-radius: 24px;
    background-color: $color9;
    .icon-money {
      width: 120px;
    }
    .get-anima-reward {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: -4px;
        left: 38px;
        @include icon(40px, 40px, "icon-money.png");
        animation: getRewardAnima 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
      }
      @keyframes getRewardAnima {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-100dvh) translateX(0);
          opacity: 0;
        }
      }
    }
    .text-money {
      font-size: 42px;
      color: $color3;
      font-family: "sesb";
    }
    .desc {
      margin: 20px auto 32px;
      font-size: 18px;
      line-height: 24px;
    }
    .check-container {
      display: flex;
      align-items: center;
      .check-box {
        position: relative;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        border-radius: 50%;
        background-color: #ebebeb;
        cursor: pointer;
      }
      .icon-checkmark {
        @include icon(20px, 20px, "icon-check-mark.png");
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .get-btn {
      @include icon(280px, 65px, "icon-reward-watched-get-it.png");
      @include center;
      margin-top: 12px;
      font-size: 18px;
      font-family: "sesb";
      cursor: pointer;
      .icon-star {
        @include icon(24px, 24px, "icon-get-money-star.png");
        margin-right: 6px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .read-reward-box {
    right: vw(24);
    top: vw(18);
    gap: vw(16);
    height: vw(60);
    padding: 0 vw(18);
    border-radius: vw(60);
    border: vw(2) solid rgba($color_fff, 0.6);
    .icon-money {
      width: vw(56);
      height: vw(56);
    }
    .text-money {
      font-size: vw(30);
      line-height: vw(38);
    }
    .btn-get {
      width: vw(64);
      height: vw(40);
      border-radius: vw(40);
      font-size: vw(26);
      &::after {
        top: vw(18);
        left: vw(14);
        width: vw(100);
        height: vw(100);
      }
      @keyframes handAnim {
        0% {
          transform: translate(vw(16), vw(16));
        }
      }
    }
    .btn-get-gif {
      width: vw(90);
      height: vw(50);
      img {
        width: vw(120);
        height: vw(90);
      }
    }
  }
  .reward-content {
    padding: vw(32) vw(46);
    border-radius: vw(46) vw(46) 0 0;
    .icon-close {
      position: absolute;
      top: vw(32);
      right: vw(46);
      width: vw(48);
      height: vw(48);
    }
    h3 {
      font-size: vw(38);
    }
    .money-box {
      margin: vw(24) 0 vw(48);
      img {
        width: vw(86);
        height: vw(86);
      }
      span {
        margin-left: vw(16);
        font-size: vw(64);
      }
    }

    .level-box {
      margin-bottom: vw(50);
      gap: vw(32);
      .level-item {
        font-size: vw(26);
        div {
          padding: vw(4) vw(8);
          margin-top: vw(8);
          border-radius: vw(4);
          font-size: vw(28);
        }
      }
      .level-progress {
        flex: 1;
        gap: vw(8);
        font-size: vw(28);
      }
      .progress-bar {
        width: 100%;
        height: vw(18);
        border-radius: vw(18);
      }
      .progress-bar-inner {
        border-radius: vw(18);
      }
    }
    .task-title {
      margin-bottom: vw(18);
      font-size: vw(28);
    }
    .task-item {
      height: vw(180);
      border-radius: vw(24);
      padding: vw(32);
      margin-bottom: vw(24);
      .task-item-title {
        margin-bottom: vw(24);
        font-size: vw(30);
      }
      .task-progress {
        .progress-bar {
          height: vw(18);
          border-radius: vw(18);
        }
        .progress-bar-inner {
          border-radius: vw(18);
        }
        .progress-num {
          width: vw(100);
          margin-left: vw(24);
          font-size: vw(30);
          line-height: vw(40);
        }
      }
    }
    .pay {
      margin-top: vw(50);
      .pay-list {
        gap: vw(16);
      }
      .pay-item {
        height: vw(80);
        border-radius: vw(80);
        img {
          height: vw(36);
        }
      }
      .pay-btn {
        margin: vw(42) auto 0;
        width: vw(320);
        height: vw(101);
        border-radius: vw(96);
        font-size: vw(36);
        .icon-star {
          width: vw(44);
          height: vw(44);
        }
      }
      .go-read {
        margin: vw(24) auto 0;
        gap: vw(8);
        font-size: vw(28);
        .icon-back {
          width: vw(30);
          height: vw(30);
        }
      }
    }
  }

  .reward-watched-dialog {
    .dialog-content {
      width: vw(632);
      padding: vw(28) vw(36) vw(18);
      border-radius: vw(30);
      .icon-money {
        width: vw(160);
      }
      .get-anima-reward {
        &::before {
          width: vw(50);
          height: vw(50);
          top: 0;
          left: vw(60);
        }
      }
      .text-money {
        font-size: vw(60);
        line-height: vw(80);
      }
      .desc {
        width: vw(420);
        text-align: center;
        margin: vw(28) auto vw(56);
        font-size: vw(32);
        line-height: vw(42);
      }
      .check-container {
        font-size: vw(32);
        line-height: vw(42);
        align-self: flex-start;
        padding-left: vw(16);
        .check-box {
          width: vw(32);
          height: vw(32);
          margin-right: vw(12);
        }
        .icon-checkmark {
          @include icon(vw(32), vw(32), "icon-check-mark.png");
        }
      }
      .get-btn {
        width: vw(560);
        height: vw(130);
        margin-top: vw(20);
        font-size: vw(36);
        .icon-star {
          width: vw(44);
          height: vw(44);
          margin-right: vw(8);
        }
      }
    }
  }
}
</style>
