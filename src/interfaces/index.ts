export interface UserData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  address?: string;
  date_of_birth?: Date;
  id_number?: string;
  verification_status?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface WalletData {
  id?: number;
  user_id: number;
  wallet_number?: string;
  balance?: number;
  currency?: string;
  is_active?: boolean;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}


export interface LoanData {
  id?: number;
  user_id: number;
  amount: number;
  interest_rate: number;
  total_repayment_amount: number;
  tenure: number;
  start_date: Date;
  due_date: Date;
  status?: string;
  amount_repaid?: number;
  purpose?: string;
  rejection_reason?: string;
  approved_by?: number;
  approved_at?: Date;
  disbursed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface TransactionData {
  id?: number;
  user_id: number;
  wallet_id: number;
  reference?: string;
  amount: number;
  transaction_type: string;
  status?: string;
  source_wallet_id?: number;
  destination_wallet_id?: number;
  loan_id?: number;
  payment_method?: string;
  payment_details?: object;
  description?: string;
  failure_reason?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RepaymentData {
  id?: number;
  loan_id: number;
  transaction_id?: number;
  amount: number;
  due_date: Date;
  payment_date?: Date;
  status?: string;
  late_fee?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentMethodData {
  id?: number;
  user_id: number;
  payment_type: string;
  provider: string;
  account_number?: string;
  bank_code?: string;
  card_last_four?: string;
  card_expiry?: string;
  token?: string;
  is_default?: boolean;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuditLogData {
  user_id: number;
    action: 'wallet_created' | 'loan_disbursed' | 'repayment_made' | 'wallet_funded' | 'wallet_deducted' | string;
  entity: 'wallet' | 'loan' | 'repayment' | string;
  entity_id: number | string;
  description?: string;
  metadata?: Record<string, any>; // optional JSON field
  created_at?: string;
}
