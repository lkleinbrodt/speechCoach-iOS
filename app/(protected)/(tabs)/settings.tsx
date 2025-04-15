import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bell,
  ChevronRight,
  CircleHelp as HelpCircle,
  Info,
  Lock,
  LogOut,
  User,
  Wallet,
} from 'lucide-react-native';

import { router } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { useBalance } from '@/contexts/BalanceContext';

type SettingItem = {
  icon: React.ReactNode;
  title: string;
  type: 'switch' | 'link' | 'info' | 'button';
  value?: boolean;
  subtitle?: string;
  onPress?: () => void;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { balance } = useBalance();

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  const settingsSections: SettingSection[] = [
    {
      title: 'Profile',
      items: [
        {
          icon: <User size={24} color="#007AFF" />,
          title: user?.name || 'Loading...',
          subtitle: user?.email,
          type: 'link',
          onPress: () => router.push('/(protected)/profile'),
        },
      ],
    },
    {
      title: 'Balance',
      items: [
        {
          icon: <Wallet size={24} color="#34C759" />,
          title: `Balance: $${balance?.toFixed(2) || '0.00'}`,
          subtitle: 'Add funds to your account',
          type: 'link',
          onPress: () => router.push('/(protected)/add-funds'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: <LogOut size={24} color="#FF3B30" />,
          title: 'Sign Out',
          type: 'button',
          onPress: handleLogout,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex === section.items.length - 1 && styles.lastItem,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.settingItemLeft}>
                  {item.icon}
                  <View style={styles.settingItemText}>
                    <Text style={styles.settingItemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.settingItemSubtitle}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                </View>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value}
                    onValueChange={() => {}}
                    trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                    ios_backgroundColor="#D1D1D6"
                  />
                ) : item.type === 'info' ? null : (
                  <ChevronRight size={24} color="#C7C7CC" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    marginLeft: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: 12,
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'Inter_400Regular',
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
});
