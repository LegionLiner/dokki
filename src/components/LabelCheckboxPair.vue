<template>
  <template v-if="smAndUp">
    <slot name="label" />
    <slot />
  </template>
  <template v-else>
    <div :class="className ? `${className}-row` : ``">
      <div :class="className ? `${className}-item` : ``">
        <slot />
      </div>
      <slot name="label" />
    </div>
  </template>
</template>
<script lang="ts" setup>
import { useDisplay } from "vuetify";

interface Props {
  className?: string;
}

defineProps<Props>();
const { smAndUp } = useDisplay();
</script>
