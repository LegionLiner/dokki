<template>
  <template v-if="modelValue.source === Source.USER_TEXT">
    <v-file-input
      v-if="modelValue.isFile"
      clearable
      hide-details
      density="compact"
      variant="outlined"
      bg-color="#fff"
      prepend-icon=""
      :id="exactId"
      :model-value="files"
      :multiple="false"
      :disabled="disabled"
      :rules="rules"
      @update:model-value="$emit(`upload`, $event)"
    />
    <TextField
      v-else
      :model-value="value"
      :id="exactId"
      :disabled="disabled"
      :rules="rules"
      @update:modelValue="$emit(`update:value`, $event)"
      @change="$emit(`translate`, $event)"
    />
  </template>

  <TextFieldButton
    v-else-if="isRandomName"
    :model-value="value"
    :id="exactId"
    :text="$t(`random`)"
    :disabled="disabled"
    :rules="rules"
    @update:modelValue="$emit(`update:value`, $event)"
    @change="$emit(`translate`, $event)"
    @button:click="$emit(`random`, $event)"
  />

  <GenderSelector
    v-else-if="modelValue.source === Source.USER_GENDERSELECTOR"
    :model-value="value"
    :id="exactId"
    :disabled="disabled"
    @update:modelValue="$emit(`update:value`, $event)"
  />

  <TextFieldButton
    v-else-if="isRandomTextField(modelValue.source)"
    :model-value="value"
    :id="exactId"
    :text="$t(`random`)"
    :disabled="disabled"
    :rules="rules"
    @update:modelValue="$emit(`update:value`, $event)"
    @change="$emit(`translate`, $event)"
    @button:click="$emit(`random`, $event)"
  >
    <v-btn
      v-if="isComputableDate"
      variant="outlined"
      size="small"
      rounded="lg"
      color="primary"
      class="v-btn--inside"
      :text="$t(`compute`)"
      @click="$emit(`compute`)"
    />
  </TextFieldButton>

  <DatePicker
    v-else-if="modelValue.source === Source.USER_DATESELECTOR"
    :model-value="value"
    :id="exactId"
    :format="format"
    :disabled="disabled"
    :rules="rules"
    @update:modelValue="$emit(`update:value`, $event)"
  />

  <DatePickerInput
    v-else-if="modelValue.source === Source.RANDOMDATEWITHCALENDAR"
    :model-value="value"
    :value="value"
    :id="exactId"
    :format="format"
    @update:modelValue="$emit(`update:value`, $event)"
    @button:click="$emit(`random`, $event)"
    class="date-picker"
  >
    <v-btn
      v-if="isComputableDate"
      variant="outlined"
      size="small"
      rounded="lg"
      color="primary"
      class="v-btn--inside v-btn--primary"
      :text="$t(`compute`)"
      @click="$emit(`compute`)"
    />
  </DatePickerInput>

  <MonthSelector
    v-else-if="modelValue.source === Source.USER_MONTHSELECTOR"
    :model-value="value"
    :id="exactId"
    :disabled="disabled"
    @update:modelValue="$emit(`update:value`, $event)"
  />

  <div v-else-if="(modelValue.source === Source.USER_SIGNATURE)">
    <Modal @close="$emit('closeSignatureModal')" :isShown="signatureModal">
      <SignatureGenerator
        :model-value="modelValue.file"
        :disabled="disabled"
        :no-signature="noSignature"
        @update:model-value="addSignature"
        @update:no-signature="$emit(`update:no-signature`, $event)"
      />
  </Modal>
  </div>

  <div v-else-if="isPhotoField">
    <Modal @close="$emit('closePhotoModal')" :isShown="photoModal">
      <PhotoGenerator
      :model-value="modelValue"
      :value="modelValue.file"
      :hide-random-button="hideRandomButton"
      :template="template"
      :disabled="disabled"
      @update:value="addPhoto"
    />
    </Modal>
  </div>

  <CountrySelector
    v-else-if="modelValue.source === Source.USER_COUNTRYSELECTOR"
    :model-value="value"
    :items="countries"
    :id="exactId"
    :disabled="disabled"
    :rules="rules"
    @update:modelValue="$emit(`update:value`, $event)"
  />

  <CustomSelector
    v-else-if="modelValue.source === Source.RANDOMCUSTOMLIST"
    :model-value="value"
    :label="$t(`select`)"
    :id="exactId"
    :items="customItems"
    :disabled="disabled"
    :rules="rules"
    @update:modelValue="$emit(`update:value`, $event)"
  />

  <TextFieldButton
    v-else-if="modelValue.source === Source.TEMPLATE"
    color="primary"
    :model-value="value"
    :id="exactId"
    :text="$t(`fill`)"
    :disabled="disabled"
    @update:modelValue="$emit(`update:value`, $event)"
    @button:click="$emit(`fill`, $event)"
  />

  <div
    v-else-if="modelValue.source === Source.TEMPLATE_MRZ"
    class="d-flex ga-2 align-center"
  >
    <v-btn
      density="compact"
      variant="outlined"
      height="40px"
      color="primary"
      class="v-btn--primary"
      :text="$t(`fill`)"
      :disabled="disabled"
      @click="$emit(`fill`, $event)"
    />
    <div class="font-weight-medium">
      {{ $t("pleaseFillFields", { button: $t("fill") }) }}
    </div>
  </div>

  <ContainerButton
    v-else-if="modelValue.source === Source.RANDOMCUSTOMLIST_WITHBUTTON"
    :disabled="disabled"
    :text="$t(`random`)"
    :offset="30"
    @click="$emit(`random`, $event)"
  >
    <CustomSelector
      :model-value="value"
      :label="$t(`select`)"
      :id="exactId"
      :items="customItems"
      :disabled="disabled"
      :rules="rules"
      @update:modelValue="$emit(`update:value`, $event)"
    />
  </ContainerButton>

  <div
    v-else-if="modelValue.source === Source.TEMPLATE_PN"
    class="d-flex ga-2 align-center"
  >
    <v-btn
      density="compact"
      variant="outlined"
      height="40px"
      color="primary"
      class="v-btn--primary"
      :text="$t(`fill`)"
      :disabled="disabled"
      @click="$emit(`fill`, $event)"
    />

    <div
      :class="{
        'font-weight-medium': !value,
      }"
    >
      {{ pnFieldMessage }}
    </div>
  </div>

  <template v-else-if="modelValue.source === Source.USER_BOOLSELECTOR">
    {{ $t(`notImplemented`, { reason: ` (field type ${modelValue.source})` }) }}
  </template>

  <template v-else-if="modelValue.source === Source.TEMPLATE_RESULTLINE">
    {{ $t(`notImplemented`, { reason: ` (field type ${modelValue.source})` }) }}
  </template>

  <template v-else-if="!((isPhotoField && !photoModal) || ((modelValue.source === Source.USER_SIGNATURE) && !signatureModal))">
    {{ $t(`notImplemented`, { reason: ` (field type ${modelValue.source})` }) }}
  </template>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from "vue-i18n";
