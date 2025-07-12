import { Calendar, History, Play } from 'lucide-react-native';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import EmptyState from '@/components/EmptyState';
import { Recording } from '@/types';
import { getRecordings } from '@/api/recordings';
import { router } from 'expo-router';
import { useRecordings } from '@/contexts/RecordingsContext';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

export default function HistoryScreen() {
  const { recordings, loading, error, loadRecordings } = useRecordings();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecordings();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecordings();
    setRefreshing(false);
  }, [loadRecordings]);

  //grab historical recordings from the recordings
  const renderItem = ({ item }: { item: Recording }) => (
    <TouchableOpacity
      style={styles.recordingCard}
      onPress={() => {
        router.push({
          pathname: '/(protected)/(tabs)/results/[id]',
          params: { id: item.id },
        });
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.recordingTitle}>{item.title}</Text>
        {/* <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.analysis.clarity_score}</Text>
        </View> */}
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#666666" />
          <Text style={styles.detailText}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Play size={16} color="#666666" />
          <Text style={styles.detailText}>{item.duration}s</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>
            Review your past recordings and feedback
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRecordings}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!loading && (!recordings || recordings.length === 0)) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>
            Review your past recordings and feedback
          </Text>
        </View>
        <EmptyState
          icon={<History size={64} color="#666666" />}
          title="No Recordings Yet"
          message="Start recording your speech to get feedback and track your progress over time."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>
          Review your past recordings and feedback
        </Text>
      </View>

      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
  listContainer: {
    padding: 20,
  },
  recordingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
  },
  scoreContainer: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    color: '#666666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
