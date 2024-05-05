<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("aamvaGen") }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DocumentSelect :model-value="category" :to="to" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { LocationAsRelativeRaw } from "vue-router";
import DocumentSelect from "@components/DocumentSelect.vue";
import { Category } from "@/types";

const category = ref<Category>(Category.AAMVA);
const to = ref<LocationAsRelativeRaw>({ name: "generator.aamva" });
</script>
