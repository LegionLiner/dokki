<template>
  <v-dialog
    persistent
    :model-value="modelValue"
    :width="576"
    @update:model-value="$emit(`update:modelValue`, $event)"
  >
    <v-card rounded="xl">
      <v-card-title v-if="$slots[`title`]">
        <slot name="title" />
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions class="justify-start px-6 py-2 flex-wrap gr-2 action-buttons">
        <v-btn
          class="submit"
          color="primary"
          variant="tonal"
          density="compact"
          type="submit"
          :disabled="disabled"
          :text="$t(`save`)"
          @click="$emit(`save`, $event)"
        />
        <v-btn
          class="cancel"
          variant="outlined"
          density="compact"
          :text="$t(`cancel`)"
          @click="$emit(`close`, $event)"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
interface Props {
  modelValue?: boolean;
  title?: string;
  disabled?: boolean;
}

defineProps<Props>();
defineEmits(["save", "close", "update:modelValue"]);
</script>

<style lang="scss">
.v-card {
  background: rgba(247, 251, 255, 1);
  padding: 20px 16px !important;
  &-title {
    margin-left: 10px;
    margin-right: 10px;
  }
  .action-buttons {
    margin-left: 10px;
    button {
      padding: 12px 24px;
      height: auto;
    }
    .cancel {
      border: 1px solid rgba(24, 139, 241, 1);
      color: rgba(24, 139, 241, 1);
    }
  }
}
</style>
