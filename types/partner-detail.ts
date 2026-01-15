import { UserI } from './user'

export interface PartnerDetailI {
  id: number;
  partnerName: string;
  partnerAddress: string;
  partnerPhone: string;
  users?: UserI[];
}
