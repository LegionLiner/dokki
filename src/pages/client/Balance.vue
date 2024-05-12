<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("yourBalanceIs", { balance }) }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-if="lgAndUp"
          :items="items"
          :headers="headers"
          :items-per-page="0"
          class="v-table--round v-table--spacing v-table--padding bg-transparent balance-table-descktop"
        >
          <template #item.operationType="{ item }">
            <OperationTypeComponent :operation-type="item.operationType" />
          </template>
          <template #bottom />
        </v-data-table>
        <FlexibleTable
          v-else
          :headers="headers"
          :items="items"
          :isBalance="true"
        >
          <template #item.date="{ row: { item } }">
            <div class="my-lg-2 wrap-spaces">
             {{ formatDate(item.date) }}
            </div>
          </template>
          <template #item.operationType="{ cell }">
            <OperationTypeComponent :operation-type="cell.value" />
          </template>
        </FlexibleTable>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <pagination
          v-model="page"
          density="compact"
          size="large"
          :length="pages"
          :disabled="loading"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { DateTime } from "luxon";
import { useDisplay } from "vuetify";
import { useToast } from "vue-toastification";
import { balanceService } from "@/bootstrap";
import {
  type BalanceHistoryItem,
  isBalanceHistoryBody,
  OperationType,
} from "@services/types";
import { DEFAULT_DATE_TEMPLATE } from "@/types";
import FlexibleTable from "@components/FlexibleTable.vue";
import Pagination from "@components/Pagination.vue";
import OperationTypeComponent from "@components/OperationType.vue";

interface TableItem {
  id: number;
  date: string;
  amount: string;
  balance: number;
  operationType: OperationType;
  enrollersName: string;
  comment: string;
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
const loading = ref<boolean>(false);
const page = ref<number>(1);
const pages = ref<number>(0);
const start = ref<number>(0);
const count = ref<number>(12);
const balanceData = ref<BalanceHistoryItem[]>();
const balance = ref<number>();
const items = computed<TableItem[]>(
  () =>
    balanceData.value?.map((item, id) => {
      let amount = `${item.amount}`;
      const { operationType } = item;
      const date = DateTime.fromISO(item.date).toFormat(DEFAULT_DATE_TEMPLATE);

      if (operationType === OperationType.Deposit) {
        if (item.amount > 0) {
          amount = `+${item.amount}`;
        }
      }

      if (operationType === OperationType.Withdrawal) {
        if (item.amount > 0) {
          amount = `-${item.amount}`;
        }
      }

      return {
        id,
        ...item,
        date,
        amount,
      };
    }) ?? [],
);
const headers = computed<Header[]>(() => [
  {
    key: "operationType",
    title: t("table.type"),
    sortable: false,
    minWidth: "62px",
  },
  {
    key: "date",
    title: t("table.date"),
    sortable: false,
    minWidth: "62px",
  },
  {
    key: "amount",
    title: t("table.amount"),
    sortable: false,
    minWidth: "62px",
  },
  {
    key: "balance",
    title: t("table.balance"),
    sortable: false,
    minWidth: "62px",
  },
  {
    key: "comment",
    title: t("table.comment"),
    sortable: false,
    minWidth: "62px",
  },
]);
const lgAndUp = computed<boolean>(() => display.lgAndUp.value);

const fetchBalance = async () => {
  loading.value = true;

  const response = await balanceService.getHistory(start.value, count.value);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  if (isBalanceHistoryBody(data)) {
    const {
      history,
      count: itemsCount,
      balance: { balance: balanceNum },
    } = data;

    balanceData.value = history;
    balance.value = balanceNum;
    pages.value = Math.ceil(itemsCount / count.value);
  }

  loading.value = false;
};

function formatDate(date: string) {
  return date.slice(0, 6) + date.split('/')[2].slice(2, 4)
}

watch(page, (value) => (start.value = count.value * (value - 1)));
watch(start, () => fetchBalance());

onBeforeMount(async () => {
  Promise.allSettled([fetchBalance()]);
});
</script>

<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";

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
.balance-table-descktop > .v-table__wrapper > table > thead > tr:last-child > th:nth-child(1) {
  width: 130px;
}
.balance-table-descktop > .v-table__wrapper > table > thead > tr:last-child > th:nth-child(2) {
  width: 200px;
}
.balance-table-descktop > .v-table__wrapper > table > thead > tr:last-child > th:nth-child(3) {
  width: 200px;
}
.balance-table-descktop > .v-table__wrapper > table > thead > tr:last-child > th:nth-child(4) {
  width: 200px;
}
</style>