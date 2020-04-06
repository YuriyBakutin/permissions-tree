export default interface IPermissionNode {
    name: string;
    id: number;
    parentId?: number | undefined | null;
    checked: boolean;
    status?: boolean | undefined | null;
}
