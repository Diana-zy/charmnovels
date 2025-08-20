<template>
  <div class="content-text">
    <template v-for="(item, index) in contentItems">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="item.type === 'content'" :key="`content-${index}`" v-html="item.content" />
      <adm-slot
        v-else
        :key="`ad-${index}`"
        :adm-id="item.slot"
        :adm-unit="`/23197833490/charmnovels/charmnovels_${item.slot}`"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    charInterval: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      adMaxCount: 10  // 页内最大个数
    };
  },
  computed: {
    contentItems() {
      const content = this.content.replace(/\n/g, "<p class='br'></p>");
      const parts = content.split(/(<p[^>]*>.*?<\/p>)/gs);
      let charCount = 0;
      let adIndex = 0;
      let lastAdCharCount = 0;
      const items = [];

      parts.forEach((part) => {
        if (!part.trim()) return; // 跳过空字符串
        items.push({
          type: "content",
          content: part
        });
        // 如果是p标签，不计算字符数和插入广告
        if (part.startsWith("<p")) return;
        if (adIndex >= this.adMaxCount) return;
        // 计算纯文本长度
        const textContent = part.replace(/<[^>]+>/g, "");
        charCount += textContent.length;
        // 检查是否需要插入广告
        if (
          charCount >= this.charInterval &&
          (charCount - lastAdCharCount >= this.charInterval || lastAdCharCount === 0)
        ) {
          items.push({
            type: "ad",
            slot: `detail_${adIndex + 1}`
          });
          lastAdCharCount = charCount;
          adIndex++;
        }
      });
      return items;
    }
  }
};
</script>
