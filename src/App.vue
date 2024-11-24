<template>
  <a-layout>
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      :style="{ height: '100vh', left: 0, top: 0, bottom: 0 }"
    >
    <div class="logo" ></div>
      <a-menu v-model:selectedKeys="smartHorsesStore.level" theme="dark" mode="inline">
        <a-menu-item :key="2">Principiante</a-menu-item>
        <a-menu-item :key="4">Amateur</a-menu-item>
        <a-menu-item :key="6">Experto</a-menu-item>
      </a-menu>
    </a-layout-sider >
    <a-layout>
      <a-layout-header :style="{ background: '#fff' }" >
        <a-page-header
          title="Smart Horses"
        />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0', height: '80vh' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <SmartHorses/>
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { useSmartHorsesStore } from './stores/smartHorsesStore';
import SmartHorses from './components/SmartHorses.vue';

const smartHorsesStore = useSmartHorsesStore()
</script>

<style scoped>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}
</style>
