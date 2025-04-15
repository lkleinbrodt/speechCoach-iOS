import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Wallet } from 'lucide-react-native';
import { router } from 'expo-router';
import { useBalance } from '@/contexts/BalanceContext';

export default function BalanceDisplay() {
  const { balance } = useBalance();

  return (
    <TouchableOpacity
      onPress={() => router.push('/(protected)/add-funds')}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <Text style={styles.label}>Available Credit</Text>
            <Text style={styles.balance}>${balance?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Wallet size={20} color="#007AFF" />
            <Text style={styles.addFunds}>Add Funds</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  gradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leftContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  balance: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter_600SemiBold',
  },
  iconContainer: {
    alignItems: 'center',
  },
  addFunds: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontFamily: 'Inter_500Medium',
  },
});
