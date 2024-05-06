<template>
  <div class="progress">
    <v-progress-linear indeterminate color="#188bf1" :active="loading" />
  </div>
  <template v-if="!items?.length">
    <v-card variant="flat" class="text-center">
      <v-card-text class="no-data">
        {{ $t(`noDataAvailable`) }}
      </v-card-text>
    </v-card>
  </template>
  <template v-else>
    <table class="flexible rounded-t-lg w-100"
      :class="{ 'balance-table': isBalance, 'template-table-edit': isTemplate, 'orders-table': isOrders, 'template-table': isTemplateTable }">
      <thead>
        <tr>
          <th v-for="(header, headerIndex) in headers"
            class="flexible__cell flexible__cell_truncate text-left text-truncate text-center pa-2" scope="row"
            :key="headerIndex" :class="{
              'flexible__cell_rounded-start': headerIndex === 0,
              'flexible__cell_rounded-end': headerIndex === headers.length - 1,
              'flexible__cell_wide': [1, 2, 3].includes(headerIndex),
              'flexible__cell_mobile': [3, 4].includes(headerIndex),
              'flexible__cell_hide': [3, 4, 5, 6, 7, 8].includes(headerIndex),
            }">
            {{ header.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="(cell, cellIndex) in row.cells" class="flexible__cell flexible__cell_truncate text-truncate pa-2"
            :key="cellIndex" :class="{
              'flexible__cell_rounded-start': cellIndex === 0,
              'flexible__cell_rounded-end': cellIndex === row.cells.length - 1,
              'flexible__cell_mobile': [3, 4].includes(cellIndex),
              'flexible__cell_hide': [3, 4, 5, 6, 7, 8].includes(cellIndex),
            }">
            <slot v-if="$slots[`item.${cell.key}`]" :name="`item.${cell.key}`" v-bind="{ row, cell }" />
            <template v-else>
              {{ cell.value }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
<script lang="ts" setup>
import { computed } from "vue";

interface Item {
  id: number;
  [k: string]: any;
}

interface Header {
  title: string;
  key: string;
}

interface Props {
  headers: Header[];
  items: Item[];
  loading?: boolean;
  isBalance?: boolean;
  isTemplate?: boolean;
  isOrders?: boolean;
  isTemplateTable?: boolean;
}

interface FlexibleTableCell {
  key: string;
  title: string;
  value?: any;
}

interface FlexibleTableRow {
  id: number;
  cells: FlexibleTableCell[];
  item: Item;
  index: number;
}

const props = defineProps<Props>();
const rows = computed<FlexibleTableRow[]>(() => {
  const headers = props.headers;

  return props.items.map((item, index): FlexibleTableRow => {
    const cells = headers.map((header): FlexibleTableCell => {
      const { title, key } = header;
      let value;

      if (key in item) {
        //@ts-ignore
        value = item[key];
      }

      return {
        key,
        title,
        value,
      };
    });

    return {
      id: item.id,
      cells,
      item,
      index,
    };
  });
});
</script>
<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";

.flexible {
  border-collapse: separate;
  border-spacing: 0px 4px;

  @media (width < 600px) {
    font-size: 11px;

    &.balance-table {
      text-align: center;

      .flexible__cell_rounded-end {
        display: none !important;
      }
    }
  }

  &__cell {
    color: rgb(56, 56, 56);
    background-color: #fff;

    &_truncate {
      max-width: 0;
    }

    &_rounded {
      &-start {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }

      &-end {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }
  }
}

.progress {
  height: 4px;
}

.no-data {
  font-size: 1rem;
}
</style>

<style lang="scss">
.v-table--has-bottom>.v-table__wrapper>table>tbody>tr:last-child:hover>td:last-child {
  border-bottom-right-radius: 10px !important;
}

.v-table--has-bottom>.v-table__wrapper>table>tbody>tr:last-child:hover>td:first-child {
  border-bottom-left-radius: 10px !important;
}

.template-table-edit {
  @media (width < 900px) {
    .flexible__cell_mobile {
      display: none !important;
    }
  }

  @media (width < 600px) {
    .flexible__cell_hide {
      display: none !important;
    }
  }
}

.orders-table {
  @media (width < 900px) {
    >thead>tr {

      >th:nth-child(6),
      >th:nth-child(7),
      >th:nth-child(8) {
        display: none !important;
      }
    }

    >tbody>tr {

      >td:nth-child(6),
      >td:nth-child(7),
      >td:nth-child(8) {
        display: none !important;
      }
    }
  }

  @media (width < 700px) {
    >thead>tr {

      >th:nth-child(1),
      >th:nth-child(9),
      >th:nth-child(10) {
        display: none !important;
      }
    }

    >tbody>tr {

      >td:nth-child(1),
      >td:nth-child(9),
      >td:nth-child(10) {
        display: none !important;
      }
    }
  }
}

.template-table {
  > thead> tr {
    th {
      white-space: normal !important;
    }
  }
  >thead>tr:last-child {
    >th:nth-child(7) {
      @media (width < 1050px) {
        display: none;
      }
    }
  }

  >tbody>tr {
    >td:nth-child(7) {
      @media (width < 1050px) {
        display: none;
      }
    }
  }
}
</style>
