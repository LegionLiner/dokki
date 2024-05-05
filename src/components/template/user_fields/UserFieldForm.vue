<template>
  <div class="fields">
    <label for="user-field-title">
      {{ $t("labels.title") }}
    </label>
    <v-text-field
      v-model="newItem.name"
      density="compact"
      variant="outlined"
      hide-details
      id="user-field-title"
      bg-color="#fff"
      :placeholder="$t(`labels.title`)"
    />
    <label for="user-field-name">
      {{ $t("labels.fieldName") }}
    </label>
    <v-text-field
      v-model="newItem.fieldName"
      density="compact"
      variant="outlined"
      hide-details
      id="user-field-name"
      bg-color="#fff"
      :placeholder="$t(`labels.fieldName`)"
    />
    <label for="user-field-tags">
      {{ $t("labels.tags") }}
    </label>
    <v-text-field
      v-model="newItem.tag"
      density="compact"
      variant="outlined"
      hide-details
      id="user-field-tags"
      bg-color="#fff"
      :placeholder="$t(`labels.tags`)"
    />
    <LabelCheckboxPair className="checkbox">
      <template #label>
        <label for="user-field-isFile">
          {{ $t("labels.isFile") }}
        </label>
      </template>
      <v-checkbox
        v-model="newItem.isFile"
        hide-details
        density="compact"
        id="user-field-isFile"
      />
    </LabelCheckboxPair>
    <LabelCheckboxPair className="checkbox">
      <template #label>
        <label for="user-field-needReverse">
          {{ $t("labels.needReverse") }}
        </label>
      </template>
      <v-checkbox
        v-model="newItem.needToReverseText"
        hide-details
        density="compact"
        id="user-field-needReverse"
      />
    </LabelCheckboxPair>
    <LabelCheckboxPair className="checkbox">
      <template #label>
        <label for="user-field-isHidden">
          {{ $t("labels.isHidden") }}
        </label>
      </template>
      <v-checkbox
        v-model="newItem.isHidden"
        hide-details
        density="compact"
        id="user-field-isHidden"
      />
    </LabelCheckboxPair>
    <label for="user-field-default-value">
      {{ $t("labels.defaultValue") }}
    </label>
    <v-text-field
      v-model="newItem.defaultValue"
      density="compact"
      variant="outlined"
      hide-details
      id="user-field-default-value"
      bg-color="#fff"
      :placeholder="$t(`labels.defaultValue`)"
    />
    <label for="user-field-order">
      {{ $t("labels.order") }}
    </label>
    <v-text-field
      v-model="newItem.displayOrder"
      density="compact"
      variant="outlined"
      hide-details
      id="user-field-order"
      bg-color="#fff"
      :placeholder="$t(`labels.order`)"
    />
    <label for="user-field-source">
      {{ $t("labels.source") }}
    </label>
    <v-select
      hide-details
      clearable
      variant="outlined"
      density="compact"
      bg-color="#fff"
      v-model="newItem.source"
      :placeholder="$t(`labels.source`)"
      :items="sources"
    /> 
    <RandomCustomList
      v-if="isRandomCustomList"
      v-model="newItem.customListId"
      :loading="customListsLoading"
      :items="customLists"
    />
    <RandomDate
      v-if="
        source === Source.RANDOMDATE || source === Source.RANDOMDATEWITHCALENDAR
      "
      v-model="newItem.autodataTemplate"
    />
    <RandomPrice
      v-if="source === Source.RANDOMPRICE"
      v-model="newItem.autodataTemplate"
    />
    <RandomText
      v-if="source === Source.RANDOMTEXT"
      v-model="newItem.autodataTemplate"
    />
    <TemplateResultLine
      v-if="isTemplateResultLine"
      v-model:child-template-id="newItem.childTemplateId"
      v-model:child-template-result-line="newItem.childTemplateResultLine"
      v-model:autodata-template="newItem.autodataTemplate"
      :items="childrenItems"
      :loading="childrenLoading"
    />
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch, ref, computed, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";
import { DateTime } from "luxon";
import RandomCustomList from "@user-fields/RandomCustomList.vue";
import RandomDate from "@user-fields/RandomDate.vue";
import RandomPrice from "@user-fields/RandomPrice.vue";
import RandomText from "@user-fields/RandomText.vue";
import TemplateResultLine from "@user-fields/TemplateResultLine.vue";
import LabelCheckboxPair from "@components/LabelCheckboxPair.vue";
import {
  isCustomListBody,
  isTemplateChildrenResponseBody,
  type CustomList,
  type UserField,
  type TemplateChild,
} from "@services/types";
import {
  DEFAULT_DATE_TEMPLATE,
  type AutodataTemplateDate,
  type SelectItem,
  type AutoDataTemplatePrice,
  type AutoDataTemplateText,
} from "@/types";
import { type SourceItem, Source } from "@dict/types";
import { customListService, templatesService } from "@/bootstrap";
import { Sources } from "@/dict";

