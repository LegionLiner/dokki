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
      <v-col cols="12" lg="8">
        <div class="filter">
          <div class="country-label text-no-wrap">
            {{ $t("country") }}
          </div>
          <div class="country-input">
            <v-autocomplete hide-details clearable v-model="ordersParams.countryId" variant="outlined" density="compact"
              class="v-select-white" :loading="countriesLoading" :label="$t(`selectCountry`)" :items="countries" />
          </div>
          <div class="doctype-label text-no-wrap">
            {{ $t("documentType") }}
          </div>
          <div class="doctype-input">
            <v-select hide-details clearable v-model="ordersParams.docType" variant="outlined" density="compact"
              class="v-select-white" :label="$t(`selectDocumentType`)" :items="documentTypes" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table v-if="lgAndUp" class="v-table--round v-table--spacing v-table--padding bg-transparent desktop-table" sticky
          :items="orders" :headers="headers" :items-per-page="0">
          <template #item.actions="{ item }">
            <ClientOrdersActions :model-value="item" @delete="deleteId = item.id" @copy="redirectToGenerator(item.id)"
              @run="runOrder(item.id)" />
          </template>
          <template #item.files="{ item }">
            <div class="mb-2 my-lg-2" :class="{
              'd-flex flex-column ga-2': fetching[item.id].fetched,
            }" :style="{
              width: fetching[item.id].fetched ? 'fit-content' : 'auto',
            }">
              <v-btn v-if="!fetching[item.id].fetched" variant="outlined" color="primary"
                class="v-btn-action v-btn--primary" size="x-small" :class="{
                  'v-btn-action__icon': isShort,
                }" :loading="!!fetching[item.id]?.fetching" @click="fetchFiles(item.id)">
                <DownloadIcon v-if="isShort" />
                <template v-else>
                  {{ $t("download") }}
                </template>
              </v-btn>
              <template v-else>
                <v-btn link v-for="file in fetching[item.id].files" variant="elevated" color="success" size="x-small"
                  target="_blank" :key="file.id" :href="`${downloadFileUrl}${file.oneTimeToken}`">
                  {{ file.name }}
                </v-btn>
              </template>
            </div>
          </template>
          <template #bottom />
        </v-data-table>
        <FlexibleTable v-else :headers="headers" :items="orders">
          <template #item.actions="{ row: { item, id } }">
            <ClientOrdersActions 
            :model-value="item" 
            @delete="deleteId = id" 
            @copy="redirectToGenerator(item.id)"
            @run="runOrder($event)"
            @fetchFile="fetchFiles(id)"
            :files="fetching[id]?.files || []"
            :downloadFileUrl="downloadFileUrl" />
          </template>
          <template #item.files="{ row: { id } }">
            <div class="mb-2 my-lg-2 wrap-spaces">
              <v-btn v-if="!fetching[id].fetched && !isMobile" variant="outlined" color="primary" class="v-btn-action"
                size="x-small" :class="{
                  'v-btn-action__icon': isShort,
                }" :loading="!!fetching[id]?.fetching" @click="fetchFiles(id)">
                <DownloadIcon v-if="isShort && !isMobile" />
                <template v-else-if="!isMobile">
                  {{ $t("download") }}
                </template>
              </v-btn>
              <template v-else>
                <v-btn link v-for="file in fetching[id].files" variant="elevated" color="success" size="x-small"
                  target="_blank" :key="file.id" :href="`${downloadFileUrl}${file.oneTimeToken}`">{{ file.name
                  }}</v-btn>
              </template>
            </div>
          </template>
        </FlexibleTable>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <pagination v-model="page" density="compact" :length="pages" :disabled="loading" />
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialogShown" width="auto">
      <v-card :text="$t(`doYouWantToDeleteOrder`)" :title="$t(`deletingOrder`)" class="delete-modal">
        <v-card-actions class="justify-center">
          <v-btn color="red" :loading="deleting" @click="deleteOrder" class="v-btn-delete">{{
            $t("yes")
          }}</v-btn>
          <v-btn color="primary" variant="flat" :disabled="deleting" @click="deleteDialogShown = false">{{ $t("cancel")
            }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts" setup>
import { computed, ref, onBeforeMount, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import { useToast } from "vue-toastification";
import { countriesService, ordersService } from "@/bootstrap";
import { DateTime } from "luxon";
import {
  type Country,
  type Order,
  type UploadedFile,
  isCountryResponseBody,
  isOrderListBody,
  Status as StatusEnum,
  isOrderBody,
  Category,
} from "@services/types";
import type { GetAdminOrdersParams } from "@infra/types";
import { DEFAULT_DATE_TEMPLATE, type SelectItem } from "@/types";
import { DocTypes, Statuses } from "@/dict";
import type { DocType, Status } from "@dict/types";
import FlexibleTable from "@components/FlexibleTable.vue";
import Pagination from "@components/Pagination.vue";
import ClientOrdersActions from "@components/table/ClientOrdersActions.vue";
import DownloadIcon from "@components/icons/DownloadIcon.vue";

interface TableItem {
  id: number;
  date: string;
  userName: string;
  country: string;
  docType: string;
  count: number;
  price: number;
  status: StatusEnum;
  statusText: string;
  amount: number;
  files: UploadedFile[] | null;
  templateId: number | null;
}

interface Header {
  title: string;
  key: string;
  sortable?: boolean;
  width?: string | number;
  align?: "start" | "end" | "center" | undefined;
}

interface FetchFile {
  fetching: boolean;
  fetched: boolean;
  files: UploadedFile[];
}

type CategoryRoute = {
  [k in Category]: string;
};

const UPDATE_TIMEOUT = 5_000;

const { t } = useI18n();
const toast = useToast();
const display = useDisplay();
const router = useRouter();
const timeout = ref();
const page = ref<number>(1);
const pages = ref<number>(1);
const deleteId = ref<number>();
const loading = ref<boolean>(false);
const deleting = ref<boolean>(false);
const statuses = ref<Status[]>(Statuses);
const deleteDialogShown = ref<boolean>(false);
const lgAndUp = computed<boolean>(() => display.lgAndUp.value);
const isXs = computed<boolean>(
  () => display.xs.value && !display.smAndUp.value,
);
const isShort = computed<boolean>(() => display.width.value < 1600);
const isMobile = computed<boolean>(() => display.width.value < 600);
const fetching = reactive<Record<string, FetchFile>>({});
const downloadFileUrl = ref<string>(
  `${import.meta.env.VITE_API_ADDRESS}/order/file/`,
);
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
const headers = computed<Header[]>(() => {
  if (isXs.value) {
    return [
      {
        key: "date",
        title: t("table.date"),
        sortable: false,
      },
      {
        key: "country",
        title: t("table.country"),
        sortable: false,
      },
      {
        key: "docType",
        title: t("table.docTypeShort"),
        sortable: false,
      },
      {
        key: "statusText",
        title: t("table.status"),
        sortable: false,
      },
      {
        key: "actions",
        title: t("table.actions"),
        sortable: false,
      },
    ];
  }

  if (isShort.value) {
    return [
      {
        key: "id",
        title: t("table.id"),
        sortable: false,
      },
      {
        key: "date",
        title: t("table.date"),
        sortable: false,
      },
      {
        key: "country",
        title: t("table.country"),
        sortable: false,
      },
      {
        key: "docType",
        title: t("table.docType"),
        sortable: false,
      },
      {
        key: "count",
        title: t("table.count"),
        sortable: false,
      },
      {
        key: "price",
        title: t("table.price"),
        sortable: false,
      },
      {
        key: "amount",
        title: t("table.sum"),
        sortable: false,
      },
      {
        key: "statusText",
        title: t("table.status"),
        sortable: false,
      },
      {
        key: "actions",
        title: t("table.actions"),
        sortable: false,
        width: "154px",
      },
      {
        key: "files",
        title: t("table.files"),
        sortable: false,
        width: "95px",
      },
    ];
  }

  return [
    {
      key: "id",
      title: t("table.id"),
      sortable: false,
    },
    {
      key: "date",
      title: t("table.date"),
      sortable: false,
    },
    {
      key: "country",
      title: t("table.country"),
      sortable: false,
    },
    {
      key: "docType",
      title: t("table.docType"),
      sortable: false,
    },
    {
      key: "count",
      title: t("table.count"),
      sortable: false,
    },
    {
      key: "price",
      title: t("table.price"),
      sortable: false,
    },
    {
      key: "amount",
      title: t("table.sum"),
      sortable: false,
    },
    {
      key: "statusText",
      title: t("table.status"),
      sortable: false,
    },
    {
      key: "actions",
      title: t("table.actions"),
      sortable: false,
      width: "230px",
    },
    {
      key: "files",
      title: t("table.files"),
      sortable: false,
      width: "106px",
    },
  ];
});
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
      status,
      templateId,
      files,
    }) => {
      const date = DateTime.fromISO(dateRaw).toFormat(DEFAULT_DATE_TEMPLATE);
      const docTypeItem = documentTypesData.value.find(
        ({ id: typeId }) => typeId === docTypeRaw,
      );
      const docType = docTypeItem ? t(docTypeItem.marker) : "";
      const statusItem = statuses.value.find(
        ({ id: statusId }) => statusId === status,
      );
      const statusText = statusItem ? t(statusItem.marker) : "";

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
        statusText,
        templateId,
        files,
      };
    },
  ),
);
const ordersParams = reactive<GetAdminOrdersParams>({
  pageSize: 12,
  start: 0,
});
const categoryRoute = ref<CategoryRoute>({
  [Category.Doc]: "generator.docs.order",
  [Category.MRZ]: "generator.mrz.order",
  [Category.PN]: "generator.pn.order",
  [Category.AAMVA]: "generator.aamva.order",
  [Category.ParentTemplate]: "ParentTemplate",
});

