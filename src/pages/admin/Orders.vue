<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("listOfOrders") }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="filter">
          <div class="text-no-wrap">
            {{ $t(`username`) }}
          </div>
          <v-text-field v-model="ordersParams.username" density="compact" hide-details bg-color="#fff"
            :placeholder="$t(`username`)" @keyup.enter="debounceFetch" @blur="debounceFetch" />
          <div class="text-no-wrap">
            {{ $t(`country`) }}
          </div>
          <v-autocomplete hide-details clearable v-model="ordersParams.countryId" variant="outlined" density="compact"
            class="v-select-white" :loading="countriesLoading" :label="$t(`selectCountry`)" :items="countries"
            @update:model-value="debounceFetch" />
          <div class="text-no-wrap">
            {{ $t(`documentType`) }}
          </div>
          <v-select hide-details clearable v-model="ordersParams.docType" variant="outlined" density="compact"
            class="v-select-white" :label="$t(`selectDocumentType`)" :items="documentTypes"
            @update:model-value="debounceFetch" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table v-if="lgAndUp" :items="orders" :headers="headers" :items-per-page="0"
          class="v-table--round v-table--spacing v-table--padding bg-transparent text-truncate">
          <template #bottom />
        </v-data-table>
        <FlexibleTable v-else :headers="headers" :items="orders" :isOrders="true">
          <template #item.date="{ row: { item } }">
            <div class="mb-2 my-lg-2 wrap-spaces">
             {{ formatDate(item.date) }}
            </div>
          </template>
        </FlexibleTable>
      </v-col>
    </v-row>
    <template v-if="!!orders.length">
      <v-row>
        <v-col cols="12">
          <pagination v-model="page" density="compact" size="large" :length="pages" :disabled="loading" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeMount, reactive, watch } from "vue";
import { useToast } from "vue-toastification";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { DateTime } from "luxon";
import { debounce } from "lodash-es";
import { countriesService, ordersService } from "@/bootstrap";
import { DEFAULT_DATE_TEMPLATE, type SelectItem } from "@/types";
import {
  type Order,
  type Country,
  type UploadedFile,
  isOrderListBody,
  isCountryResponseBody,
} from "@services/types";
import type { DocType, Status } from "@dict/types";
import { DocTypes, Statuses } from "@/dict";
import type { GetAdminOrdersParams } from "@infra/types";
import FlexibleTable from "@components/FlexibleTable.vue";
import Pagination from "@components/Pagination.vue";

interface TableItem {
  id: number;
  date: string;
  userName: string;
  country: string;
  docType: string;
  count: number;
  price: number;
  amount: number;
  status: string;
  files: UploadedFile[] | null;
}

interface Header {
  title: string;
  key: string;
  sortable?: boolean;
  width?: string | number;
  minWidth?: string;
}

let searchIter = 0;
const { t } = useI18n();
const toast = useToast();
const display = useDisplay();
const page = ref<number>(1);
const pages = ref<number>(1);
const loading = ref<boolean>(false);
const prevQuery = ref<string>("");
const lgAndUp = computed<boolean>(() => display.lgAndUp.value);
const statuses = ref<Status[]>(Statuses);
const documentTypesData = ref<DocType[]>(DocTypes);
const documentTypes = computed<SelectItem[]>(() =>
  documentTypesData.value.map(({ id: value, marker }) => ({
    title: t(marker),
    value,
  })),
);
const ordersData = ref<Order[]>([]);
const orders = computed<TableItem[]>(() =>
  ordersData.value.map(
    ({
      id,
      date: dateRaw,
      userName,
      country,
      docType: docTypeRaw,
      count,
      price,
      amount,
      status: statusRaw,
      files,
    }) => {
      const date = DateTime.fromISO(dateRaw).toFormat(DEFAULT_DATE_TEMPLATE);
      const docTypeItem = documentTypesData.value.find(
        ({ id: typeId }) => typeId === docTypeRaw,
      );
      const docType = docTypeItem ? t(docTypeItem.marker) : "";
      const statusItem = statuses.value.find(
        ({ id: statusId }) => statusId === statusRaw,
      );
      const status = statusItem ? t(statusItem.marker) : "";

      return {
        id,
        date,
        userName,
        country,
        docType,
        count,
        price,
        amount,
        status,
        files,
      };
    },
  ),
);
const headers = computed<Header[]>(() => [
  {
    key: "id",
    title: t(`table.id`),
    sortable: false,
    minWidth: `42px`,
  },
  {
    key: "date",
    title: t(`table.date`),
    sortable: false,
    minWidth: "77px",
  },
  {
    key: "userName",
    title: t(`table.user`),
    sortable: false,
    minWidth: "96px",
  },
  {
    key: "country",
    title: t(`table.country`),
    sortable: false,
    minWidth: "50px",
  },
  {
    key: "docType",
    title: t(`table.docType`),
    sortable: false,
    minWidth: "101px",
  },
  {
    key: "count",
    title: t(`table.count`),
    sortable: false,
    minWidth: "81px",
  },
  {
    key: "price",
    title: t(`table.price`),
    sortable: false,
    minWidth: "75px",
  },
  {
    key: "amount",
    title: t(`table.sum`),
    sortable: false,
    minWidth: "48px",
  },
  {
    key: "status",
    title: t(`table.status`),
    sortable: false,
    minWidth: "69px",
  },
  {
    key: "files",
    title: t(`table.files`),
    sortable: false,
    minWidth: "49px",
  },
]);

