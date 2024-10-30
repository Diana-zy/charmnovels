<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog-box">
      <p>{{ message }}</p>
      <div class="dialog-actions">
        <button @click="confirm">Confirm</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    show() {
      return this.$globalData.dialog.show;
    },
    message() {
      return this.$globalData.dialog.message;
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm");
      this.$globalMethod.hideDialog();
    },
    cancel() {
      this.$emit("cancel");
      this.$globalMethod.hideDialog();
    }
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
.dialog-actions {
  display: flex;
  justify-content: space-around;
}
</style>
