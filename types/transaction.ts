export interface TransactionI {
  id: number;
  msisdn: string;
  lastName: string;
  firstName: string;
  amount: number;
  currency: string;
  errorFinacle?: string;
  errorAirtelMoney?: string;
  success: boolean;
  error: string;
  createdAt?: string;
  drAcctNum: string;
  crAcctNum: string;
}