import { Source } from "@/dict/sources";
import type { UserFieldShort, TemplateShort } from "@services/types";
import type { SelectItem, Tag } from "@/types";
import { required, noSpaces, minMaxLengthClosure } from "@utils/rules";
import { parseTag } from "@/utils";
import TextField from "@components/generator/TextFieldBase.vue";
import GenderSelector from "@components/generator/GenderSelector.vue";
import TextFieldButton from "@components/generator/TextFieldButton.vue";
import DatePicker from "@components/generator/GeneratorDatePicker.vue";
import DatePickerButton from "@components/generator/DatePickerButton.vue";
import MonthSelector from "@components/generator/MonthSelector.vue";
import SignatureGenerator from "@components/generator/SignatureGenerator.vue";
import PhotoGenerator from "@components/generator/PhotoGenerator.vue";
import CustomSelector from "@components/generator/CustomSelector.vue";
import CountrySelector from "@components/generator/CountrySelector.vue";
import ContainerButton from "@components/generator/ContainerButton.vue";
import Modal from "../constructor/Modal.vue";
import DatePickerInput from "./DatePicker/DatePickerInput.vue";

interface Props {
  modelValue: UserFieldShort;
  template?: TemplateShort;
  format?: string;
  value: string | null;
  countriesLoading?: boolean;
  countries?: SelectItem<string>[];
  hideRandomButton?: boolean;
  id?: string;
  disabled?: boolean;
  fieldsRequired?: boolean;
  noSignature?: boolean;
  signatureModal?: boolean;
  photoModal?: boolean;
}

