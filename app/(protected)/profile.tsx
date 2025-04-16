import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeft, Trash2, User } from 'lucide-react-native';
import { Stack, router } from 'expo-router';

import { authService } from '@/api/auth';
import { useAuth } from '@/auth/AuthContext';

type ActionItem = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  type: 'danger' | 'default';
  onPress: () => void;
};

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Speech Profile',
      'Are you sure you want to delete your speech profile? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Profile',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.deleteSpeechProfile();
              signOut();
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to delete speech profile. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const actions: ActionItem[] = [
    {
      icon: <Trash2 size={24} color="#FF3B30" />,
      title: 'Delete Speech Profile',
      subtitle: 'Permanently delete your profile and all recordings',
      type: 'danger',
      onPress: handleDeleteAccount,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="#007AFF" />
              <Text style={styles.backText}>Settings</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={64} color="#007AFF" />
        </View>
        <Text style={styles.name}>
          {loading ? 'Loading...' : user?.name || 'No name available'}
        </Text>
        <Text style={styles.email}>
          {loading ? 'Loading...' : user?.email || 'No email available'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.sectionContent}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionItem,
                index === actions.length - 1 && styles.lastItem,
                action.type === 'danger' && styles.dangerItem,
              ]}
              onPress={action.onPress}
            >
              <View style={styles.actionItemLeft}>
                {action.icon}
                <View style={styles.actionItemText}>
                  <Text
                    style={[
                      styles.actionItemTitle,
                      action.type === 'danger' && styles.dangerText,
                    ]}
                  >
                    {action.title}
                  </Text>
                  {action.subtitle && (
                    <Text
                      style={[
                        styles.actionItemSubtitle,
                        action.type === 'danger' && styles.dangerText,
                      ]}
                    >
                      {action.subtitle}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  email: {
    fontSize: 17,
    color: '#666666',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    marginTop: 32,
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dangerItem: {
    backgroundColor: '#FFF5F5',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionItemText: {
    marginLeft: 12,
    flex: 1,
  },
  actionItemTitle: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'Inter_400Regular',
  },
  dangerText: {
    color: '#FF3B30',
  },
  actionItemSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
});
