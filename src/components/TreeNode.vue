<template>
    <div>
        <div class="treeNode" v-if="!isRoot">
            <div v-bind:style="{ width: 20 * depth + 'px' }"  class="treeNode"></div>
            <div class="expandControl treeNode" v-on:click="expanded = !expanded">{{expandedSymbol}}</div>
            <div class="space treeNode"></div>
            <div class="permissionName treeNode">{{permissionName + ': '}}</div>
            <div class="space treeNode"></div>
            <div class="permissionControl treeNode">{{statusSymbol}}</div>
        </div>
        <div v-if="hasChildren && expanded" class="children">
            <TreeNode
                v-for="childData in childrenData"
                v-bind:key="childData.id"
                v-bind:permissionName="childData.name"
                v-bind:permissionId="childData.id"
                v-bind:parentId="childData.parentId"
                v-bind:depth="isRoot ? 0 : +depth + 1"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import permissionData from '../permissionData.json';

const CHEKED: string = '✓';
const UNCHEKED: string = '✕';
const INDETERMINATE: string = '●';
const COLLAPSED: string = '▶';
const EXPANDED: string = '▼';

interface IPermissionNode {
    name: string;
    id: number;
    parentId?: number | undefined | null;
    checked: boolean;
}

@Component
export default class TreeNode extends Vue {
    @Prop({ default: null }) private permissionName?: string | null;
    @Prop({ default: null }) private permissionId?: number | null;
    @Prop({ default: null }) private parentId?: number | null;
    @Prop({ default: false }) private checked?: boolean;
    @Prop({ default: 0 }) private depth?: number;
    private status: boolean | null = null;
    private get statusSymbol(): string {
        if ( this.status === null ) {
            return INDETERMINATE;
        }

        if ( this.status ) {
            return CHEKED;
        }

        return UNCHEKED;
    }
    private expanded: boolean = true;
    private get expandedSymbol(): string {
        if ( !this.hasChildren ) {
            return INDETERMINATE;
        }
        if ( this.expanded ) {
            return EXPANDED;
        }
        return COLLAPSED;
    }
    private permissionData: IPermissionNode[] = permissionData;
    private isRoot: boolean = this.permissionId === null;
    private get childrenData(): IPermissionNode[] {
        return this.permissionData.filter(
            (item: IPermissionNode) => item.parentId == this.permissionId
        );
    }
    private get hasChildren(): boolean {
        return this.childrenData.length > 0;
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .treeNode {
        display: flex;
        align-items: center;
    }

    .children {
        display: block;
    }

    .permissionControl {
        border-style: solid;
        border-color: black;
        border-width: 1px;
        width: 16px;
        height: 16px;
        justify-content: center;
    }

    .expandControl {
        width: 16px;
        height: 16px;
        justify-content: center;
    }

    .shift {
        width: 20px;
    }

    .space {
        width: 4px;
    }

    .permissionName {
        height: 24px;
        font-family: sans-serif;
    }

</style>
