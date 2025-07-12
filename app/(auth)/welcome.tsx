import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';

import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/auth/AuthContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignIn = async () => {
    try {
      await signIn();
      router.replace('/(protected)/(tabs)');
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  const openTermsOfService = () => {
    WebBrowser.openBrowserAsync(
      'https://github.com/yourusername/speech_ios/blob/main/docs/terms-of-service.md'
    );
  };

  const openPrivacyPolicy = () => {
    WebBrowser.openBrowserAsync(
      'https://github.com/yourusername/speech_ios/blob/main/docs/privacy-policy.md'
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Image
          source={require('@/assets/images/icon_no_background.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Speech Coach AI</Text>
        <Text style={styles.subtitle}>
          Improve your public speaking with AI-powered feedback
        </Text>

        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            cornerRadius={8}
            style={styles.appleButton}
            onPress={handleSignIn}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link} onPress={openTermsOfService}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text style={styles.link} onPress={openPrivacyPolicy}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
  subtitle: {
    fontSize: 17,
    color: '#ffffff99',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
  appleButton: {
    width: '100%',
    height: 50,
    marginBottom: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 32 + (Platform.OS === 'ios' ? 0 : 16), // Adjust for Android
    left: 24,
    right: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#ffffff99',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
});
