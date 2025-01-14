// paymentRecordsAPI.ts
import { supabase } from '@/services/supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * payment_records schema:
 *  transaction_id (PK, auto-generated)
 *  store_number: number
 *  payment_amount: number
 *  signature: string (URL or base64 string)
 *  creation_date: string or Date
 *  additional_comments: string (optional)
 */
export interface PaymentRecord {
  transaction_id?: number;   
  store_number: string;
  payment_amount: string;
  signature: string;
  creation_date: string;    
  additional_comments?: string;
}

/**
 * createPaymentRecord
 * Inserts a new payment record into the payment_records table.
 */
export async function createPaymentRecord(record: PaymentRecord): Promise<PaymentRecord[]> {
  try {
    // 1) Check if store number exists in organization_members
    const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('member_id')
        .contains('store_number', [record.store_number])
        .single();

    if (memberError && (memberError as PostgrestError).code !== 'PGRST116') {
        console.error('Store check error:', memberError);
        throw new Error(
          (memberError as PostgrestError)?.message || 'Failed to check store number.'
        );
    }

    if (!memberData) {
        console.error(`Store number ${record.store_number} does not exist.`);
        throw new Error(`Store number ${record.store_number} does not exist in the system.`);
    }

    // If the query itself failed, or something else unexpected happened:
    if (memberError && (memberError as PostgrestError).code !== 'PGRST116') {
      console.error('Store check error:', memberError);
      throw new Error(
        (memberError as PostgrestError)?.message || 'Failed to check store number.'
      );
    }

    // If "not found" (PGRST116 means no rows), throw an error
    if (!memberData) {
      console.error(`Store number ${record.store_number} does not exist.`);
      throw new Error(`Store number ${record.store_number} does not exist in the system.`);
    }

    // 2) Insert into payment_records
    const { data, error: insertError } = await supabase
      .from('payment_records')
      .insert([record])
      .select();

    if (insertError) {
      console.error('Error inserting payment record:', insertError);
      throw new Error(insertError.message || 'Failed to create payment record.');
    }

    return data as PaymentRecord[];

  } catch (error: any) {
    console.error('Error creating payment record:', error);
    throw new Error(error.message || 'An unknown error occurred while creating payment record.');
  }
}
