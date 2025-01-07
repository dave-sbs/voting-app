import { supabase } from '@/services/supabaseClient';

/**
 * payment_records schema (example):
 * transaction_id (PK, auto-generated)
 * store_number: number
 * payment_amount: number
 * signature: string        (URL or base64 string)
 * creation_date: Date      (or string, if your DB expects a text/timestamp)
 * additional_comments: string
 */
export interface PaymentRecord {
  transaction_id?: number;   
  store_number: number;
  payment_amount: number;
  signature: string;
  creation_date: string;    
  additional_comments: string;
}

/**
 * createPaymentRecord
 * Inserts a new payment record into payment_records table.
 */
export async function createPaymentRecord(record: PaymentRecord): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from('payment_records')
    .insert([ record ])
    .select();

  if (error) {
    console.error('Error creating payment record:', error);
    throw new Error(error.message);
  }

  return data as PaymentRecord[];
}
