<template>
  <div
    v-if="operationType === OperationType.Deposit"
    class="d-flex align-center"
  >
    <svg
      class="mr-2"
      width="12"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.63556 7.70705C0.823088 7.89452 1.0774 7.99983 1.34256 7.99983C1.60772 7.99983 1.86203 7.89452 2.04956 7.70705L6.99956 2.75705L11.9496 7.70705C12.1382 7.88921 12.3908 7.99 12.653 7.98772C12.9152 7.98544 13.166 7.88027 13.3514 7.69487C13.5368 7.50946 13.642 7.25865 13.6442 6.99645C13.6465 6.73425 13.5457 6.48165 13.3636 6.29305L7.70656 0.636048C7.51903 0.448577 7.26472 0.343262 6.99956 0.343262C6.7344 0.343262 6.48009 0.448577 6.29256 0.636048L0.63556 6.29305C0.448089 6.48058 0.342773 6.73488 0.342773 7.00005C0.342773 7.26521 0.448089 7.51952 0.63556 7.70705Z"
        fill="#4FD141"
      />
    </svg>

    {{ $t(`deposit`) }}
  </div>

  <div
    v-if="operationType === OperationType.Withdrawal"
    class="d-flex align-center"
  >
    <svg
      class="mr-2"
      width="12"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3644 0.792952C13.1769 0.605481 12.9226 0.500166 12.6574 0.500166C12.3923 0.500166 12.138 0.605481 11.9504 0.792952L7.00044 5.74295L2.05044 0.792953C1.86184 0.610795 1.60923 0.510001 1.34704 0.512279C1.08484 0.514558 0.834028 0.619726 0.64862 0.805134C0.463212 0.990543 0.358044 1.24136 0.355766 1.50355C0.353487 1.76575 0.454281 2.01835 0.63644 2.20695L6.29344 7.86395C6.48097 8.05142 6.73528 8.15674 7.00044 8.15674C7.2656 8.15674 7.51991 8.05142 7.70744 7.86395L13.3644 2.20695C13.5519 2.01942 13.6572 1.76512 13.6572 1.49995C13.6572 1.23479 13.5519 0.98048 13.3644 0.792952Z"
        fill="#188BF1"
      />
    </svg>

    {{ $t(`withdrawal`) }}
  </div>
</template>
<script lang="ts" setup>
import { OperationType } from "@services/types";

interface Props {
  operationType: OperationType;
}

defineProps<Props>();
</script>