const ordersParams = reactive<GetAdminOrdersParams>({
  pageSize: 12,
  start: 0,
});

const countriesLoading = ref<boolean>(false);
const countriesData = ref<Country[]>([]);
const countries = computed<SelectItem[]>(() =>
  countriesData.value.map(({ id: value, name: title }) => ({
    title,
    value,
  })),
);

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

const fetchOrders = async () => {
  loading.value = true;

  const currentSearchIter = searchIter;
  const response = await ordersService.getAdminList(ordersParams);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  if (isOrderListBody(data)) {
    const { orders, count } = data;

    if (searchIter === currentSearchIter) {
      ordersData.value = orders;
      pages.value = Math.ceil(count / ordersParams.pageSize);
    }
  }

  loading.value = false;
};

const runFetch = () => {
  if (JSON.stringify(ordersParams) === prevQuery.value) {
    return;
  }

  prevQuery.value = JSON.stringify(ordersParams);
  searchIter++;
  fetchOrders();
};

function formatDate(date: string) {
  return date.slice(0, 6) + date.split('/')[2].slice(2, 4)
}

const debounceFetch = debounce(() => {
  // drop page number if it's not first
  // watcher runs fetch
  if (page.value !== 1) {
    page.value = 1;

    return;
  }

  // if it's first page
  // force run fetching
  runFetch();
}, 500);

watch(page, (value) => {
  const params = { ...ordersParams };
  const { pageSize } = params;
  const newIndex = value - 1;
  const start = newIndex * pageSize;

  Object.assign(ordersParams, { ...params, start });

  runFetch();
});

onBeforeMount(async () => {
  await Promise.allSettled([fetchCountries(), fetchOrders()]);
});
</script>

<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";

.filter {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto 1fr;
  align-items: center;
  column-gap: 16px;
  row-gap: 4px;

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    grid-template-columns: auto 1fr;
  }
}

.v-table--spacing>.v-table__wrapper>table {
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

.v-table .v-data-table__tr .v-data-table__td {
  max-width: 200px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
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

.v-table:not(.balance-table-descktop) > .v-table__wrapper > table > thead > tr:last-child > th:last-child {
  width: 100px !important;
}
.v-table:not(.balance-table-descktop) > .v-table__wrapper > table > thead > tr:last-child > th:first-child {
  width: 70px !important;
}
.v-table:not(.balance-table-descktop) > .v-table__wrapper > table > thead > tr:last-child {
  > th:nth-child(2) {
    width: 150px !important;
  }
  > th:nth-child(3) {
    width: 150px !important;
  }
  > th:nth-child(4) {
    width: 120px !important;
  }
  > th:nth-child(5) {
    width: 150px !important;
  }
  > th:nth-child(6), > th:nth-child(7), > th:nth-child(8) {
    width: 80px !important;
  }
  > th:nth-child(9) {
    width: 240px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}
.v-table:not(.balance-table-descktop) > .v-table__wrapper > table > tbody > tr {
  > td:nth-child(4) {
    max-width: 0;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  > td:nth-child(6), > td:nth-child(7), > td:nth-child(8) {
    width: 80px !important;
  }
}
</style>
