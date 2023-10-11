<template>
  <v-app>
    <div class="mx-auto my-auto">
      <v-btn @click="auth" class="mx-1"> Войти </v-btn>
      <v-btn @click="rem" class="mx-1"> убрать </v-btn>
    </div>
  </v-app>
</template>
<script setup>
const auth = () => {
  window.api.auth();
};
const rem = () => {
  window.api.rem();
};
// import { ipcRenderer } from 'electron';
// const login = () => {
//   ipcRenderer.invoke('console', 'clicked');
// };
</script>
