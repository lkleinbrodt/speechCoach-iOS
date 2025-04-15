import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Trash2,
} from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { deleteRecording, getRecording } from '@/api/recordings';
import { useEffect, useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { Recording } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useRecordings } from '@/contexts/RecordingsContext';

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { removeRecording } = useRecordings();

  const [recording, setRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    loadRecording();
  }, [id]);

  const loadRecording = async () => {
    try {
      const data = await getRecording(id);
      if (!data) {
        setError('Recording not found');
        return;
      }
      setRecording(data);
    } catch (err) {
      setError('Failed to load recording');
      console.error('Failed to load recording:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteRecording(id);
              removeRecording(id);
              router.replace('/(protected)/(tabs)/history');
            } catch (err) {
              Alert.alert('Failed to delete recording');
              console.error('Failed to delete recording:', err);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !recording) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Recording not found'}</Text>
      </View>
    );
  }

  const analysis = recording.analysis;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Analysis',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/(protected)/(tabs)/history')}
            >
              <ChevronLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Trash2 size={24} color="#FF3B30" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerLabel}>Summary</Text>
          <Text numberOfLines={2} style={styles.headerSubtitle}>
            {recording.title}
          </Text>
        </View>
        <View style={styles.scoreCard}>
          <LinearGradient
            colors={['#007AFF', '#34C759']}
            style={styles.scoreGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.scoreLabel}>Clarity Score</Text>
            <Text style={styles.scoreValue}>
              {(analysis?.clarity_score || 0) * 10}%
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{recording.duration}s</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {analysis?.filler_word_count || 0}
            </Text>
            <Text style={styles.statLabel}>Filler Words</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Overview</Text>
          <View style={styles.keyPoints}>
            <Text style={styles.keyPointsTitle}>Key Points</Text>
            {analysis?.content_structure?.keyPoints?.map(
              (point: string, index: number) => (
                <Text key={index} style={styles.keyPoint}>
                  • {point}
                </Text>
              )
            )}
          </View>

          <TouchableOpacity
            style={styles.transcriptButton}
            onPress={() => setShowTranscript(!showTranscript)}
          >
            <Text style={styles.transcriptButtonText}>
              {showTranscript ? 'Hide' : 'Show'} Full Transcript
            </Text>
            {showTranscript ? (
              <ChevronUp size={20} color="#007AFF" />
            ) : (
              <ChevronDown size={20} color="#007AFF" />
            )}
          </TouchableOpacity>

          {showTranscript && (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcript}>{analysis?.transcript}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tone Analysis</Text>
          <View style={styles.toneGrid}>
            {analysis?.tone_analysis &&
              Object.entries(analysis.tone_analysis).map(([key, value]) => (
                <View key={key} style={styles.toneItem}>
                  <View style={styles.toneScoreContainer}>
                    <Text style={styles.toneScore}>
                      {(value * 10).toFixed(0)}%
                    </Text>
                  </View>
                  <Text style={styles.toneLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Structure</Text>
          <View style={styles.structureContainer}>
            <View style={styles.structureScores}>
              <View style={styles.structureScoreItem}>
                <Text style={styles.structureScoreValue}>
                  {(
                    (analysis?.content_structure?.organization || 0) * 10
                  ).toFixed(0)}
                  %
                </Text>
                <Text style={styles.structureScoreLabel}>Organization</Text>
              </View>
              <View style={styles.structureScoreItem}>
                <Text style={styles.structureScoreValue}>
                  {((analysis?.content_structure?.coherence || 0) * 10).toFixed(
                    0
                  )}
                  %
                </Text>
                <Text style={styles.structureScoreLabel}>Coherence</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          {analysis?.feedback ? (
            analysis.feedback.split('","').map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.suggestion}>
                  • {suggestion.replace(/[{"}]/g, '')}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.suggestion}>No suggestions available</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 20,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 120 : 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 17,
    color: '#FF3B30',
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
  scoreCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreGradient: {
    padding: 24,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
  lastSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  toneItem: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
  },
  toneScoreContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toneScore: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
  },
  toneLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  structureContainer: {
    gap: 20,
  },
  structureScores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  structureScoreItem: {
    alignItems: 'center',
  },
  structureScoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    fontFamily: 'Inter_700Bold',
  },
  structureScoreLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  keyPoints: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  keyPointsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  keyPoint: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  transcriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  transcriptButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
  },
  transcriptContainer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  transcript: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  suggestionItem: {
    marginBottom: 12,
  },
  suggestion: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  deleteButton: {
    padding: 12,
  },
  headerTitleContainer: {
    marginHorizontal: 20,

    marginTop: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerLabel: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'Inter_500Medium',
    lineHeight: 22,
  },
});