const fetchCountries = async () => {
  countriesLoading.value = true;

  // to get countries with created templates only
  // you MUST pass magic number 0 (zero)
  const response = await countriesService.get(0);
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

  const response = await ordersService.getClientList(ordersParams);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  if (isOrderListBody(data)) {
    const { orders, count } = data;

    ordersData.value = orders;
    pages.value = Math.ceil(count / ordersParams.pageSize);
  }

  loading.value = false;
};

const fetchFiles = async (id: number) => {
  const fetchFile = fetching[id];

  fetchFile.fetching = true;

  const response = await ordersService.get(id);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    loading.value = false;
    fetchFile.fetching = false;

    return toast.error(message);
  }

  if (isOrderBody(data)) {
    const { files } = data;

    fetchFile.fetched = true;

    if (files?.length) {
      fetchFile.files = files;
    }
  }

  fetchFile.fetching = false;
};

const runOrder = async (id: number) => {
  const response = await ordersService.run(id);
  const { meta } = response;
  const { success, message } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  toast.success(t("orderProcessing"));
  await fetchOrders();
};

const deleteOrder = async () => {
  if (!deleteId.value) {
    return;
  }

  deleting.value = true;

  const response = await ordersService.delete(deleteId.value);
  const { meta } = response;
  const { success, message } = meta;

  if (!success) {
    deleting.value = false;

    return toast.error(message);
  }

  deleteDialogShown.value = false;
  deleting.value = false;

  toast.success(t("orderDeleted"));
  await fetchOrders();
};

