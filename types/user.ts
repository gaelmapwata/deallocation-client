import { RoleI } from './role'
import { BranchI } from './branch'

export interface UserI {
  id: number;
  email: string;
  validateMaxAmountCDF: number;
  validateMaxAmountUSD: number;
  createdByUserId: number;
  validatedByUserId: number;
  locked: boolean;
  roles?: RoleI[];
  branch?: BranchI;
}