interface Props {
  item?: UserField;
  loading?: boolean;
}

const toast = useToast();
const props = defineProps<Props>();
const emit = defineEmits(["update:item", "update:loading"]);

const sources = ref<SourceItem[]>(Sources);
const customListsData = ref<CustomList[]>([]);
const customLists = computed<SelectItem[]>(() =>
  customListsData.value.map(({ id: value, name: title }) => ({ title, value })),
);
const customListsLoading = ref<boolean>(false);
const childrenData = ref<TemplateChild[]>([]);
const childrenLoading = ref<boolean>(false);
const childrenItems = computed<SelectItem[]>(() =>
  childrenData.value.map(({ id: value, name: title }) => ({ title, value })),
);
const isRandomCustomList = computed<boolean | undefined>(() =>
  props.item?.source
    ? [Source.RANDOMCUSTOMLIST, Source.RANDOMCUSTOMLIST_WITHBUTTON].includes(
        props.item?.source,
      )
    : undefined,
);
const newItem = reactive<Partial<UserField>>({
  id: props.item?.id,
  name: props.item?.name,
  fieldName: props.item?.fieldName,
  defaultValue: props.item?.defaultValue,
  autodataTemplate: props.item?.autodataTemplate,
  isFile: props.item?.isFile,
  source: props.item?.source,
  isHidden: props.item?.isHidden,
  needToReverseText: props.item?.needToReverseText,
  displayOrder: props.item?.displayOrder,
  childTemplateId: props.item?.childTemplateId,
  customListId: props.item?.customListId,
  childTemplateResultLine: props.item?.childTemplateResultLine,
  tag: props.item?.tag,
});

const source = computed<Source | undefined>(() => newItem.source);
const loadingRequiredData = computed<boolean>(
  () => customListsLoading.value || childrenLoading.value,
);

const templateResultLine = (source?: Source): boolean | undefined => {
  if (source === undefined) {
    return;
  }

  return [
    Source.TEMPLATE_RESULTLINE,
    Source.TEMPLATE_RESULTLINE_MRZ,
    Source.TEMPLATE_RESULTLINE_PN,
  ].includes(source);
};

const isTemplateResultLine = computed<boolean | undefined>(() =>
  templateResultLine(source.value),
);

const fetchCustomLists = async () => {
  customListsLoading.value = true;

  const response = await customListService.getList();
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    customListsLoading.value = false;

    return toast.error(message);
  }

  if (isCustomListBody(data)) {
    customListsData.value = data.lists;
  }

  customListsLoading.value = false;
};

const fetchChildren = async () => {
  childrenLoading.value = true;

  const response = await templatesService.getChildren();
  const { data, meta } = response;
  const { success, message } = meta;

  if (!success) {
    childrenLoading.value = false;

    return toast.error(message);
  }

  if (isTemplateChildrenResponseBody(data)) {
    childrenData.value = data.templates;
  }

  childrenLoading.value = false;
};

const fetchRequiredData = async (source?: Source) => {
  if (source) {
    if (
      [Source.RANDOMCUSTOMLIST, Source.RANDOMCUSTOMLIST_WITHBUTTON].includes(
        source,
      )
    ) {
      if (!customListsData.value.length) {
        fetchCustomLists();
      }
    }

    if (templateResultLine(source)) {
      if (!childrenData.value.length) {
        fetchChildren();
      }
    }
  }
};

const dateToUTC = (date: Date): string =>
  DateTime.fromJSDate(date)
    .toUTC(DateTime.local().offset, { keepLocalTime: true })
    .toISO() ?? "";

watch(newItem, (item) => emit("update:item", item));
watch(loadingRequiredData, (loading) => emit("update:loading", loading));
watch(
  () => newItem.source,
  (source) => {
    newItem.defaultValue = undefined;
    newItem.customListId = 0;
    newItem.autodataTemplate = null;

    if (source) {
      const dateSources = [Source.RANDOMDATE, Source.RANDOMDATEWITHCALENDAR];
      const isDateSource = dateSources.includes(source);

      if (isDateSource) {
        const payload: AutodataTemplateDate = {
          Template: DEFAULT_DATE_TEMPLATE,
          From: dateToUTC(new Date()),
          To: dateToUTC(new Date()),
          Days: [],
        };

        newItem.autodataTemplate = JSON.stringify(payload);
      }

      if (source === Source.RANDOMPRICE) {
        const payload: AutoDataTemplatePrice = {
          Template: "",
          Format: null,
          Min: 0,
          Max: 10,
        };

        newItem.autodataTemplate = JSON.stringify(payload);
      }

      if (source === Source.RANDOMTEXT) {
        const payload: AutoDataTemplateText = {
          Template: "",
        };

        newItem.autodataTemplate = JSON.stringify(payload);
      }
    }

    fetchRequiredData(source);
  },
);

onBeforeMount(async () => {
  await Promise.allSettled([fetchRequiredData(source.value)]);
});
</script>
