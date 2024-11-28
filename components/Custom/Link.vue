<template>
  <a :href="customLink || to">
    <slot></slot>
  </a>
</template>

<script>
import { generateCustomLink } from "~/utils/utils";

export default {
  props: {
    to: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      required: true
    }
  },
  data() {
    return {
      customLink: ""
    };
  },
  // 监听to的变化，更新customLink
  watch: {
    to(val) {
      this.customLink = val === "#" ? "#" : generateCustomLink(val);
    }
  },
  mounted() {
    this.customLink = this.to === "#" ? "#" : generateCustomLink(this.to);
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
