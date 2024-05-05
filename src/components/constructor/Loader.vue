<template>
  <v-progress-circular
    :class="!mt10false ? 'mt-10' : ''"
    indeterminate
    color="primary"
    :size="size"
  />
</template>

<script lang="ts" setup>
interface Props {
  size?: string | number;
  mt10false?: boolean;
}

defineProps<Props>();
</script>
