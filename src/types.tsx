interface Recording {
  id: number;
  title: string;
  duration: number;
  created_at: string;
  analysis: Analysis;
}

interface Analysis {
  id: number;
  recording_id: number;
  transcript: string;
  clarity_score: number;
  pace_score: number;
  filler_word_count: number;
  tone_analysis: ToneAnalysis;
  content_structure: ContentStructure;
  feedback: string;
  created_at: string;
}

interface ToneAnalysis {
  confidence: number;
  enthusiasm: number;
  professionalism: number;
}

interface ContentStructure {
  keyPoints: string[];
  organization: number;
  coherence: number;
}

export type { Recording, Analysis, ToneAnalysis, ContentStructure };
