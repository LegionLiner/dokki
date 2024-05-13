<template>
  <v-text-field
    hide-details
    required
    density="compact"
    variant="outlined"
    bg-color="#fff"
    :rules="rules"
  />
</template>

<script setup>
const props = defineProps({
  rules: {
    type: Array,
  }
});
</script>
