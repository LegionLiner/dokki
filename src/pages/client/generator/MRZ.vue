<template>
  <TemplateGenerator
    :template-id="templateId"
    :orderId="orderId"
    :category="category"
  />
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

const category = ref<Category>(Category.MRZ);
</script>
