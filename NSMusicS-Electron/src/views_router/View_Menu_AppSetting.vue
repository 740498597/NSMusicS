<script setup lang="ts">
import { onMounted } from 'vue';
import Table_Menu_AppSetting from '@/views/view_page_setting/Table_Menu_AppSetting_Line_Virtual.vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'apps'
});
</script>
<template>
  <div class="view_show">
    <Table_Menu_AppSetting/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>