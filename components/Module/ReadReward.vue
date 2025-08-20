<template>
  <div>
    <section class="read-reward-box">
      <i class="icon-money"></i>
      <span class="text-money">$ 100</span>
      <div
        :class="['btn-get', isShowHandAnima ? 'get-anima' : '']"
        @click="handleShowReadRewardPopup"
        >Get</div
      >
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
              <span>$ 100</span>
            </div>
            <div>
              <div class="level-box">
                <div class="level-item"> My <div>Lv 5</div> </div>
                <div class="level-progress">
                  <div> {{ progress }} %</div>
                  <div class="progress-bar">
                    <div class="progress-bar-inner" :style="{ width: `${progress}%` }"></div>
                  </div>
                </div>
                <div class="level-item"> Goal <div>Lv 6</div> </div>
              </div>
              <p class="task-title">Eligibility for Collection</p>
              <div>
                <div class="task-item">
                  <p class="task-item-title">Read for 5/190 Chapters</p>
                  <div class="task-progress">
                    <div class="progress-bar">
                      <div class="progress-bar-inner" :style="{ width: `${progress}%` }"></div>
                    </div>
                    <div class="progress-num"> {{ progress }}%</div>
                  </div>
                </div>
                <div class="task-item">
                  <p class="task-item-title">Read for 1000/1000 minutes</p>
                  <div class="task-progress">
                    <div class="progress-bar">
                      <div class="progress-bar-inner" :style="{ width: `${progress}%` }"></div>
                    </div>
                    <div class="progress-num"> {{ progress }}%</div>
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
              <div class="pay-btn"> Get $100 </div>
              <div class="go-read" @click="handleHideReadRewardPopup">
                <i class="icon-back"></i>
                Go Read
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
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
      payType: "paypal" // 支付方式
    };
  },
  methods: {
    handleShowReadRewardPopup() {
      this.isShowHandAnima = false;
      this.isShowReadReward = true;
      this.distanceFromTop = document.documentElement.scrollTop;
      document.body.classList.add("no-scroll");
    },
    handleHideReadRewardPopup() {
      this.isShowReadReward = false;
      document.body.classList.remove("no-scroll");
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
    @include icon(30px, 30px, "icon-money.png");
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
    @include icon(36px, 36px, "icon-close.png");
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
    background-color: #333;
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
        background-color: rgba($color_fff, 0.1);
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
      margin: 50px auto 0;
      width: 244px;
      height: 64px;
      @include center;
      border-radius: 64px;
      background-color: $color3;
      font-size: 22px;
      font-family: "sesb";
      cursor: pointer;
    }
    .go-read {
      margin: 24px auto 0;
      @include center;
      gap: 4px;
      font-size: 18px;
      font-family: "sesb";
      color: rgba($color8, 0.6);
      cursor: pointer;
      .icon-back {
        @include icon(20px, 20px, "icon-back.png");
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
      width: vw(40);
      height: vw(40);
    }
    .text-money {
      font-size: vw(28);
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
          height: vw(32);
        }
      }
      .pay-btn {
        margin: vw(50) auto 0;
        width: vw(320);
        height: vw(96);
        border-radius: vw(96);
        font-size: vw(36);
      }
      .go-read {
        margin: vw(32) auto 0;
        gap: vw(8);
        font-size: vw(28);
        .icon-back {
          width: vw(30);
          height: vw(30);
        }
      }
    }
  }
}
</style>
