<template>
  <custom-link :to="to" class="item" @click.native="(event) => handleClickChapter(event, item)">
    <div class="row">
      <span class="num">Chapter {{ item.chapter_num }}</span>
      <p>{{ item.name }}</p>
    </div>
    <p class="content">
      {{ item.content }}
    </p>
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
  },
  methods: {
    handleClickChapter(event, item) {
      if (this.to === "") {
        event.preventDefault();
        this.$emit("handle-click-chapter", item);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 82px;
  border-bottom: 1px solid rgba(#ba9d82, 0.1);
}
.row {
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 12px;
  font-family: "sesb";
  gap: 34px;
  span {
    flex-shrink: 0;
    width: 100px;
    color: $color3;
  }
  p {
    @include ellipsis;
  }
}
.content {
  font-size: 14px;
  line-height: 19px;
  opacity: 0.6;
  @include ellipsis(2);
}
@media screen and (max-width: 750px) {
  .item {
    height: vw(164);
  }
  .row {
    font-size: vw(32);
    line-height: vw(42);
    margin-bottom: vw(24);
    gap: vw(20);
    span {
      width: vw(200);
    }
  }
  .content {
    font-size: vw(28);
    line-height: vw(38);
  }
}
</style>
