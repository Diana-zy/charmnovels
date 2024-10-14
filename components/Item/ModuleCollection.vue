<template>
  <custom-link :to="to" class="item">
    <nuxt-img
      format="auto"
      fit="cover"
      width="582"
      height="348"
      :src="item.cover"
      :alt="item.name"
      class="cover"
      :loading="index < eager ? 'eager' : 'lazy'"
    />

    <p class="name">{{ item.name }}</p>
    <div class="btn-get">
      <i class="icon-arrow"></i>
    </div>
  </custom-link>
</template>

<script>
import { getStarScore } from "~/utils/utils";
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    eager: {
      type: Number,
      default: 0
    },
    to: {
      type: String,
      required: true
    }
  },
  methods: { getStarScore }
};
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  width: 282px;
  height: 212px;
  border-radius: 16px;
  overflow: hidden;
  @include shadow-outer;
  &:hover {
    .btn-get {
      @include icon(70px, 64px, "btn-collection-item-a.png");
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 168px;
    background: linear-gradient(135deg, #ffc4d6 0%, $color4 100%);
  }
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 168px;
}

.name {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 60px 0 12px;
  font-family: "seb";
  line-height: 44px;
  font-size: 15px;
  @include ellipsis;
}

.btn-get {
  position: absolute;
  bottom: 0;
  right: 0;
  @include icon(70px, 64px, "btn-collection-item.png");
}

.icon-arrow {
  @include icon(24px, 24px, "icon-arrow-white.png");
  margin-left: 34px;
  margin-top: 25px;
}

@media screen and (max-width: 750px) {
  .item {
    width: vw(582);
    height: vw(436);
    border-radius: vw(32);
    &:hover {
      .btn-get {
        width: vw(140);
        height: vw(128);
      }
    }
    &::before {
      height: vw(348);
    }
  }

  .cover {
    height: vw(348);
  }

  .name {
    padding: 0 vw(120) 0 vw(24);
    line-height: vw(88);
    font-size: vw(30);
  }

  .btn-get {
    width: vw(140);
    height: vw(128);
  }

  .icon-arrow {
    width: vw(48);
    height: vw(48);
    margin-left: vw(68);
    margin-top: vw(50);
  }
}
</style>
