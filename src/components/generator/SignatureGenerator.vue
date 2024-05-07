<template>
  <div class="sign">
    <h2 class="mb-3">
      {{ $t("signature") }}
    </h2>
    <div class="sign bg-white pa-md-6 pa-3">
      <div class="d-flex align-center">
        <v-label
          class="sign__label rounded-s-lg px-5 align-self-stretch d-flex font-weight-medium text-white"
          for="uploadSignature"
          :style="{
            backgroundColor: $vuetify.theme.themes.LightTheme.colors.primary,
            opacity: `1`,
          }"
          :text="$t(`labels.file`)"
        />
        <div class="w-100">
          <v-file-input
            v-model="files"
            clearable
            hide-details
            density="compact"
            prepend-icon=""
            id="uploadSignature"
            rounded="0 e-lg"
            variant="plain"
            bg-color="blue2" 
            :multiple="false"
            :disabled="noSignature"
          >
            <template #prepend-inner>
              <div style="width: 8px" />
            </template>
          </v-file-input>
        </div>
      </div>
      <div v-if="!previewImage">
        <div class="sign__signature">
          <Vue3Signature
            ref="signature"
            class="mx-auto my-4"
            h="200px"
            :w="`${signWidth}px`"
            :sigOption="options"
            @endStroke="prepairImageFile"
            :disabled="noSignature"
          />
        </div>

        <v-checkbox
          hide-details
          color="primary"
          :model-value="noSignature"
          :label="$t(`noSignature`)"
          @update:model-value="$emit(`update:no-signature`, $event)"
        />

        <div
          class="d-flex flex-wrap justify-space-between ga-2"
          v-if="!noSignature"
        >
          <div class="d-flex ga-2">
            <v-btn
              color="primary"
              variant="outlined"
              rounded="lg"
              @click="clear"
              :text="$t(`clear`)"
            />
            <v-btn
              color="primary"
              variant="outlined"
              rounded="lg"
              @click="undo"
              :text="$t(`undo`)"
            />
          </div>
          <v-btn
            color="primary"
            rounded="lg"
            @click="prepairImageFile"
            :text="$t(`applySign`)"
          />
        </div>
      </div>
      <div v-else-if="files.length">
        <img
          :src="previewImage"
          :alt="$t(`preview`)"
          class="sign__image my-4"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watchEffect, watch } from "vue";
import { useTheme, useDisplay } from "vuetify";

interface Props {
  modelValue: File | null;
  noSignature?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["clear", "update:modelValue", "update:no-signature"]);

const theme = useTheme();
const display = useDisplay();
const files = ref<File[]>([]);
const previewImage = ref<string>();
const signature = ref();
const signWidth = computed<number>(() =>
  display.width.value > 500 ? 450 : 280,
);
const options = {
  penColor: "#000",
  backgroundColor: theme.themes.value.LightTheme.colors.blue2,
};

const remove = () => (files.value = []);
const clear = () => signature.value.clear();
const undo = () => signature.value.undo();

const convertImageToFile = (img: HTMLImageElement) => async () => {
  const canvas = document.createElement("canvas");

  canvas.width = img.width;
  canvas.height = img.height;

  const canvasContext = canvas.getContext("2d");

  if (!canvasContext) {
    return;
  }

  canvasContext.drawImage(img, 0, 0);

  const pngUrl = canvas.toDataURL("image/png");
  const response = await fetch(pngUrl);
  const blob = await response.blob();
  const file: File = new File([blob], "signature.png", { type: "image/png" });

  files.value = [file];
};

const prepairImageFile = () => {
  const img = new Image();

  img.src = signature.value.save("image/svg+xml");
  img.onload = convertImageToFile(img);
};

watch(
  () => props.modelValue,
  (value) => {    
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

watch(
  () => props.noSignature,
  (value) => {
    if (value) {
      remove();
    }
  },
);

watchEffect(() => {
  if (files.value.length) {
    const [file] = files.value;

    emit(`update:modelValue`, file);

    return;
  }

  emit(`update:modelValue`, null);
});
</script>
<style lang="scss">
.sign {
  border-radius: 10px;
  &__label {
    font-size: 1.08rem;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &__image {
    display: block;
    max-width: 100%;
    max-height: 320px;
  }

  &__signature {
    overflow-x: auto;
    overflow-y: hidden;

    canvas {
      border-radius: 10px !important;
    }
  }
  .v-field {
    background-color: rgba(246, 253, 255, 1) !important;
  }
  .v-input--density-compact .v-field__input {
    background: rgba(246, 253, 255, 1) !important;
  }
  .v-btn {
    box-shadow: none !important;
  }
  .d-flex {
    cursor: pointer;
  }
  .mb-3 {
    margin-top: -20px;
  }
}
</style>
