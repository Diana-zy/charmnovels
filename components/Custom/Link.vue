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
      type: String | Number,
      required: true
    }
  },
  data() {
    return {
      customLink: ""
    };
  },
  mounted() {
    this.customLink = generateCustomLink(this.to);
  }
};
</script>
