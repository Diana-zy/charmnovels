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
      this.customLink = generateCustomLink(val);
    }
  },
  mounted() {
    this.customLink = generateCustomLink(this.to);
  }
};
</script>
