<template>
  <div class="title-label">
    <span class="label-title">{{ title }}</span>
    <custom-link class="label-right" v-if="isSeeMore" :to="to">
      <span>More</span>
      <i class="icon-more-module"></i>
    </custom-link>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    isSeeMore: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.disabled {
  pointer-events: none;
}
.title-label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin: 32px 0 16px;
  font-family: "seb";
  font-size: 20px;
  color: $color2;
}

.label-right {
  height: 32px;
  padding-left: 20px;
  @include center;
  span {
    color: $color3;
    font-size: 14px;
  }
  i {
    @include icon(24px, 24px, "module-icon-more.png");
  }
}

@media screen and (max-width: 750px) {
  .title-label {
    height: vw(48);
    margin: vw(48) 0 vw(32);
    font-size: vw(36);
  }

  .label-right {
    height: vw(48);
    padding-left: vw(20);
    span {
      font-size: vw(28);
    }
    i {
      width: vw(48);
      height: vw(48);
    }
  }
}
</style>
