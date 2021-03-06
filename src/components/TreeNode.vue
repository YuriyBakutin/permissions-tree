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
                v-on:need-update-status="updateStatus_"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
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
    private get DataArrayIndex(): number {
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
    private childrenData: IPermissionNode[] = [];
    private updateChildrenData(): void {
        for ( let i = 0, max = this.childrenIds.length; i < max; i++ ) {
            Vue.set(this.childrenData, i, permissionData[this.childrenIds[i]])
        }
    }
    private beforeMount () {
    // private mounted () {
        this.updateChildrenData();
        this.updateStatus();
        // this.status = true;
    }
    private get hasChildren(): boolean {
        return this.childrenIds.length > 0;
    }

    private checkedData: boolean | undefined | null = this.checked;
    private toggleChecked(): void {
        permissionData[this.DataArrayIndex].checked = !this.checkedData;
        this.checkedData = permissionData[this.DataArrayIndex].checked;
        this.updateStatus();
    }
    @Watch('parentChecked') onChangeParentChecked(val: boolean, oldVal: boolean) {
        this.checkedData = this.checkedData && val;
        this.updateStatus();
    }
    private status: boolean | undefined | null = null;
    @Watch('status') onChangeStatus(val: boolean, oldVal: boolean) {
        if ( val !== oldVal ) {
            this.$emit('need-update-status', {
                id: this.permissionId,
                status: this.status
            });
        }
    }
    private get statusSymbol(): string {
        if ( this.status == null ) {
            return INDETERMINATE;
        }
        if ( this.status ) {
            return CHEKED;
        }
        return UNCHEKED;
    }
    private updateStatus_(): void {
        this.message = this.message + '>> '
    }
    private updateStatus(): void {
        let status;
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
            this.updateChildrenData();
        } else if (
            this.childrenIds.find((i) => !permissionData[i].status)
        ) {
            // Сам параметр — разрешено но не у всех дочерних статус определён в разрешено
            this.updateChildrenData();
            status = null;
            // this.message = this.childrenData.map((c) => c.id).toString();
        } else {
            // Сам параметр — разрешено и статус всех дочерних определён в разрешено
            status = true;
        }
        permissionData[this.DataArrayIndex].status = status;
        this.status = status;
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
