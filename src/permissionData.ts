import IPermissionNode from './IPermissionNode';

const permissionsData: IPermissionNode[] = [
    {
        id: 1,
        name: 'Доступ к объекту #1',
        checked: true,
    },
    {
        id: 2,
        parentId: 1,
        name: 'Доступ к объекту #1.2',
        checked: true,
    },
    {
        id: 3,
        parentId: 1,
        name: 'Доступ к объекту #1.3',
        checked: true,
    },
    {
        id: 4,
        parentId: 1,
        name: 'Доступ к объекту #1.4',
        checked: true,
    },
    {
        id: 5,
        parentId: 2,
        name: 'Доступ к объекту #1.2.5',
        checked: true,
    },
    {
        id: 6,
        parentId: 2,
        name: 'Доступ к объекту #1.2.6',
        checked: true,
    },
    {
        id: 7,
        parentId: 3,
        name: 'Доступ к объекту #1.3.7',
        checked: true,
    },
    {
        id: 8,
        parentId: 6,
        name: 'Доступ к объекту #1.2.6.8',
        checked: true,
    },
    {
        id: 11,
        parentId: 10,
        name: 'Доступ к объекту #10.11',
        checked: true,
    },
    {
        id: 10,
        name: 'Доступ к объекту #10',
        checked: true,
    },
];

export default permissionsData;