type FormRule = (v?: string | null) => boolean;

const { t } = useI18n();
const props = defineProps<Props>();
const emit = defineEmits([
  "update:value",
  "update:no-signature",
  "upload",
  "change",
  "random",
  "translate",
  "fill",
  "compute",
  "closeSignatureModal",
  "closePhotoModal",
  "updateSignature",
  "updatePhoto",
]);

const files = ref<File[]>([]);
const tag = ref<Tag | undefined>(parseTag(props.modelValue.tag));
const exactId = computed<string>(() => props?.id ?? props.modelValue.fieldName);
const formRules = computed<FormRule[]>(() => {
  const result = [required, noSpaces];

  if (tag.value?.len) {
    const [min, max] = tag.value.len.split("-");
    const closure = minMaxLengthClosure(Number(min), Number(max));

    result.push(closure);
  }

  return result;
});
const rules = computed<FormRule[] | undefined>(() =>
  props?.fieldsRequired ? formRules.value : formRules.value.slice(2),
);
// remove first 2 rules in no required mode
const isComputableDate = ref<boolean>(
  [Source.RANDOMDATE, Source.RANDOMDATEWITHCALENDAR].includes(
    props.modelValue.source,
  ) && !!tag.value?.dateSource,
);

const customItems = computed<SelectItem<string>[] | undefined>(() =>
  Array.isArray(props.modelValue.values)
    ? props.modelValue.values.map(({ value, description }) => ({
        value,
        title: description ?? value,
      }))
    : undefined,
);

const pnFieldMessage = computed<string | undefined>(() => {
  if (props.modelValue.source !== Source.TEMPLATE_PN) {
    return;
  }

  if (props.value) {
    return t("usedManuallyEntered");
  }

  const subFields = props.modelValue.subFields;
  const filled = !subFields?.some(({ value }) => !value);

  if (filled) {
    return t("willBeGeneratedOrEnter");
  }

  return t("pleaseFillFields", { button: t("fill") });
});

const isPhotoField = computed<boolean>(() =>
  [Source.USER_PHOTO, Source.RANDOMPHOTO].includes(props.modelValue.source),
);

const isRandomName = computed<boolean>(() =>
  [Source.RANDOMNAME, Source.RANDOMLASTNAME, Source.RANDOMFULLNAME].includes(
    props.modelValue.source,
  ),
);

const isRandomTextField = (source: Source): boolean => {
  const randomFieldSources = [
    Source.RANDOMDATE,
    Source.RANDOMPRICE,
    Source.RANDOMCITY,
    Source.RANDOMTEXT,
    Source.RANDOMADDRESS,
  ];

  return randomFieldSources.includes(source);
};

function addSignature(e: File) {
  props.modelValue.file = e;
  if (e) {
    emit("closeSignatureModal")
  }
}
function addPhoto(e: File) {
  props.modelValue.file = e;
  if (e) {
    emit("closePhotoModal")
  }
}

watchEffect(() => {    
  if (isPhotoField.value) {
    emit("updatePhoto", props.modelValue.file !== null);
  }
  if (props.modelValue.source === Source.USER_SIGNATURE) {
    emit("updateSignature", props.modelValue.file !== null);
  }
});
</script>
