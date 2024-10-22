<template>
  <div class="expandable-text" :class="{ 'is-expanded': expanded }">
    <slot></slot>
    <div class="text-content">
      {{ text }}
    </div>
    <div class="toggle-button" @click="toggleExpand">
      {{ expanded ? "Show Less" : "Show More" }}<i class="icon-more"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
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
  color: rgba($color2, 0.6);
}

.text-content {
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
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
  .text-content,
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
