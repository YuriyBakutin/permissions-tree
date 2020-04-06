<template>
    <div>
        <div class="treeNode" v-if="!isRoot">
            <div v-bind:style="{ width: 20 * depth + 'px' }"  class="treeNode"></div>
            <div class="expandControl treeNode" @click="expanded = !expanded">{{expandedSymbol}}</div>
            <div class="space treeNode"></div>
            <div class="permissionName treeNode">{{message + ': '}}</div>
            <div class="space treeNode"></div>
            <div class="permissionControl treeNode" @click="toggleChecked">{{statusSymbol}}</div>
        </div>
        <div v-if="hasChildren && expanded" class="children">
            <TreeNode
                v-for="childData in childrenData"
                v-bind:key="childData.id"
                v-bind:permissionName="childData.name"
                v-bind:permissionId="childData.id"
                v-bind:parentId="childData.parentId"
                v-bind:checked="childData.checked"
                v-bind:parentChecked="checkedData"
                v-bind:depth="isRoot ? 0 : +depth + 1"
                v-on:need-recalculate-status="recalculateStatus"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IPermissionNode from '../IPermissionNode';
import permissionData from '../permissionData';

const CHEKED: string = '✓';
const UNCHEKED: string = '✕';
const INDETERMINATE: string = '●';
const COLLAPSED: string = '▶';
const EXPANDED: string = '▼';

@Component
export default class TreeNode extends Vue {
    @Prop({ default: null }) private permissionName?: string | undefined | null;
    @Prop({ default: null }) private permissionId?: number | undefined | null;
    @Prop({ default: null }) private parentId?: number | undefined | null;
    @Prop({ default: false }) private checked!: boolean | undefined | null;
    @Prop({ default: false }) private parentChecked!: boolean | undefined | null;
    @Prop({ default: 0 }) private depth?: number;
    // private status: boolean | null = null;
    private message: string | undefined | null = this.permissionName;
    private get isRoot(): boolean {
        return this.permissionId == null;
    }
    private checkedData: boolean | undefined | null =
        this.checked && (!this.parentId || this.parentChecked);
    private get nodeDataIndex(): number {
        return permissionData.findIndex(
            (childData) => childData.id == this.permissionId
        );
    }
    private toggleChecked(): void {
        this.checkedData = !this.checkedData
    }

    private get status(): boolean | undefined | null {
        this.getStatus();
        this.$emit('need-recalculate-status');
        return permissionData[this.permissionDataArrayIndex].status
    }
    private get statusSymbol(): string {
        const status = this.status;
        if ( status == null ) {
            return INDETERMINATE;
        }
        if ( status ) {
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
    private get permissionDataArrayIndex(): number {
        for ( let i: number = 0, max = permissionData.length; i < max; i++ ) {
            if ( permissionData[i].id == this.permissionId ) {
                return i;
            }
        }
        return -1;
    }
    private get childrenIds(): number[] {
        const childrenIds: number[] = [];
        for ( let i = 0, max = permissionData.length; i < max; i++ ) {
            if ( permissionData[i].parentId == this.permissionId ) {
                childrenIds.push(i);
            }
        }
        return childrenIds;
    }
    private get childrenData(): IPermissionNode[] {
        const childrenData: IPermissionNode[] = [];
        for ( let i = 0, max = this.childrenIds.length; i < max; i++ ) {
            childrenData.push(permissionData[this.childrenIds[i]]);
        }
        return childrenData;
    }
    private get hasChildren(): boolean {
        return this.childrenIds.length > 0;
    }
    // private getStatus(): boolean | undefined | null {
    private getStatus(): void {
        let status: boolean | undefined | null;
        if ( this.isRoot ) {
            return;
        }
        if ( !this.hasChildren ) { // Дочерних нет, каков парамтр, таков и статус
            status = this.checkedData;
        } else if ( !this.checkedData ) { // Сам параметр — запрещено, Запретить всех потомков
            this.childrenIds.forEach((i) => {
                permissionData[i].checked = false;
            })
            status = false;
        } else if (
            this.childrenIds.find((i) => !permissionData[i].status)
        ) {
            // Сам параметр — разрешено но не у всех дочерних статус определён в разрешено
            status = null;
            this.message = this.childrenData.map((c) => c.status).toString();
        } else {
            // Сам параметр — разрешено и статус всех дочерних определён в разрешено
            status = true;
        }
        permissionData[this.permissionDataArrayIndex].status = status;
    }
    private recalculateStatus() {
        this.getStatus();
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
        cursor: pointer;
        user-select: none;
    }

    .expandControl {
        width: 16px;
        height: 16px;
        justify-content: center;
        cursor: pointer;
        user-select: none;
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
