<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("faqEditor") }}
        </h1>
        <div class="hint" v-html="$t(`faqHint`)" />
        <v-divider color="#000" :thickness="2" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-progress-linear :active="loading" indeterminate color="#188bf1" />
        <template v-if="loaded">
          <FAQTree
            :model-value="tree"
            :loading="loading"
            @add="addItem"
            @change="changeItem"
            @delete="deleteItem"
          />
          <v-btn
            density="compact"
            color="yellow"
            variant="flat"
            class="my-2 br-8"
            @click="addItemToRoot"
            >{{ $t(`addElement`) }}</v-btn
          >
        </template>
      </v-col>
      <FAQForm
        v-if="loaded"
        v-model="editableItem"
        :saving="saving"
        @submit="submitEdit"
        @clear="clearEditable"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { v4 as uuidv4 } from "uuid";

import { faqService } from "@/bootstrap";
import { isFaqResponseBody, type FaqItem } from "@services/types";
import FAQTree from "@components/faq/FAQTree.vue";
import FAQForm from "@components/faq/FAQForm.vue";

const toast = useToast();
const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const loaded = ref<boolean>(false);
const tree = ref<FaqItem[]>([]);
const originalItem = ref<FaqItem>();
const editableItem = ref<FaqItem>();

const fetchTree = async () => {
  loading.value = true;

  const response = await faqService.get();
  const { data, meta } = response;
  const { message, success } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  if (isFaqResponseBody(data)) {
    tree.value = data;
    loaded.value = true;
  }

  loading.value = false;
};

const save = async () => {
  loading.value = saving.value = true;

  const response = await faqService.save(tree.value);
  const { meta } = response;
  const { message, success } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  loading.value = saving.value = false;
};

const injectNewItem = (container: FaqItem[]) => {
  const item = {
    id: uuidv4(),
    answer: "",
    name: "",
  };

  container.push(item);
  changeItem(item);
};

const addItem = (item: FaqItem) => {
  if (!Array.isArray(item.children)) {
    item.children = [];
  }

  injectNewItem(item.children);
};

const addItemToRoot = () => {
  injectNewItem(tree.value);
};

const changeItem = (item: FaqItem) => {
  originalItem.value = item;
  editableItem.value = { ...item };
};

const deleteItem = ({
  item: container,
  id,
}: {
  item: FaqItem[];
  id: string;
}) => {
  const index = container.findIndex(({ id: itemId }) => itemId === id);

  if (index === -1) {
    return;
  }

  const isEditable = editableItem.value?.id === id;

  if (isEditable) {
    clearEditable();
  }

  container.splice(index, 1);
};

const clearEditable = () => {
  originalItem.value = undefined;
  editableItem.value = undefined;
};

const submitEdit = async () => {
  if (!originalItem.value) {
    return;
  }

  Object.assign(originalItem.value, editableItem.value);
};

watch(
  () => tree,
  () => save(),
  { deep: true },
);

onBeforeMount(async () => {
  await fetchTree();
});
</script>
<style lang="scss" scoped>
.hint {
  margin: 4px;
}
</style>
