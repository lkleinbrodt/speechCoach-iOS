import { APIResponse, apiClient } from './client';

interface BalanceResponse {
  balance: number;
  updated_at: string;
}

interface TransactionResponse {
  id: number;
  application: string;
  amount: number;
  transaction_type: string;
  operation: string | null;
  status: string;
  reference_id: number | null;
  metadata: any;
  created_at: string;
}

interface PaymentSheetParams {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
}

interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}

export async function getBalance(): Promise<BalanceResponse> {
  const response = await apiClient.get<BalanceResponse>('/billing/balance');
  if (!response.data) {
    throw new Error('Failed to get balance');
  }
  return response.data;
}

export async function getTransactions(): Promise<TransactionResponse[]> {
  // Only get transactions for the speech app
  const response = await apiClient.get<TransactionResponse[]>(
    '/billing/transactions?application=speech'
  );
  if (!response.data) {
    throw new Error('Failed to get transactions');
  }
  return response.data;
}

export async function createPaymentIntent(
  amount: number
): Promise<PaymentIntentResponse> {
  const response = await apiClient.post<PaymentIntentResponse>(
    '/billing/create-payment-intent',
    {
      amount,
    }
  );
  if (!response.data) {
    throw new Error('Failed to create payment intent');
  }
  return response.data;
}

export async function createPaymentSheet(
  amount: number
): Promise<PaymentSheetParams> {
  const response = await apiClient.post<PaymentSheetParams>(
    '/billing/create-payment-sheet',
    {
      amount,
    }
  );
  if (!response.data) {
    throw new Error('Failed to create payment sheet');
  }
  return response.data;
}
