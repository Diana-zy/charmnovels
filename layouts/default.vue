<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import { customAlphabet } from "nanoid";
import Storage from "@/utils/storage";
export default {
  mounted() {
    const userId = Storage.getItem("novel_userId");
    if (!userId) {
      const nanoid = customAlphabet(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        32
      );
      const randomId = nanoid();
      Storage.setItem("novel_userId", randomId);
    }
  },
  methods: {}
};
</script>
