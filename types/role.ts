import { RessourceI } from './ressource'
import { PermissionI } from './permission'

export interface RoleI {
  id: number;
  name: string;
  permissions?: PermissionI[];
  ressources?: RessourceI[];
}

// eslint-disable-next-line no-shadow
export enum RoleE {
  ADMIN = 'admin',
  OPS = 'ops',
}
