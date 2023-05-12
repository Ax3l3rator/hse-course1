<template>
  <NuxtLayout>
    <NuxtPage class="scrl" />
  </NuxtLayout>
</template>
<style>
::-webkit-scrollbar {
  width: 8px;

  /* margin-left: 10px; 1*/
}

::-webkit-scrollbar-thumb {
  max-height: 50px;
  /* border: solid 3px #202020; */
  border-radius: 7px;
  background: #292929;
}
::-webkit-scrollbar-thumb:hover {
  background: #363636;
}
</style>
<script setup></script>
