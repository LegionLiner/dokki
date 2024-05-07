<template>
  <div v-if="!isMobile" class="d-flex flex-wrap ga-2 ga-sm-1 mb-2 my-lg-2">
    <v-btn link color="success" class="v-btn-action" variant="flat" size="x-small" :class="{
      'v-btn-action__icon': isShort,
    }" :disabled="modelValue.status !== Status.Created" @click="$emit(`run`, modelValue.id)">
      <PlayIcon v-if="isShort" />
      <template v-else>
        {{ $t("start") }}
      </template>
    </v-btn>
    <v-btn link color="primary" class="v-btn-action" variant="flat" size="x-small" :class="{
      'v-btn-action__icon': isShort,
    }" :disabled="!modelValue.templateId" @click="$emit(`copy`, modelValue.id)">
      <CopyIcon v-if="isShort" />
      <template v-else>
        {{ $t("copy") }}
      </template>
    </v-btn>
    <v-btn color="red" class="v-btn-action" variant="flat" size="x-small" :class="{
      'v-btn-action__icon': isShort,
    }" @click="$emit(`delete`, modelValue.id)">
      <TrashIcon v-if="isShort" />
      <template v-else>
        {{ $t("delete") }}
      </template>
    </v-btn>
  </div>
  <div v-if="isMobile" @click="opened = !opened" ref="wrapperRef" class="d-flex my-lg-2 mobile-actions"
    :class="{ 'active': opened }">
    {{ $t("actions") }}
    <i class="mdi-chevron-down mdi v-icon notranslate v-theme--LightTheme v-icon--size-default"></i>
    <teleport to='body'>
      <div class="list" v-if="opened" :style="{ top: `${offsetTop + 37}px`, left: `${offsetLeft}px`, '--left': `${offsetLeft}px` }">
        <div class="element" :disabled="modelValue.status !== Status.Created" @click="run">
          {{ $t("start") }}
        </div>
        <div class="element" :disabled="!modelValue.templateId" @click="copy">
          {{ $t("copy") }}
        </div>
        <div class="element" @click="$emit(`delete`, modelValue.id)">
          {{ $t("delete") }}
        </div>
        <div class="element" @click.stop="$emit(`fetchFile`, modelValue.id)">
          {{ $t("download") }}
        </div>
        <div v-for="file in props.files" class="element" :key="file.id" @click="download(file)">
          {{ file.name }}
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import { Status } from "@services/types";
import PlayIcon from "@components/icons/PlayIcon.vue";
import CopyIcon from "@components/icons/CopyIcon.vue";
import TrashIcon from "@components/icons/TrashIcon.vue";

interface TableItem {
  id: number;
  [k: string]: any;
}

interface Props {
  modelValue: TableItem;
  files: any[];
  downloadFileUrl: string;
}

const props = defineProps<Props>();
const emits = defineEmits(["run", "delete", "copy", "fetchFile"]);


const { width } = useDisplay();
const isShort = computed<boolean>(() => width.value < 1600);
const isMobile = computed<boolean>(() => width.value < 600);
const wrapperRef = ref(null);
const opened = ref(false);
const offsetTop = ref(0);
const offsetLeft = ref(0);

function run() {
  if (props.modelValue.status === Status.Created) {
    emits("run", props.modelValue.id);
  }
}

function copy() {  
  if (props.modelValue.templateId) {
    emits("copy", props.modelValue.id);
  }
}
function download(file: { oneTimeToken: any; }) {  
  window.open(`${props.downloadFileUrl}${file.oneTimeToken}`, '_blank');
}

document.addEventListener('click', (e: any) => {
  if (opened.value) {
    offsetTop.value = wrapperRef.value?.getBoundingClientRect().top + window.scrollY;
    offsetLeft.value = wrapperRef.value?.getBoundingClientRect().left;
  }
  
  let el = e.target;
  const nodes = [];
  nodes.push(el);

  while (el) {
    nodes.unshift(el.parentNode);
    el = el.parentNode;
  }

  const hasWrapper = nodes.reduce((res, element) => {
    return res || element === wrapperRef.value;
  }, false);

  if (!hasWrapper) {
    opened.value = false;
  }
});
</script>

<style lang="scss" scoped>
.mobile-actions {
  user-select: none;
  width: 90px;
  position: relative;
  justify-content: space-between;
  border: 1px solid rgba(227, 241, 253, 1);
  border-radius: 5px;
  padding: 8px;
  gap: 4px;
  cursor: pointer;
  transition: background 0.15s;

  @media (width < 600px) {
    width: 77px;
    padding: 8px 4px;
    gap: 2px;
  }
  @media (width < 450px) {
    width: 57px;
    padding: 8px 4px;
    gap: 2px;

    i {
      display: none;
    }
  }

  i {
    transform: rotate(0deg);
    transition: transform 0.15s;
  }

  &.active {
    background: rgba(227, 241, 253, 1);

    i {
      transform: rotate(180deg);
    }
  }
}

i::before {
  color: rgba(155, 171, 200, 1);
}

.list {
  width: 90px;
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid rgba(227, 241, 253, 1);
  border-radius: 5px;
  background: white;
  color: rgba(56, 56, 56, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 14.06px;
  border-radius: 5px;
  padding: 2px;
  z-index: 1000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (width < 600px) {
    left: calc(var(--left) - 24px) !important;
    width: 100px;
    gap: 2px;
  }

  .element {
    padding: 6px;
    color: #383838;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &[disabled=true] {
      color: rgba(155, 171, 200, 1);
    }

    &:hover {
      background: rgba(227, 241, 253, 1);
    }
  }
}
</style>