const redirectToGenerator = (id: number) => {
  const order = ordersData.value.find(({ id: orderId }) => orderId === id);

  if (!order) {
    return;
  }

  const name = categoryRoute.value[order.category];
  const params = {
    templateId: order.templateId,
    orderId: order.id,
  };

  router.push({
    name,
    params,
  });
};

watch(ordersData, (value) => {
  const newFetching = value.reduce<Record<string, FetchFile>>(
    (result, { id }) => {
      const item: FetchFile = {
        fetching: false,
        fetched: false,
        files: [],
      };

      result[id] = item;

      return result;
    },
    {},
  );

  Object.assign(fetching, newFetching);

  const statuses = [StatusEnum.Processing, StatusEnum.Pending];
  const hasProcessing = ordersData.value.some(({ status }) =>
    statuses.includes(status),
  );

  if (hasProcessing) {
    timeout.value = setTimeout(fetchOrders, UPDATE_TIMEOUT);
  }
});

watch(page, (value) => {
  const params = { ...ordersParams };
  const { pageSize } = params;
  const newIndex = value - 1;
  const start = newIndex * pageSize;

  Object.assign(ordersParams, { ...params, start });
});

watch(ordersParams, () => fetchOrders());

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
  await Promise.allSettled([fetchCountries(), fetchOrders()]);
});
</script>
<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";

.filter {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  align-items: center;
  column-gap: 16px;
  row-gap: 4px;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    grid-template-columns: auto 1fr;
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
        border-color: rgba(205, 221, 245, 1);
      }

      &__notch::before {
        border-color: rgba(205, 221, 245, 1);
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

.v-table .v-table__wrapper>table>thead>tr>th {
  font-weight: 700 !important;
  border-bottom: none !important;
}

.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>td,
.v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>th {
  border-bottom: none !important;
}
.v-table--has-top > .v-table__wrapper > table > tbody > tr > td:last-child {
  padding: 0 !important;
}

.v-card.delete-modal {
  border-radius: 20px !important;
  padding: 20px;
  text-align: center;

  .v-btn-delete {
    border: 1px solid rgba(24, 139, 241, 1);
    color: rgba(24, 139, 241, 1) !important;
  }
}
.desktop-table {
  td {
    max-width: 0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}
.wrap-spaces {
  white-space: normal !important;
  a {
    margin-bottom: 4px;
  }
}
</style>
