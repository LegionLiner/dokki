<template>
    <div @click="opened = !opened" ref="wrapperRef" class="d-flex my-lg-2 mobile-actions" :class="{ 'active': opened }">
        {{ $t("actions") }}
        <i class="mdi-chevron-down mdi v-icon notranslate v-theme--LightTheme v-icon--size-default"></i>
        <teleport to='body'>
            <div class="list" v-if="opened" :style="{ top: `${offsetTop + 37}px`, left: `${offsetLeft}px` }">
                <div class="element" @click="$emit(`itemEdit`, id)">
                    {{ $t("edit") }}
                </div>
                <div class="element" @click="$emit(`itemDuplicate`, id)">
                    {{ $t("duplicate") }}
                </div>
                <div class="element" @click="$emit(`itemDelete`, id)">
                    {{ $t("delete") }}
                </div>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineEmits(["itemEdit", "itemDuplicate", "itemDelete"]);
defineProps<{
  id: number
}>();

const wrapperRef = ref(null);
const opened = ref(false);
const offsetTop = ref(0);
const offsetLeft = ref(0);

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

<style lang="scss">
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
    width: 77px;
    gap: 2px;
  }
  @media (width < 450px) {
    width: 57px;
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