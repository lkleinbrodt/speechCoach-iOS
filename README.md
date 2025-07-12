# Speech Coach AI

A React Native/Expo iOS application that provides AI-powered speech analysis and feedback. Users can record their speech, receive detailed analysis including clarity scores, tone analysis, and improvement suggestions.

## Features

- **AI-Powered Speech Analysis**: Get detailed feedback on clarity, pace, tone, and content structure
- **Secure Authentication**: Sign in with Apple for seamless user experience
- **Credit-Based System**: Pay only for what you use with transparent pricing
- **Recording History**: Track your progress over time with detailed history
- **Real-time Feedback**: Instant analysis with comprehensive suggestions for improvement

## Tech Stack

### Frontend

- **React Native/Expo**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **Expo Router**: File-based navigation
- **Context API**: State management
- **Stripe**: Payment processing
- **Apple Sign In**: Authentication

### Backend

- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **PostgreSQL**: Database
- **OpenAI API**: Speech transcription and analysis
- **JWT**: Authentication tokens

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Python 3.8+
- PostgreSQL
- Apple Developer Account (for iOS deployment)

### Frontend Setup

1. **Install dependencies**:

   ```bash
   cd speech_ios
   npm install
   ```

2. **Environment variables**:
   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_API_URL=your_backend_url
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

### Backend Setup

1. **Install dependencies**:

   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

2. **Environment variables**:
   Create a `.env` file:

   ```env
   DATABASE_URL=postgresql://user:password@localhost/speech_coach
   OPENAI_API_KEY=your_openai_key
   STRIPE_SECRET_KEY=your_stripe_secret
   JWT_SECRET_KEY=your_jwt_secret
   ENV=development
   ```

3. **Database setup**:

   ```bash
   flask db upgrade
   ```

4. **Start server**:
   ```bash
   python app.py
   ```

## Project Structure

```
speech_ios/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (protected)/       # Protected app screens
│   └── components/        # Shared components
├── src/
│   ├── api/              # API client functions
│   ├── auth/             # Authentication context
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── docs/                 # Legal documents
└── assets/              # Images and static files
```

## Key Features Implementation

### 1. Database Transaction Integrity

The backend uses nested transactions to ensure all operations (transcription, moderation, analysis, billing) succeed or fail together, preventing users from being charged for incomplete analyses.

### 2. Robust JSON Parsing

OpenAI API responses use `response_format={"type": "json_object"}` to ensure reliable JSON parsing and eliminate brittle string manipulation.

### 3. Error Handling

Comprehensive error handling throughout the app with user-friendly error messages and retry functionality.

### 4. Legal Compliance

Complete Terms of Service and Privacy Policy documents linked from the welcome screen, required for App Store approval.

## API Endpoints

### Authentication

- `POST /speech/auth/apple/signin` - Apple Sign In
- `GET /speech/me` - Get current user profile
- `POST /speech/signout` - Sign out

### Recordings

- `POST /speech/analyze` - Analyze speech recording
- `GET /speech/recordings` - Get user recordings
- `GET /speech/recordings/<id>` - Get specific recording
- `DELETE /speech/recordings/<id>` - Delete recording

### Billing

- `GET /balance` - Get user balance
- `POST /balance/add-funds` - Add funds to account

## Deployment

### Frontend (iOS)

1. **EAS Build**:

   ```bash
   eas build --platform ios
   ```

2. **App Store Submission**:
   ```bash
   eas submit --platform ios
   ```

### Backend

1. **Heroku Deployment**:

   ```bash
   git push heroku main
   ```

2. **Environment Variables**: Set all required environment variables in your hosting platform.

## Testing

### Frontend Tests

```bash
npm test
```

### Backend Tests

```bash
python -m pytest tests/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@speechcoach.ai

## Roadmap

- [ ] Audio playback functionality
- [ ] Advanced analytics dashboard
- [ ] Speech coaching exercises
- [ ] Multi-language support
- [ ] Android version
- [ ] Web dashboard
