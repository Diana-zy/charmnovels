<template>
  <div class="expandable-text" :class="{ 'is-expanded': expanded }">
    <slot></slot>
    <div class="expandable-text-synopsis">Synopsis</div>
    <div class="text-content">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    novelDetailInfo: {
      type: Object
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
    }
  }
};
</script>

<style lang="scss" scoped>
.expandable-text {
  position: relative;
  text-align: center;
}
.text-content {
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 6;
  -webkit-line-clamp: 6;
  box-orient: vertical;
  -webkit-box-orient: vertical;
  height: auto;
  transition: height 3s ease;
  font-size: 16px;
  line-height: 21px;
  text-align: left;
}

.toggle-button {
  display: inline-block;
  cursor: pointer;
  color: rgba($color2, 0.6);
  font-family: "sesb";
  margin-top: 1em;
}
.icon-more {
  @include icon(14px, 14px, "icon-more-text.png");
  margin-left: 8px;
  transform: translateY(2px);
}
.is-expanded {
  .text-content {
    -webkit-line-clamp: unset;
    line-clamp: unset;
    box-orient: unset;
  }
  .icon-more {
    transform: translateY(2px) rotate(180deg);
  }
}
@media screen and (max-width: 750px) {
  .expandable-text {
    color: rgba($color2, 0.6);
    width: vw(718);
    margin-left: vw(-30);
    height: vw(410);
    background: #fef1ea;
    border-radius: vw(32);
    padding: vw(32);
  }
  .expandable-text-synopsis {
    font-size: vw(32);
    text-align: left;
    font-weight: bold;
    color: $color2;
    line-height: vw(40);
    margin-bottom: vw(20);
  }
  .text-content {
    height: vw(184);
    overflow: hidden;
    font-size: vw(24);
    line-height: vw(31);
  }
  .toggle-button {
    font-size: vw(24);
    line-height: vw(32);
  }
  .icon-more {
    width: vw(28);
    height: vw(28);
    transform: translateY(vw(4));
  }
  .is-expanded {
    .icon-more {
      transform: translateY(vw(4)) rotate(180deg);
    }
  }

}
</style>
