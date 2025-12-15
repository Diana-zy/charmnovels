<template>
  <main>
    <div class="btn-back" @click="handleClickBackPage"></div>
    <div class="user-info-content">
      <img class="icon-user-avatar" src="@/assets/images/icon-user-avatar.png" alt="user-avatar" />
      <div class="right-info">
        <p class="user-name">{{ userName }}</p>
        <div class="user-uid">UID : {{ userId }}</div>
      </div>
      <!-- <div class="btn-login" @click="handleClickLogin">LOG IN</div> -->
    </div>
    <div class="account-content">
      <div class="wallet-cell">
        <div>
          <i class="icon-wallet"></i>
          <span class="cell-title">My Wallet</span>
        </div>
        <div>
          <span class="balance-value">{{ userInfoData.coin }}</span>
          <span class="balance-unit">coins balance</span>
        </div>
      </div>

      <div class="sku-box">
        <div class="sku-list-content">
          <item-module-sku-vip
            v-for="(item, index) in skuVipList"
            :key="index"
            :item="item"
            @click.native="handleClickSkuItem(item)"
          ></item-module-sku-vip>
        </div>
        <custom-link to="/store/" class="more-top-up">Get More In Charmnovel Store</custom-link>
      </div>
    </div>

    <div class="menu-content">
      <custom-link to="/reading-history/" class="menu-item">
        <span class="menu-title">Reading-history</span>
        <i class="icon-more"></i>
      </custom-link>

      <custom-link to="/purchase-history/" class="menu-item">
        <span class="menu-title">Purchase-history</span>
        <i class="icon-more"></i>
      </custom-link>
    </div>
  </main>
</template>

<script>
import { getUserInfo, getSKUList } from "~/api/api";
export default {
  data() {
    return {
      userInfoData: {},
      skuVipList: []
    };
  },
  computed: {
    userName() {
      return this.userInfoData.tid ? `Guest_${this.userInfoData.tid.slice(-4)}` : "Guest";
    },
    userId() {
      return this.userInfoData.tid ? this.userInfoData.tid.slice(-16) : "*****************";
    }
  },
  mounted() {
    this.handleGetUserInfo();
  },
  methods: {
    async handleGetUserInfo() {
      await getUserInfo().then((res) => {
        this.userInfoData = res.data;
      });

      const data = {
        site_id: "charmnovel",
        sku_type: ["period"]
      };
      await getSKUList(data).then((res) => {
        this.skuVipList = res.data?.sku;
      });
    },
    handleClickBackPage() {},
    handleClickSkuItem(item) {
      console.log("Clicked SKU item:", item);
    }
  }
};
</script>

<style scoped lang="scss">
main {
  position: relative;
  width: 375px;
  padding: 46px 11px 0;
  box-sizing: border-box;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    @include icon(100%, 232px, "bg-user-info.png");
    z-index: -1;
  }
}
.btn-back {
  position: absolute;
  top: 10px;
  left: 23px;
  @include icon(24px, 24px, "icon-back.png");
  cursor: pointer;
}
.user-info-content {
  display: flex;
  padding-left: 12px;
  .icon-user-avatar {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    margin-right: 18px;
  }
  .right-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .user-name {
      margin-bottom: 12px;
      font-family: "seb";
      font-size: 18px;
      line-height: 24px;
    }
    .user-uid {
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      padding: 0 8px;
      background-color: rgba($color1, 0.6);
      border-radius: 4px;
    }
  }
  .btn-login {
    position: absolute;
    right: 24px;
    top: 48px;
    padding: 6px 20px;
    border-radius: 6px;
    background-color: $color1;
    cursor: pointer;
  }
}

.account-content {
  margin-top: 32px;
  padding: 12px;
  border-radius: 16px;
  background-color: $color1;
  box-shadow: 4px 4px 8px 0 rgba(#ffddcc, 0.7), -3px -4px 5px 0 rgba($color1, 0.5);

  .wallet-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div {
      @include center;
    }
    .icon-wallet {
      @include icon(29px, 24px, "icon-wallet.png");
      margin-right: 8px;
    }
    .cell-title {
      font-family: "sesb";
      font-size: 13px;
    }
    .balance-value {
      font-size: 20px;
      font-family: "seb";
      margin-right: 6px;
      color: $color3;
    }
    .balance-unit {
      font-size: 12px;
      font-family: "sesb";
    }
  }
}

.sku-box {
  .sku-list-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin: 38px 0;
  }
  .more-top-up {
    @include center;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    color: $color1;
    font-size: 14px;
    font-family: "sesb";
    background: $color3;
  }
}

.menu-content {
  margin-top: 32px;
  .menu-item {
    display: flex;
    justify-content: space-between;
    margin: 0 12px 18px;
    border-bottom: 1px solid rgba($color2, 0.4);
  }
  .menu-title {
    align-items: start;
    font-size: 16px;
    line-height: 21px;
    font-family: "sesb";
  }
  .icon-more {
    margin: 4px 0;
    @include icon(24px, 24px, "icon-arrow-right-black.png");
  }
}

@media screen and (max-width: 750px) {
  main {
    width: 100%;
    padding: vw(92) vw(22) 0;
    &::before {
      height: vw(464);
    }
  }

  .btn-back {
    top: vw(20);
    left: vw(46);
    width: vw(48);
    height: vw(48);
  }
  .user-info-content {
    padding-left: vw(24);
    .icon-user-avatar {
      width: vw(152);
      height: vw(152);
      margin-right: vw(36);
    }
    .right-info {
      .user-name {
        margin-bottom: vw(24);
        font-size: vw(36);
        line-height: vw(48);
      }
      .user-uid {
        height: vw(40);
        font-size: vw(24);
        line-height: vw(40);
        padding: 0 vw(16);
        border-radius: vw(8);
      }
    }
    .btn-login {
      right: vw(48);
      top: vw(96);
      padding: vw(12) vw(40);
      border-radius: vw(12);
    }
  }

  .account-content {
    margin-top: vw(64);
    padding: vw(24);
    border-radius: vw(32);
    box-shadow: vw(8) vw(8) vw(16) 0 rgba(#ffddcc, 0.7), vw(-6) vw(-8) vw(10) 0 rgba($color1, 0.5);

    .wallet-cell {
      .icon-wallet {
        @include icon(vw(58), vw(48), "icon-wallet.png");
        margin-right: vw(16);
      }
      .cell-title {
        font-size: vw(26);
      }
      .balance-value {
        font-size: vw(40);
        margin-right: vw(12);
      }
      .balance-unit {
        font-size: vw(24);
      }
    }
  }

  .sku-box {
    .sku-list-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin: 38px 0;
    }
    .more-top-up {
      height: vw(80);
      border-radius: vw(40);
      font-size: vw(28);
    }
  }

  .menu-content {
    margin-top: vw(64);
    .menu-item {
      margin: 0 vw(24) vw(36);
      border-bottom: vw(2) solid rgba($color2, 0.4);
    }
    .menu-title {
      font-size: vw(32);
      line-height: vw(42);
    }
    .icon-more {
      margin: vw(8) 0;
      width: vw(48);
      height: vw(48);
    }
  }
}
</style>
