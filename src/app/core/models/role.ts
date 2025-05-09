// roles.ts
export interface Role {
id: number;
name: string;
}

export const ROLES: Role[] = [
{ id: 1, name: 'Company' },
{ id: 2, name: 'Developer' },
{ id: 3, name: 'Administrador' }
];