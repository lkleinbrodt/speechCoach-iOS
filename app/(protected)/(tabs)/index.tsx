import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import {
  Brain,
  MessageSquare,
  Mic,
  CircleStop as StopCircle,
  Volume2,
  Wand as Wand2,
} from 'lucide-react-native';
import {
  ContentModerationError,
  InsufficientBalanceError,
  analyzeRecording,
} from '@/api/recordings';
import { useEffect, useRef, useState } from 'react';

import AudioVisualizer from '@/components/AudioVisualizer';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useBalance } from '@/contexts/BalanceContext';
import { useRecordings } from '@/contexts/RecordingsContext';

export default function RecordScreen() {
  const { addRecording } = useRecordings();
  const { balance, loadBalance } = useBalance();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Load balance when component mounts
  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  // Update duration using timestamps
  useEffect(() => {
    if (isRecording && startTimeRef.current) {
      const updateDuration = () => {
        if (startTimeRef.current) {
          const currentDuration = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          setRecordingDuration(currentDuration);
        }
      };

      timerRef.current = setInterval(updateDuration, 100);
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [isRecording]);

  // Cleanup function for audio resources
  const cleanup = async () => {
    try {
      if (recordingRef.current) {
        try {
          const status = await recordingRef.current.getStatusAsync();
          // Only try to unload if the recording hasn't been unloaded
          if (status.canRecord === false) {
            await recordingRef.current.stopAndUnloadAsync();
          }
        } catch (error) {}
        recordingRef.current = null;
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      startTimeRef.current = null;

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const resetState = () => {
    setIsRecording(false);
    setIsAnalyzing(false);
    setRecordingDuration(0);
    setError(null);
    startTimeRef.current = null;
  };

  const handleInsufficientBalance = (
    required: number,
    currentBalance: number
  ) => {
    const needed = (required - currentBalance).toFixed(2);
    Alert.alert(
      'Insufficient Balance',
      `You need $${needed} more to analyze this recording. Would you like to add funds?`,
      [
        {
          text: 'Add Funds',
          onPress: () => {
            // Navigate to add funds screen (you'll need to implement this)
            router.push('/(protected)/add-funds');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const startRecording = async () => {
    try {
      resetState();

      // Request permissions
      if (permissionResponse?.status !== 'granted') {
        const permission = await requestPermission();
        if (permission.status !== 'granted') {
          throw new Error('Microphone permission not granted');
        }
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Create new recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      startTimeRef.current = Date.now();
      setIsRecording(true);
    } catch (err) {
      setError(
        'Failed to start recording. Please check your microphone permissions.'
      );
      console.error('Failed to start recording', err);
      await cleanup();
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) {
        setError('No active recording found');
        return;
      }

      setIsAnalyzing(true);
      const recording = recordingRef.current;

      try {
        await recording.stopAndUnloadAsync();
      } catch (err) {
        throw new Error('Failed to stop recording. Please try again.');
      }

      const uri = recording.getURI();

      // Clean up recording resources
      await cleanup();

      if (!uri) {
        throw new Error('Recording failed to save to device');
      }

      try {
        const result = await analyzeRecording(uri, recordingDuration);
        addRecording(result);
        // Refresh balance after successful analysis
        loadBalance();
        router.push({
          pathname: '/(protected)/(tabs)/results/[id]',
          params: { id: result.id },
        });
      } catch (err) {
        if (err instanceof InsufficientBalanceError) {
          handleInsufficientBalance(err.required, err.balance);
        } else if (err instanceof ContentModerationError) {
          Alert.alert(
            'Content Warning',
            'Your recording contains inappropriate content. Please try again with appropriate content.',
            [{ text: 'OK' }]
          );
        } else if (err instanceof Error && err.message.includes('network')) {
          Alert.alert(
            'Network Error',
            'Please check your internet connection and try again.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Analysis Failed',
            'There was an error analyzing your recording. Please try again.',
            [{ text: 'OK' }]
          );
          throw err;
        }
      }
    } catch (err) {
      console.error('Recording error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      resetState();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Record Speech</Text>
        <Text style={styles.subtitle}>
          Get AI-powered feedback on your presentation
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.recordingContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.analyzingText}>Analyzing your speech...</Text>
              <View style={styles.analyzingSteps}>
                <View style={styles.analyzingStep}>
                  <Brain size={20} color="#666666" />
                  <Text style={styles.analyzingStepText}>
                    Processing speech patterns
                  </Text>
                </View>
                <View style={styles.analyzingStep}>
                  <Volume2 size={20} color="#666666" />
                  <Text style={styles.analyzingStepText}>
                    Analyzing voice modulation
                  </Text>
                </View>
                <View style={styles.analyzingStep}>
                  <MessageSquare size={20} color="#666666" />
                  <Text style={styles.analyzingStepText}>
                    Evaluating content clarity
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <>
              {isRecording && (
                <>
                  <Text style={styles.duration}>
                    {formatDuration(recordingDuration)}
                  </Text>
                  <AudioVisualizer isRecording={isRecording} />
                  <Text style={styles.recordingTip}>
                    Speak clearly and at a natural pace
                  </Text>
                </>
              )}

              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={styles.recordButton}
              >
                <LinearGradient
                  colors={
                    isRecording
                      ? ['#FF3B30', '#FF6B6B']
                      : ['#007AFF', '#34C759']
                  }
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isRecording ? (
                    <StopCircle size={32} color="#ffffff" />
                  ) : (
                    <Mic size={32} color="#ffffff" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.buttonText}>
                {isRecording ? 'Tap to Stop' : 'Tap to Start Recording'}
              </Text>
            </>
          )}
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
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
  recordingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    fontSize: 48,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 40,
    fontFamily: 'Inter_600SemiBold',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 16,
    fontSize: 17,
    color: '#666666',
    fontFamily: 'Inter_500Medium',
  },
  recordingTip: {
    fontSize: 15,
    color: '#666666',
    marginTop: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  tipsList: {
    marginTop: 12,
  },
  tipText: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  analyzingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  analyzingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  analyzingSteps: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  analyzingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyzingStepText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter_400Regular',
  },
});
