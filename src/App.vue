<template>
  <div id="app">
    <TreeNode/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TreeNode from './components/TreeNode.vue';

@Component({
  components: {
    TreeNode,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
</style>
