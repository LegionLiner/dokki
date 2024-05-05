<template>
  <div class="photo">
    <div v-if="previewImage">
      <h3 class="subheader photo__subheader">{{ $t("yourPhoto") }}</h3>
      <div class="photo__preview">
        <img :src="previewImage" alt="user" class="photo__photo" />
        <img
          src="@assets/img/whatermark.png"
          alt="watermark"
          class="photo__watermark"
        />
      </div>
    </div>

    <div v-else class="photo__container ga-4">
      <ConstructorComp
        :field="modelValue"
        :hide-random-btn="hideRandomButton"
        :template="template"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, watchEffect } from "vue";
import ConstructorComp from "@components/ConstructorComp.vue";
import type { UserFieldShort, TemplateShort } from "@/services/types";

interface Props {
  modelValue: UserFieldShort;
  value: File | null;
  template?: TemplateShort;
  hideRandomButton?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:value"]);

const previewImage = ref<string>();

watch(
  () => props.value,
  
  (value) => {
    emit(`update:value`, value);

    if (!value) {
      previewImage.value = undefined;

      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      const isString = typeof result === "string";

      if (!result) {
        return;
      }

      if (isString) {
        previewImage.value = result;
      }
    };
    reader.readAsDataURL(value);
  },
);
</script>
<style lang="scss" scoped>
.photo {
  &__preview {
    width: fit-content;
    position: relative;
  }

  &__photo {
    display: block;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    max-width: 300px;
  }

  &__watermark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.8;
    pointer-events: none;
  }

  &__subheader {
    margin-bottom: 10px;
  }

  &__container {
    display: flex;
    margin-top: -10px;

    @media (max-width: 780px) {
      display: block;
    }
  }
}
</style>
