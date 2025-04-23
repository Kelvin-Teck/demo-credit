import { Knex } from "knex";

export interface IUserData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address?: string;
  dateOfBirth?: Date;
  idNumber?: string;
  verificationStatus?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface ITransactionData {
  id?: number;
  userId: number;
  walletId: number;
  reference?: string;
  amount: number;
  transactionType: string;
  status?: string;
  sourceWalletId?: number;
  destinationWalletId?: number;
  loanId?: number;
  paymentMethod?: string;
  paymentDetails?: object;
  description?: string;
  failureReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
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


// types/auth.ts
export interface IFauxTokenData {
  expiresAt: number;
  role?: string;
  [key: string]: any; // Additional custom properties
}

export interface IAuthUser {
  [key: string]: any; // Additional user properties
}


export interface ITransfer {
  recipientWalletNumber: string;
  amount: number;
  description: string;
}

export interface IWithdraw {
  amount: number;
  paymentMethod: string;
  bankDetails: {}
}

export interface IMailData<T> {
  to: string;
  subject: string;
  template: string;
  context: T;
}

// Pool Monitoring
export interface IPoolStats {
  name: string;
  size: number;
  available: number;
  pending: number;
  max: number;
}

