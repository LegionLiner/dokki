<template>
  <TemplateGenerator :template-id="templateId" :orderId="orderId" :category="category" />
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Category } from "@/types";
import TemplateGenerator from "@components/generator/TemplateGenerator.vue";

interface Props {
  templateId: string;
  orderId?: string;
}

defineProps<Props>();

const category = ref<Category>(Category.Doc);
</script>

<style lang="scss">
.v-input--density-compact:not(.v-input--error) {
  .v-field__outline {
    --v-border-color: rgba(205, 221, 245, 1);
    --v-field-border-opacity: 1;

    * {
      border-color: rgba(205, 221, 245, 1);

      *::after,
      *::before {
        border-color: rgba(205, 221, 245, 1);
      }
    }

    &__notch::after {
      border-color: rgba(205, 221, 245, 1);
    }

    &__notch::before {
      border-color: rgba(205, 221, 245, 1);
    }
  }

  .v-field__input {
    border-radius: 10px;
    background: white !important;
  }
}

.v-input--density-compact.v-autocomplete--active-menu {
  .v-field__outline {
    --v-border-color: rgba(155, 171, 200, 1);
    --v-field-border-opacity: 1;

    * {
      border-color: rgba(155, 171, 200, 1);

      *::after,
      *::before {
        border-color: rgba(155, 171, 200, 1);
      }
    }

    &__notch::after {
      border-color: rgba(155, 171, 200, 1);
    }

    &__notch::before {
      border-color: rgba(155, 171, 200, 1);
    }
  }

  .v-field__input {
    border-radius: 10px;
    background: white !important;
  }
}

i.mdi-chevron-down::before {
  content: "\F0140";
  color: rgba(155, 171, 200, 1);
}

i::before {
  color: rgba(155, 171, 200, 1);
}
</style>
