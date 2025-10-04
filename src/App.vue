<template>
  <RouterView></RouterView>
  <div v-if="errorStore.isError" class="globalError">{{ errorStore.message }}</div>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/components/function/errorHint'

const errorStore = useErrorStore()
</script>

<style>
.globalError{
  position: fixed !important;
  right: 16px !important;
  top: 16px !important;
  z-index: 99999 !important;
  max-width: 360px;
  padding: 10px 14px;
  background: rgba(209, 176, 176, 0.95);
  color: rgb(183, 53, 53);
  border: 3px solid rgba(183, 53, 53, 0.35);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  backdrop-filter: blur(4px);
  font-size: 25px;
  font-weight: 500;
}
</style>
