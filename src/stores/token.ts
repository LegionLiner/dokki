import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("token", () => {
  const token = ref<string>();

  const setToken = (payload?: string) => (token.value = payload);

  return {
    token,
    setToken,
  };
});
