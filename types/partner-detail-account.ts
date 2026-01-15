import { PartnerDetailI } from './partner-detail'
import { CurrencyI } from './currency'

export interface PartnerDetailAccountI {
  id: number;
  accountNumber: string;
  currencies?:CurrencyI[];
  partnerDetails?: PartnerDetailI[];
}
