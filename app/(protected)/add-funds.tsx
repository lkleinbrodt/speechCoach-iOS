import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeft, CreditCard, Plus } from 'lucide-react-native';
import {
  PlatformPay,
  PlatformPayButton,
  isPlatformPaySupported,
  useStripe,
} from '@stripe/stripe-react-native';
import { useCallback, useEffect, useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { createPaymentSheet } from '@/api/balance';
import { router } from 'expo-router';
import { useBalance } from '@/contexts/BalanceContext';

const PRESET_AMOUNTS = [5, 10, 20, 50];
const MIN_AMOUNT = 0.5;

export default function AddFundsScreen() {
  const { loadBalance } = useBalance();
  const stripe = useStripe();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);

  useEffect(() => {
    checkApplePaySupport();
  }, []);

  const checkApplePaySupport = async () => {
    if (Platform.OS === 'ios') {
      try {
        const isSupported = await isPlatformPaySupported();
        setIsApplePaySupported(isSupported);
      } catch (error) {
        console.error('Error checking Apple Pay support:', error);
        setIsApplePaySupported(false);
      }
    }
  };

  const initializePaymentSheet = useCallback(
    async (amount: number) => {
      try {
        const { paymentIntent, ephemeralKey, customer, publishableKey } =
          await createPaymentSheet(amount);

        const { error } = await stripe.initPaymentSheet({
          merchantDisplayName: 'Speech Coach AI',
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          defaultBillingDetails: {
            name: 'Jenny Rosen',
          },
          returnURL: 'speechCoach://stripe-redirect',
          applePay: isApplePaySupported
            ? {
                merchantCountryCode: 'US',
              }
            : undefined,
          googlePay: undefined,
        });

        if (error) {
          console.error('Error initializing payment sheet:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error initializing payment sheet:', error);
        throw error;
      }
    },
    [stripe, isApplePaySupported]
  );

  const handleAmountChange = (text: string) => {
    // Remove any non-digit or non-decimal characters
    const cleanedText = text.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }

    setAmount(cleanedText);
  };

  const validateAmount = (value: number): string | null => {
    if (isNaN(value)) {
      return 'Please enter a valid amount';
    }
    if (value < MIN_AMOUNT) {
      return `Minimum amount is $${MIN_AMOUNT.toFixed(2)}`;
    }
    if (value > 999999.99) {
      return 'Amount is too large';
    }
    return null;
  };

  const handlePayment = useCallback(
    async (selectedAmount?: number) => {
      try {
        setLoading(true);
        const numAmount = selectedAmount || parseFloat(amount);

        const validationError = validateAmount(numAmount);
        if (validationError) {
          Alert.alert('Invalid Amount', validationError);
          return;
        }

        // Initialize payment sheet
        await initializePaymentSheet(numAmount);

        // Present payment sheet
        const { error: paymentError } = await stripe.presentPaymentSheet();

        if (paymentError) {
          // Don't show error alert for user cancellation
          if (paymentError.code === 'Canceled') {
            setLoading(false);
            return;
          }
          Alert.alert('Error', paymentError.message);
          return;
        }

        // Payment successful
        await loadBalance();
        Alert.alert('Success', 'Payment successful!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } catch (err) {
        console.error('Payment error:', err);
        Alert.alert('Error', 'Failed to process payment. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [amount, initializePaymentSheet, stripe, loadBalance]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Funds</Text>
        <Text style={styles.subtitle}>Add credit to your account</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.presetAmounts}>
          {PRESET_AMOUNTS.map((presetAmount) => (
            <TouchableOpacity
              key={presetAmount}
              style={styles.presetButton}
              onPress={() => handlePayment(presetAmount)}
              disabled={loading}
            >
              <LinearGradient
                colors={['#007AFF', '#34C759']}
                style={styles.presetGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.presetAmount}>${presetAmount}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.orText}>or enter custom amount</Text>

        <View style={styles.customAmountContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="decimal-pad"
              returnKeyType="done"
              placeholderTextColor="#999"
              maxLength={9} // Limit total length including decimal
            />
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && styles.buttonDisabled]}
            onPress={() => handlePayment()}
            disabled={loading}
          >
            <LinearGradient
              colors={['#007AFF', '#34C759']}
              style={styles.payButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CreditCard size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Add Funds'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  backButton: {
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 17,
    color: '#666666',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  content: {
    padding: 20,
  },
  presetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  presetButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  presetGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetAmount: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  orText: {
    textAlign: 'center',
    color: '#666666',
    marginVertical: 24,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  customAmountContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    color: '#000000',
    marginRight: 8,
    fontFamily: 'Inter_400Regular',
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: '#000000',
    padding: 16,
    fontFamily: 'Inter_400Regular',
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  applePayButton: {
    width: '100%',
    height: 50,
    marginBottom: 12,
    borderRadius: 12,
  },
});
