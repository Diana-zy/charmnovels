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
    this.initUserId();
    this.handleWatchUserScroll();
  },
  methods: {
    initUserId() {
      const userId = Storage.getItem("novel_userId");
      if (!userId) {
        const userId = uuidv4().replace(/-/g, "");
        Storage.setItem("novel_userId", userId);
      }
    },

    handleWatchUserScroll() {
      const handleUserFirstInteraction = (event) => {
        if (event.type === "touchmove") {
          window.setUserFirstAction("scroll");
        }
        window.removeEventListener("touchmove", handleUserFirstInteraction);
      };
      window.addEventListener("touchmove", handleUserFirstInteraction, { once: true });
    }
  }
};
</script>
