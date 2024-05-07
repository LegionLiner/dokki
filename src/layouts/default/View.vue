<template>
  <v-main>
    <div class="content" :class="containerClass">
      <router-view />
    </div>
  </v-main>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const containerClass = computed(() => route.meta?.containerClass);
</script>
<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";

@media (width < 900px) {
  .v-main {
    --v-layout-top: 52px !important;
  }
}

.content {
  $margin-x: 30px;
  $header-height: 100px;
  $navigation-height: 56px;
  $margin-x-double: calc($margin-x * 2);

  margin: $margin-x 0;
  background-color: #f7fbff;
  border-radius: 40px;
  padding: 48px;
  min-height: calc(100vh - $margin-x-double);

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    padding: 4px 20px;
    margin: 0;
    min-height: calc(100vh - $header-height - $navigation-height);
  }

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    border-radius: 0;
  }

  @media #{map-get($display-breakpoints, 'xs')} {
    padding: 8px 19px;
  }
}
</style>
