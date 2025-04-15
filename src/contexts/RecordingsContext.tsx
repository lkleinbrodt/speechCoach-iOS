import React, { createContext, useCallback, useContext, useState } from 'react';

import { Recording } from '@/types';
import { getRecordings } from '@/api/recordings';

interface RecordingsContextType {
  recordings: Recording[];
  loading: boolean;
  error: string | null;
  loadRecordings: () => Promise<void>;
  removeRecording: (id: string) => void;
  addRecording: (recording: Recording) => void;
}

const RecordingsContext = createContext<RecordingsContextType | undefined>(
  undefined
);

export function RecordingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecordings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecordings();
      setRecordings(data);
    } catch (err) {
      setError('Failed to load recordings');
      console.error('Failed to load recordings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRecording = useCallback((id: string) => {
    setRecordings((prev) =>
      prev.filter((recording) => recording.id.toString() !== id)
    );
  }, []);

  const addRecording = useCallback((recording: Recording) => {
    setRecordings((prev) => [...prev, recording]);
  }, []);

  return (
    <RecordingsContext.Provider
      value={{
        recordings,
        loading,
        error,
        loadRecordings,
        removeRecording,
        addRecording,
      }}
    >
      {children}
    </RecordingsContext.Provider>
  );
}

export function useRecordings() {
  const context = useContext(RecordingsContext);
  if (context === undefined) {
    throw new Error('useRecordings must be used within a RecordingsProvider');
  }
  return context;
}
