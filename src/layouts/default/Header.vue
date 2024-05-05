<template>
  <v-app-bar
    v-if="active"
    style="position: fixed"
    :height="116"
    density="compact"
    elevation="0"
  >
    <template #prepend>
      <div class="logo">
        <img
          src="@assets/img/logo-mobile.png"
          class="logo__img"
          alt="DOKKI.COM"
        />
      </div>
    </template>
    <template #append>
      <div style="position: fixed; top: 24px; right: 10px; z-index: 1">
        <LangMenu />
      </div>
    </template>
  </v-app-bar>
</template>
<script lang="ts" setup>
interface Props {
  active?: boolean;
}

defineProps<Props>();
</script>
<style lang="scss" scoped>
.logo {
  margin: auto 10px;
  max-width: 135px;

  &__img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>

<style lang="scss">
@media (width < 900px) {
  .v-toolbar__content {
    height: 52px !important;

    .v-toolbar__append > div {
      top: 0px !important;
    }
  }
}
</style>
