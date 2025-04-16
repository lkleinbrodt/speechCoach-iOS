# Speech Coach AI

Speech Coach AI is a mobile application designed to help users improve their public speaking and presentation skills through AI-powered feedback and analysis. The app provides real-time recording capabilities and detailed analysis of speech patterns, delivery, and content.

## Features

- **Speech Recording**: High-quality audio recording with a user-friendly interface
- **AI Analysis**: Real-time analysis of speech content, delivery, and patterns
- **Performance History**: Track your progress and review past recordings
- **Detailed Feedback**: Get comprehensive feedback on your presentations
- **Progress Tracking**: Monitor your improvement over time with detailed metrics
- **User-Friendly Interface**: Clean, modern UI with intuitive controls
- **Payment Integration**: Secure in-app purchases with Apple Pay support
- **Clarity Scoring**: Get detailed clarity scores and improvement suggestions
- **Content Structure Analysis**: Evaluation of speech organization and coherence
- **Tone Analysis**: Detailed analysis of speech tone and emotional delivery

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
- **Payment Processing**: Stripe integration with Apple Pay support
- **Authentication**: Secure user authentication with JWT tokens

### Key Dependencies

- `expo`: ~52.0.46
- `expo-av`: ~15.0.2
- `expo-router`: ~4.0.20
- `react-native`: ^0.76.9
- `openai`: ^4.28.0
- `@react-native-async-storage/async-storage`: 1.23.1
- `@stripe/stripe-react-native`: ^0.38.6
- `expo-apple-authentication`: ~7.1.3
- `expo-secure-store`: ~14.0.1
- `react-native-reanimated`: ~3.16.1
- `expo-constants`: ~17.0.8
- `expo-linking`: ^7.0.5

### Architecture

The app follows a tab-based navigation structure with the following main sections:

1. **Recording Screen (index.tsx)**

   - Main recording interface
   - Real-time audio capture
   - Integration with AI analysis
   - Balance checking for analysis costs

2. **History Screen (history.tsx)**

   - List of past recordings
   - Detailed view of previous analyses
   - Performance metrics
   - Pull-to-refresh functionality

3. **Progress Screen (progress.tsx)**

   - Performance tracking over time
   - Statistical analysis
   - Improvement metrics
   - Visual progress indicators

4. **Settings Screen (settings.tsx)**

   - App configuration
   - User preferences
   - Audio settings
   - Payment management

5. **Results Screen (results/[id].tsx)**
   - Detailed analysis view
   - Clarity scores
   - Content structure evaluation
   - Tone analysis
   - Improvement suggestions

### Data Flow

1. User records speech through the main interface
2. Audio is processed and sent to OpenAI API
3. Analysis results are stored locally
4. Historical data is used for progress tracking
5. UI updates reflect the latest analysis and statistics
6. Payment processing for analysis credits

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:

   ```
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   OPENAI_API_KEY=your_api_key
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Run on iOS simulator or device:
   ```bash
   npm run ios
   ```

## Environment Setup

Required environment variables:

- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for payments
- `OPENAI_API_KEY`: OpenAI API key for speech analysis

## Development Guidelines

- Follow the existing component structure
- Maintain consistent styling using the StyleSheet definitions
- Use the provided UI components for consistency
- Follow TypeScript typing conventions
- Test thoroughly on iOS platform
- Ensure proper error handling for payment processing
- Follow secure coding practices for handling sensitive data

## Build and Deployment

The app uses EAS (Expo Application Services) for building and deployment:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

## License

This project is proprietary and confidential. All rights reserved.
