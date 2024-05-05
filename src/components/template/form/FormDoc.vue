<template>
  <label for="docType">{{ $t("labels.docType") }}</label>
  <v-select
    hide-details
    clearable
    variant="outlined"
    density="compact"
    id="docType"
    bg-color="#fff"
    :model-value="docType"
    :label="$t(`selectDocumentType`)"
    :items="documentTypes"
    @update:model-value="$emit(`update:docType`, $event)"
  />
  <label for="country">{{ $t("labels.country") }}</label>
  <v-autocomplete
    hide-details
    clearable
    variant="outlined"
    density="compact"
    id="country"
    bg-color="#fff"
    :model-value="countryId"
    :label="$t(`selectCountry`)"
    :items="countries"
    :loading="loading"
    @update:model-value="$emit(`update:countryId`, $event)"
  />
  <label for="price">{{ $t("labels.price") }}</label>
  <v-text-field
    density="compact"
    variant="outlined"
    hide-details
    id="price"
    bg-color="#fff"
    :model-value="price"
    :placeholder="$t(`labels.price`)"
    @update:model-value="$emit(`update:price`, $event)"
  />
  <label for="sampleTitle">{{ $t("labels.sampleTitle") }}</label>
  <v-text-field
    density="compact"
    variant="outlined"
    hide-details
    id="sampleTitle"
    bg-color="#fff"
    :model-value="sampleTitle"
    :placeholder="$t(`labels.sampleTitle`)"
    @update:model-value="$emit(`update:sampleTitle`, $event)"
  />
  <label for="sampleText">{{ $t("labels.sampleText") }}</label>
  <v-text-field
    density="compact"
    variant="outlined"
    hide-details
    id="sampleText"
    bg-color="#fff"
    :model-value="sampleText"
    :placeholder="$t(`labels.sampleText`)"
    @update:model-value="$emit(`update:sampleText`, $event)"
  />
  <label for="projectFile">{{ $t("labels.projectFile") }}</label>
  <div class="row">
    <div class="row__input">
      <v-file-input
        clearable
        hide-details
        density="compact"
        variant="outlined"
        id="projectFile"
        bg-color="#fff"
        prepend-icon=""
        :model-value="newProjectFiles"
        :multiple="false"
        :label="$t(`labels.file`)"
        :placeholder="$t(`labels.projectFile`)"
        @update:model-value="$emit(`update:newProjectFiles`, $event)"
      />
    </div>
    <div class="row__stored" v-if="storedProjectFiles">
      {{ $t("inDB") }}: {{ storedProjectFiles }}
    </div>
  </div>

  <label for="exampleImageFile">{{ $t("labels.exampleImageFile") }}</label>
  <div class="row">
    <div class="row__input">
      <v-file-input
        clearable
        hide-details
        density="compact"
        variant="outlined"
        id="exampleImageFile"
        bg-color="#fff"
        prepend-icon=""
        :model-value="newExampleImageFiles"
        :multiple="false"
        :label="$t(`labels.file`)"
        :placeholder="$t(`labels.exampleImageFile`)"
        @update:model-value="$emit(`update:newExampleImageFiles`, $event)"
      />
    </div>
    <div class="row__stored" v-if="storedImageFiles">
      {{ $t("inDB") }}: {{ storedImageFiles }}
    </div>
  </div>
  <label for="excelFile">{{ $t("labels.excelFile") }}</label>
  <div class="row">
    <div class="row__input">
      <v-file-input
        clearable
        hide-details
        density="compact"
        variant="outlined"
        id="excelFile"
        bg-color="#fff"
        prepend-icon=""
        :model-value="newExcelFileBatch"
        :multiple="false"
        :label="$t(`labels.file`)"
        :placeholder="$t(`labels.excelFile`)"
        @update:model-value="$emit(`update:newExcelFileBatch`, $event)"
      />
    </div>
    <div class="row__stored" v-if="storedExcelFiles">
      {{ $t("inDB") }}: {{ storedExcelFiles }}
    </div>
  </div>

  <label for="inputFiles">{{ $t("labels.inputFiles") }}</label>
  <div class="row">
    <div class="row__input">
      <v-file-input
        clearable
        hide-details
        multiple
        density="compact"
        variant="outlined"
        id="inputFiles"
        bg-color="#fff"
        prepend-icon=""
        :model-value="newInputFiles"
        :label="$t(`labels.file`)"
        :placeholder="$t(`labels.inputFiles`)"
        @update:model-value="$emit(`update:newInputFiles`, $event)"
      />
    </div>
    <div class="row__stored" v-if="storedInputFiles">
      {{ $t("inDB") }}: {{ storedInputFiles }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { type TemplateFile } from "@services/types";
import type { SelectItem } from "@/types";
import type { DocType } from "@dict/types";
import { DocTypes } from "@/dict";
import { useI18n } from "vue-i18n";

interface Props {
  docType?: number;
  countryId?: number;
  price?: number;
  sampleTitle?: string | null;
  sampleText?: string | null;
  newProjectFiles?: File[];
  newExampleImageFiles?: File[];
  newInputFiles?: File[];
  newExcelFileBatch?: File[];
  projectFiles?: TemplateFile[];
  exampleImageFiles?: TemplateFile[];
  inputFiles?: TemplateFile[];
  excelFilesBatch?: TemplateFile[];
  countries?: SelectItem[];
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits([
  "update:docType",
  "update:countryId",
  "update:price",
  "update:sampleTitle",
  "update:sampleText",
  "update:newProjectFiles",
  "update:newExampleImageFiles",
  "update:newInputFiles",
  "update:newExcelFileBatch",
]);
const { t } = useI18n();
const documentTypesData = ref<DocType[]>(DocTypes);
const documentTypes = computed<SelectItem[]>(() =>
  documentTypesData.value.map(({ id: value, marker }) => ({
    title: t(marker),
    value,
  })),
);
const storedProjectFiles = computed<string>(() =>
  joinByKey("name", props?.projectFiles),
);
const storedImageFiles = computed<string>(() =>
  joinByKey("name", props?.exampleImageFiles),
);
const storedExcelFiles = computed<string>(() =>
  joinByKey("name", props?.excelFilesBatch),
);
const storedInputFiles = computed<string>(() =>
  joinByKey("name", props?.inputFiles),
);

const joinByKey = (key: keyof TemplateFile, storage?: TemplateFile[]): string =>
  storage?.map((item) => item[key]).join(", ") ?? "";
</script>
