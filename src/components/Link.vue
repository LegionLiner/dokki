<template>
  <router-link
    :to="to"
    custom
    v-slot="{ href, route, navigate, isActive, isExactActive }"
  >
    <li
      class="v-link-custom"
      :class="[
        isActive && 'router-link-active',
        isExactActive && 'router-link-exact-active',
      ]"
    >
      <a :href="href" @click="navigate" :class="class" :style="style">
        <slot />
      </a>
    </li>
  </router-link>
</template>
<script lang="ts" setup>
import type { LocationAsRelativeRaw } from "vue-router";

interface Props {
  to: LocationAsRelativeRaw;
  class?: string;
  style?: Record<string, string>;
}

defineProps<Props>();
</script>
