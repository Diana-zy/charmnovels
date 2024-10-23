<template>
  <custom-link :to="to" class="item">
    <div class="cover">
      <nuxt-img
        width="180"
        height="270"
        :src="item.cover"
        :alt="item.name"
        fit="cover"
        format="auto"
      />
      <span class="tag-status">Purchased</span>
    </div>
    <p class="name">{{ item.name }}</p>
    <p class="progress">Read 78%</p>
  </custom-link>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    to: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 180px;
  height: 322px;
}
.cover {
  width: 180px;
  height: 270px;
  border-radius: 6px;
  overflow: hidden;
  @include book-edge(3.64px, 5px);
  img {
    width: 100%;
    height: 100%;
  }
}
.tag-status {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
  width: 67px;
  height: 20px;
  border-bottom-right-radius: 8px;
  background: $color3;
  @include center;
  font-size: 12px;
  color: $color1;
}
.name {
  font-size: 16px;
  line-height: 21px;
  font-family: "seb";
  margin: 9px 0 2px;
  @include ellipsis;
}
.progress {
  font-size: 14px;
  line-height: 19px;
  color: rgba($color2, 0.4);
}
@media screen and (max-width: 750px) {
  .item {
    width: 100%;
    height: vw(378);
  }
  .cover {
    width: vw(198);
    height: vw(296);
    border-radius: vw(4);
    @include book-edge(vw(4), vw(6));
  }
  .tag-status {
    width: vw(114);
    height: vw(34);
    border-bottom-right-radius: vw(16);
    font-size: vw(20);
  }
  .name {
    font-size: vw(28);
    line-height: vw(38);
    margin: vw(8) 0 vw(4);
  }
  .progress {
    font-size: vw(24);
    line-height: vw(32);
  }
}
</style>
