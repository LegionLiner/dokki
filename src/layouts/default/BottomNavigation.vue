<template>
  <v-bottom-navigation
    style="position: fixed"
    class="bottom-navigation"
    :active="active"
    :height="height"
  >
    <template v-for="item in menu" :key="`${item.name} - ${index}`">
      <template v-if="item?.divider === undefined">
        <v-menu v-if="item.children?.length">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              exact
              class="align-self-center"
              :style="btnStyle"
            >
              <component :is="item.icon" />
            </v-btn>
          </template>
          <v-list
            dense
            nav
            class="pa-0 v-list--subnav"
            :opened="opened"
            :open-strategy="openStrategy"
            :selected="selected"
            @update:selected="$emit(`update:selected`, $event)"
          >
            <v-list-item
              v-for="subItem in item.children"
              link
              exact
              color="rgb(41, 128, 185)"
              class="icon-center"
              :to="subItem.to"
              :value="subItem.value"
              :prepend-icon="subItem.icon"
            >
              <template #prepend>
                <component :is="subItem.icon" />
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          v-else
          exact
          class="align-self-center"
          :style="btnStyle"
          :to="item.to"
          @click="$emit(`update:selected`, [item.title])"
        >
          <component :is="item.icon" />
        </v-btn>
      </template>
    </template>
    <v-btn
      class="align-self-center"
      :style="btnStyle"
      @click="$emit(`logout`, $event)"
    >
      <ExitIcon />
    </v-btn>
  </v-bottom-navigation>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import type { Menu, Divider } from "@/types";
import { ExitIcon } from "@components/icons";

type OpenStrategyProp = "single" | "multiple" | "list";
type MenuItem = Menu | Divider;

interface Props {
  menu: MenuItem[];
  active?: boolean;
  selected?: string[];
  openStrategy?: OpenStrategyProp;
}

defineProps<Props>();
defineEmits(["update:selected", "logout"]);

const display = useDisplay();
const opened = ref<string[]>([]);
const xs = computed<boolean>(() => display.xs.value);
const height = computed<number>(() => (xs.value ? 100 : 114));
const btnStyle = computed(() => {
  if (display.xs.value) {
    return {
      maxHeight: "58px",
      borderRadius: "8px",
      minWidth: "58px",
    };
  }

  return {
    maxHeight: "80px",
    minWidth: "80px",
    borderRadius: "8px",
  };
});
</script>
<style lang="scss">
@import "src/styles/vuetify/vars.scss";
@import "vuetify/lib/styles/settings/_variables";

.v-bottom-navigation {
  &--active {
      box-shadow: none !important;
  }
  .v-btn {
    svg {
      width: 40px;
      height: 40px;
    }
    @media (width < 600px) {
      svg {
        width: 30px;
        height: 30px;
      }
    }

    &--active {
      & > .v-btn__overlay {
        opacity: 0 !important;
      }
      svg {
        path {
          fill: $nav-bottom-active-color;
        }
      }
    }
  }
}

.v-list {
  &--subnav {
    .v-list-item {
      &--active {
        svg {
          path {
            fill: $nav-bottom-active-color;
          }
        }
      }

      &-title {
        line-height: 1.2em;
      }
    }
  }
}

@media (width < 900px) {
  .v-bottom-navigation {
    height: 75px !important;
  }
}

@media #{map-get($display-breakpoints, 'xs')} {
  .v-bottom-navigation {
    height: 60px !important;
    .v-btn {
      svg {
        width: 25px;
        height: 25px;
      }
    }

    &__content {
      & > .v-btn {
        padding: 11px !important;
        max-width: none !important;
        min-width: 36px !important;
      }
    }
  }
}
.icon-center {
    display: flex;
    justify-content: center;
  }
</style>
