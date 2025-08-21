<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Storage from "@/utils/storage";
export default {
  mounted() {
    const userId = Storage.getItem("novel_userId");
    if (!userId) {
      const userId = uuidv4().replace(/-/g, "");
      Storage.setItem("novel_userId", userId);
    }
  },
  methods: {}
};
</script>
