<template>
  <button
    class="btnRedactor"
    @click.prevent
    :class="{ stroke: type === 'stroke', nofill, textBtn: type === 'text' }"
  >
    <slot name="icon"></slot>
  </button>
</template>

<script lang="ts" setup>
interface Props {
  type?: string;
  nofill?: boolean;
}

defineProps<Props>();
</script>

<style lang="scss">
@import "@assets/constructor/css/vars.scss";

.btnRedactor {
  background: $blue;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  &.textBtn {
    width: initial;
    padding: 2px 12px;
    font-size: 12px;
    font-weight: 500;
  }
  @media (max-width: $md) {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    svg {
      transform: scale(0.8);
    }
  }
  &:hover {
    background: darken($blue, 5%);
  }
  &.active {
    background: $primary;
    svg,
    path {
      fill: #fff !important;
    }
    &.stroke {
      svg,
      path {
        stroke: #fff !important;
      }
    }
  }
  &:not(.nofill) {
    svg,
    path {
      fill: $primary;
    }
  }
}
</style>
