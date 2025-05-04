import React, { useState } from 'react';
import { CreditCard, Phone, Building2 } from 'lucide-react';
// import { api } from '../lib/api';

interface PaymentFormProps {
  amount: number;
  bookingId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export function PaymentForm({ amount, bookingId, onSuccess, onError }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'bank' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    bankCode: '',
    bankName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleMobilePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.payments.initiateMobile({
        amount,
        phoneNumber,
        bookingId,
      });

      onSuccess(response.transactionId);
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBankPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.payments.initiateBank({
        amount,
        bankDetails,
        bookingId,
      });

      onSuccess(response.transactionId);
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      {!paymentMethod && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => setPaymentMethod('mobile')}
            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-medium">Mobile Money</h3>
              <p className="text-sm text-gray-500">Pay with Safari Pay</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('bank')}
            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Building2 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-medium">Bank Transfer</h3>
              <p className="text-sm text-gray-500">Pay via bank transfer</p>
            </div>
          </button>
        </div>
      )}

      {/* Mobile Money Payment Form */}
      {paymentMethod === 'mobile' && (
        <form onSubmit={handleMobilePayment} className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="255XXXXXXXXX"
                pattern="^255[0-9]{9}$"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Enter your Safari Pay registered number starting with 255
            </p>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setPaymentMethod(null)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Change payment method
            </button>
            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                `Pay ${amount.toLocaleString()} TZS`
              )}
            </button>
          </div>
        </form>
      )}

      {/* Bank Transfer Payment Form */}
      {paymentMethod === 'bank' && (
        <form onSubmit={handleBankPayment} className="space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <select
              id="bankName"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({
                ...bankDetails,
                bankName: e.target.value,
                bankCode: e.target.value === 'CRDB' ? '011' : '012'
              })}
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a bank</option>
              <option value="CRDB">CRDB Bank</option>
              <option value="NMB">NMB Bank</option>
            </select>
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setPaymentMethod(null)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Change payment method
            </button>
            <button
              type="submit"
              disabled={loading || !bankDetails.accountNumber || !bankDetails.bankName}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                `Pay ${amount.toLocaleString()} TZS`
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}