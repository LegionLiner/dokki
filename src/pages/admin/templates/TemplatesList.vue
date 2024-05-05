<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("adminTemplates") }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="filter">
          <div class="country-label text-no-wrap">
            {{ $t("country") }}
          </div>
          <div class="country-input">
            <v-autocomplete
              hide-details
              clearable
              v-model="country"
              variant="outlined"
              density="compact"
              class="v-select-white"
              :loading="countriesLoading"
              :label="$t(`selectCountry`)"
              :items="countries"
            />
          </div>
          <div class="doctype-label text-no-wrap">
            {{ $t("documentType") }}
          </div>
          <div class="doctype-input">
            <v-select
              hide-details
              clearable
              v-model="documentType"
              variant="outlined"
              density="compact"
              class="v-select-white"
              :label="$t(`selectDocumentType`)"
              :items="documentTypes"
            />
          </div>
          <v-btn
            link
            variant="outlined"
            color="primary"
            class="br-8"
            :to="{ name: `admin.templates.create` }"
            >{{ $t("createTemplate") }}</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          v-if="lgAndUp"
          :items="templates"
          :headers="headers"
          :items-per-page="0"
          :loading="templatesLoading"
          class="v-table--round v-table--spacing v-table--padding bg-transparent"
        >
          <template #item.actions="{ item }">
            <div class="d-flex gc-1">
              <v-btn
                link
                color="primary"
                class="v-btn-action"
                variant="flat"
                size="x-small"
                :to="{ name: `admin.templates.edit`, params: { id: item.id } }"
                >{{ $t("edit") }}</v-btn
              >
              <v-btn
                color="red"
                class="v-btn-action"
                variant="flat"
                size="x-small"
                @click="deleteId = item.id"
                >{{ $t("delete") }}</v-btn
              >
            </div>
          </template>
          <template #item.docType="{ item }">
            <div
              class="crop"
              :style="{
                width: `inherit`,
              }"
            >
              {{ item.docType }}
            </div>
            <v-tooltip
              v-if="item.docType"
              activator="parent"
              location="top"
              :text="item.docType"
            />
          </template>
          <template #item.name="{ item }">
            <div
              class="crop"
              :style="{
                width: `inherit`,
              }"
            >
              {{ item.name }}
            </div>
            <v-tooltip activator="parent" location="top" :text="item.name" />
          </template>
          <template #item.country="{ item }">
            <div
              class="crop"
              :style="{
                width: `inherit`,
              }"
            >
              {{ item.country }}
            </div>
            <v-tooltip activator="parent" location="top" :text="item.country" />
          </template>
          <template #bottom />
        </v-data-table>
        <FlexibleTable v-else :headers="headers" :items="templates">
          <template #item.actions="{ row: { id } }">
            <div class="d-flex gc-1 gr-2 flex-wrap">
              <v-btn
                link
                color="primary"
                class="v-btn-action"
                variant="flat"
                size="x-small"
                :to="{ name: `admin.templates.edit`, params: { id } }"
                >{{ $t("edit") }}</v-btn
              >
              <v-btn
                color="red"
                class="v-btn-action"
                variant="flat"
                size="x-small"
                @click="deleteId = id"
                >{{ $t("delete") }}</v-btn
              >
            </div>
          </template>
        </FlexibleTable>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <pagination
          v-model="page"
          density="compact"
          size="large"
          :length="pages"
          :disabled="templatesLoading"
        />
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialogShown" width="auto">
      <v-card
        :text="$t(`doYouWantToDeleteTemplate`)"
        :title="$t(`deletingTemplate`)"
      >
        <v-card-actions class="justify-end">
          <v-btn color="red" @click="deleteTemplate">{{ $t("yes") }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="deleteDialogShown = false"
            >{{ $t("cancel") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts" setup>
import { computed, ref, onBeforeMount, watch, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import { useToast } from "vue-toastification";
import { DateTime } from "luxon";
import { countriesService, templatesService } from "@/bootstrap";
import {
  type Country,
  type Template,
  isCountryResponseBody,
  isTemplatesResponseBody,
} from "@services/types";
import type { GetTemplatesParams } from "@infra/types";
import type { DocType } from "@dict/types";
import { DEFAULT_DATE_TEMPLATE, type SelectItem } from "@/types";
import { DocTypes, Categories } from "@/dict";
import FlexibleTable from "@components/FlexibleTable.vue";
import Pagination from "@components/Pagination.vue";

interface TableItem {
  id: number;
  name: string;
  isPublic: string;
  category: string;
  docType: string;
  country: string;
  price: number;
  createDate: string;
}

interface Header {
  title: string;
  key: string;
  sortable?: boolean;
  width?: string | number;
}

const { t } = useI18n();
const toast = useToast();
const display = useDisplay();
const route = useRoute();
const router = useRouter();
const lgAndUp = computed<boolean>(() => display.lgAndUp.value);
const page = computed<number>({
  get() {
    const queryPage = route.query?.page;

    if (typeof queryPage === "string") {
      return Number(queryPage);
    }

    return 1;
  },
  set(value) {
    router.replace({
      ...toRaw(router.currentRoute),
      query: {
        page: value,
      },
    });
  },
});
const pages = ref<number>(1);
const deleteId = ref<number>();
const deleteDialogShown = ref<boolean>(false);
const templatesLoading = ref<boolean>(false);
const templatesData = ref<Template[]>([]);
const headers = ref<Header[]>([
  {
    title: t("table.name"),
    key: "name",
    sortable: false,
    width: "180px",
  },
  {
    title: t("table.public"),
    key: "isPublic",
    sortable: false,
  },
  {
    title: t("table.category"),
    key: "category",
    sortable: false,
    width: "68px",
  },
  {
    title: t("table.docType"),
    key: "docType",
    sortable: false,
    width: "110px",
  },
  {
    title: t("table.country"),
    key: "country",
    sortable: false,
    width: "80px",
  },
  {
    title: t("table.price"),
    key: "price",
    sortable: false,
  },
  {
    title: t("table.createDate"),
    key: "createDate",
    sortable: false,
  },
  {
    title: t("table.actions"),
    key: "actions",
    sortable: false,
  },
]);
const templates = computed<TableItem[]>(() =>
  templatesData.value.map(
    ({
      id,
      name,
      isPublic: isPublicRaw,
      docType: docTypeRaw,
      category: categoryRaw,
      country,
      price,
      createDate: createDateRaw,
    }) => {
      const isPublic = isPublicRaw ? t("yes") : t("no");
      const docTypeItem = DocTypes.find(({ id }) => id === docTypeRaw);
      const docType = docTypeItem ? t(docTypeItem.marker) : "";
      const category =
        Categories.find(({ id }) => id === categoryRaw)?.name ?? "";
      const createDate = DateTime.fromISO(createDateRaw).toFormat(
        DEFAULT_DATE_TEMPLATE,
      );

      return {
        id,
        name,
        isPublic,
        category,
        docType,
        country,
        price,
        createDate,
      };
    },
  ),
);
const country = ref<number>();
const documentType = ref<number>();
const countriesLoading = ref<boolean>(false);
const countriesData = ref<Country[]>([]);
const countries = computed<SelectItem[]>(() =>
  countriesData.value.map(({ id: value, name: title }) => ({
    title,
    value,
  })),
);
const documentTypesData = ref<DocType[]>(DocTypes);
const documentTypes = computed<SelectItem[]>(() =>
  documentTypesData.value.map(({ id: value, marker }) => ({
    title: t(marker),
    value,
  })),
);
const templatesParams = ref<GetTemplatesParams>({
  pageSize: 12,
  start: 0,
});

const fetchCountries = async () => {
  countriesLoading.value = true;

  const response = await countriesService.get();
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    countriesLoading.value = false;
    return toast.error(message);
  }

  if (isCountryResponseBody(data)) {
    countriesData.value = data.countries;
  }

  countriesLoading.value = false;
};

const fetchTemplates = async () => {
  templatesLoading.value = true;

  const response = await templatesService.getList(templatesParams.value);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    countriesLoading.value = false;
    return toast.error(message);
  }

  if (isTemplatesResponseBody(data)) {
    const { templates, count } = data;

    templatesData.value = templates;
    pages.value = Math.ceil(count / templatesParams.value.pageSize);
  }

  templatesLoading.value = false;
};

const deleteTemplate = async () => {
  const id = deleteId.value;

  if (!id) {
    return;
  }

  templatesLoading.value = true;

  const response = await templatesService.delete(id);
  const { meta } = response;
  const { success, message } = meta;

  if (!success) {
    toast.error(message);
  } else {
    toast.success(t("templateDeleted"));
  }

  deleteDialogShown.value = false;

  const params = templatesParams.value;
  const start = 0;

  page.value = 1;
  templatesParams.value = { ...params, start };
  templatesLoading.value = false;
};

watch(
  page,
  (toPage: number) => {
    const params = templatesParams.value;
    const { pageSize } = params;
    const newIndex = toPage - 1;
    const start = newIndex * pageSize;

    templatesParams.value = { ...params, start };
  },
  { immediate: true },
);

watch(country, (item) => {
  const params = templatesParams.value;
  const countryId = item;
  const start = 0;

  page.value = 1;
  templatesParams.value = { ...params, countryId, start };
});

watch(documentType, (item) => {
  const params = templatesParams.value;
  const docType = item;
  const start = 0;

  page.value = 1;
  templatesParams.value = { ...params, docType, start };
});

watch(templatesParams, () => fetchTemplates());

watch(deleteId, (id) => {
  if (id !== undefined) {
    deleteDialogShown.value = true;
  }
});

watch(deleteDialogShown, (shown) => {
  if (!shown) {
    deleteId.value = undefined;
  }
});

onBeforeMount(async () => {
  await Promise.allSettled([fetchTemplates(), fetchCountries()]);
});
</script>
<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";
.crop {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.filter {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto;
  align-items: center;
  column-gap: 16px;
  row-gap: 4px;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    grid-template-columns: auto 1fr;
  }
}

.v-table--spacing > .v-table__wrapper > table {
    border-spacing: 0 0.67rem !important;
}

.v-table .v-table__wrapper>table>thead>tr>th {
  font-weight: 700 !important;
  border-bottom: none !important;
}

.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>td,
.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>th {
  border-bottom: none !important;
}

.v-input--density-compact {
  .v-field__outline {
    --v-border-color: rgba(205, 221, 245, 1);
    --v-field-border-opacity: 1;

    * {
      border-color: rgba(205, 221, 245, 1);

      *::after,
      *::before {
        border-color: rgba(205, 221, 245, 1);
      }
    }

    &__notch::after {
      border-color: rgba(205, 221, 245, 1) !important;
    }

    &__notch::before {
      border-color: rgba(205, 221, 245, 1) !important;
    }

    &__start,
    &__end {
      border-color: rgba(205, 221, 245, 1) !important;
    }
  }

  .v-field__input {
    border-radius: 10px;
    background: white !important;
  }
}

.v-input--density-compact.v-autocomplete--active-menu {
  .v-field__outline {
    --v-border-color: rgba(155, 171, 200, 1);
    --v-field-border-opacity: 1;

    * {
      border-color: rgba(155, 171, 200, 1);

      *::after,
      *::before {
        border-color: rgba(155, 171, 200, 1);
      }
    }

    &__notch::after {
      border-color: rgba(155, 171, 200, 1);
    }

    &__notch::before {
      border-color: rgba(155, 171, 200, 1);
    }
  }

  .v-field__input {
    border-radius: 10px;
    background: white !important;
  }
}

i.mdi-chevron-down::before {
  content: "\F0140";
  color: rgba(155, 171, 200, 1);
}

i::before {
  color: rgba(155, 171, 200, 1);
}

.v-overlay-container {
  .v-overlay {
    &__content {
      border: 1px solid rgba(155, 171, 200, 1);
      border-radius: 10px;
      box-shadow: none;
    }
  }

  .v-list::-webkit-scrollbar {
    width: 12px;
  }

  .v-list::-webkit-scrollbar-track {
    background: white;
  }

  .v-list::-webkit-scrollbar-thumb {
    background-color: rgba(155, 171, 200, 1);
    border-radius: 20px;
    border: 3px solid white;
  }
}
</style>
