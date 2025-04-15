import { Platform } from 'react-native';
import { Recording } from '../types';
import { apiClient } from './client';

export class InsufficientBalanceError extends Error {
  required: number;
  balance: number;

  constructor(required: number, balance: number) {
    super('Insufficient balance');
    this.name = 'InsufficientBalanceError';
    this.required = required;
    this.balance = balance;
  }
}

export class ContentModerationError extends Error {
  constructor(reason: string) {
    super(`Content Flagged: ${reason}`);
    this.name = 'ContentModerationError';
  }
}

export async function analyzeRecording(
  audioUri: string,
  duration: number
): Promise<Recording> {
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('audio', {
      uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);

    formData.append('duration', duration.toString());

    const response = await apiClient.post('/speech/analyze', formData);

    if (!response.ok) {
      if (response.status === 402) {
        // Insufficient balance error
        throw new InsufficientBalanceError(
          response.data.required,
          response.data.balance
        );
      } else if (
        response.status === 400 &&
        response.data.message?.includes('Content Flagged')
      ) {
        // Content moderation error
        throw new ContentModerationError(response.data.message);
      }
      throw new Error(response.data?.error || 'Failed to analyze recording');
    }

    return response.data as Recording;
  } catch (error) {
    if (
      error instanceof InsufficientBalanceError ||
      error instanceof ContentModerationError
    ) {
      throw error;
    }
    console.error('Error analyzing recording:', error);
    throw new Error('Failed to analyze recording. Please try again.');
  }
}

export async function getRecordings(): Promise<Recording[]> {
  const response = await apiClient.get('/speech/recordings');
  if (!response.ok) {
    throw new Error(response.data?.error || 'Failed to fetch recordings');
  }
  return response.data as Recording[];
}

export async function getRecording(id: string): Promise<Recording> {
  const response = await apiClient.get(`/speech/recordings/${id}`);
  if (!response.ok) {
    throw new Error(response.data?.error || 'Failed to fetch recording');
  }
  return response.data as Recording;
}

export async function deleteRecording(id: string): Promise<void> {
  const response = await apiClient.delete(`/speech/recordings/${id}`);
  if (!response.ok) {
    throw new Error(response.data?.error || 'Failed to delete recording');
  }
}
