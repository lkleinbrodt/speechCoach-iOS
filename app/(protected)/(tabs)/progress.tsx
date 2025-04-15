import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { BarChart2 } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecordings } from '@/contexts/RecordingsContext';

interface Stats {
  overallScore: number;
  totalSpeeches: number;
  totalDuration: number;
  improvements: Array<{
    category: string;
    score: number;
  }>;
}

export default function ProgressScreen() {
  const { recordings } = useRecordings();
  const [stats, setStats] = useState<Stats>({
    overallScore: 0,
    totalSpeeches: 0,
    totalDuration: 0,
    improvements: [
      { category: 'Pace', score: 0 },
      { category: 'Clarity', score: 0 },
      { category: 'Confidence', score: 0 },
      { category: 'Structure', score: 0 },
    ],
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Calculate overall score (average of all recordings)
      const overallScore =
        recordings.length > 0
          ? recordings.reduce(
              (acc, rec) => acc + (rec.analysis?.clarity_score || 0),
              0
            ) / recordings.length
          : 0;

      // Calculate improvements
      const improvements = [
        {
          category: 'Pace',
          score:
            recordings.length > 0
              ? recordings.reduce(
                  (acc, rec) => acc + (rec.analysis?.pace_score || 0),
                  0
                ) / recordings.length
              : 0,
        },
        {
          category: 'Clarity',
          score:
            recordings.length > 0
              ? recordings.reduce(
                  (acc, rec) => acc + (rec.analysis?.clarity_score || 0),
                  0
                ) / recordings.length
              : 0,
        },
      ];

      setStats({
        overallScore: Math.round(overallScore),
        totalSpeeches: recordings.length,
        totalDuration: recordings.reduce(
          (acc, rec) => acc + (rec.duration || 0),
          0
        ),
        improvements: improvements.map((imp) => ({
          ...imp,
          score: Math.round(imp.score),
        })),
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) {
      return `${Math.round(duration)}s`;
    }
    if (duration < 3600) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.round(duration % 60);
      return `${minutes}m ${seconds}s`;
    }
    if (duration < 86400) {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    return `${Math.floor(duration / 86400)}d`;
  };

  if (!recordings || recordings.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your speaking improvements</Text>
        </View>
        <EmptyState
          icon={<BarChart2 size={64} color="#666666" />}
          title="No Progress Data Yet"
          message="Complete your first recording to start tracking your speaking progress and improvements."
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Track your speaking improvements</Text>
      </View>

      <View style={styles.scoreCard}>
        <LinearGradient
          colors={['#007AFF', '#34C759']}
          style={styles.scoreGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.scoreLabel}>Overall Score</Text>
          <Text style={styles.scoreValue}>
            {(stats.overallScore * 10).toFixed(0)}%
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalSpeeches}</Text>
          <Text style={styles.statLabel}>Total Speeches</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {formatDuration(stats.totalDuration)}
          </Text>
          <Text style={styles.statLabel}>Practice Time</Text>
        </View>
      </View>

      <View style={styles.improvementsContainer}>
        <Text style={styles.sectionTitle}>Speaking Skills</Text>
        {stats.improvements.map((item, index) => (
          <View key={index} style={styles.improvementItem}>
            <View style={styles.improvementHeader}>
              <Text style={styles.improvementCategory}>{item.category}</Text>
              <Text style={styles.improvementScore}>{item.score * 10}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${item.score * 10}%` }]}
              />
            </View>
          </View>
        ))}
      </View>
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
  improvementsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  improvementItem: {
    marginBottom: 16,
  },
  improvementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  improvementCategory: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'Inter_500Medium',
  },
  improvementScore: {
    fontSize: 17,
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
});
