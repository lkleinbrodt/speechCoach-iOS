# Speech Coach AI

Speech Coach AI is a mobile application designed to help users improve their public speaking and presentation skills through AI-powered feedback and analysis. The app provides real-time recording capabilities and detailed analysis of speech patterns, delivery, and content.

## Features

- **Speech Recording**: High-quality audio recording with a user-friendly interface
- **AI Analysis**: Real-time analysis of speech content, delivery, and patterns
- **Performance History**: Track your progress and review past recordings
- **Detailed Feedback**: Get comprehensive feedback on your presentations
- **Progress Tracking**: Monitor your improvement over time
- **User-Friendly Interface**: Clean, modern UI with intuitive controls

## Technical Overview

### Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Components**: Custom components with React Native core components
- **Styling**: React Native StyleSheet with custom theming
- **Audio Processing**: Expo AV for recording and playback
- **AI Integration**: OpenAI API for speech analysis
- **Storage**: AsyncStorage for local data persistence
- **State Management**: React hooks for local state management

### Key Dependencies

- `expo`: ^52.0.33
- `expo-av`: ^13.10.5
- `expo-router`: 4.0.17
- `react-native`: 0.76.6
- `openai`: ^4.28.0
- `@react-native-async-storage/async-storage`: 1.21.0

### Architecture

The app follows a tab-based navigation structure with the following main sections:

1. **Recording Screen (index.tsx)**

   - Main recording interface
   - Real-time audio capture
   - Integration with AI analysis

2. **History Screen (history.tsx)**

   - List of past recordings
   - Detailed view of previous analyses
   - Performance metrics

3. **Progress Screen (progress.tsx)**

   - Performance tracking over time
   - Statistical analysis
   - Improvement metrics

4. **Settings Screen (settings.tsx)**
   - App configuration
   - User preferences
   - Audio settings

### Data Flow

1. User records speech through the main interface
2. Audio is processed and sent to OpenAI API
3. Analysis results are stored locally
4. Historical data is used for progress tracking
5. UI updates reflect the latest analysis and statistics

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Run on iOS simulator or device:
   ```bash
   npm run ios
   ```

## Environment Setup

Create a `.env` file with the following variables:

```
OPENAI_API_KEY=your_api_key_here
```

## Development Guidelines

- Follow the existing component structure
- Maintain consistent styling using the StyleSheet definitions
- Use the provided UI components for consistency
- Follow TypeScript typing conventions
- Test thoroughly on both iOS and Android platforms

## License

This project is proprietary and confidential. All rights reserved.
