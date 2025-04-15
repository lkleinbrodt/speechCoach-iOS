# Speech Coach AI - Project Plan

## Overview

Speech Coach AI is a mobile application designed to help users improve their public speaking and presentation skills through AI-powered feedback and analysis. The app provides real-time recording capabilities and detailed analysis of speech patterns, delivery, and content.

## Tech Stack

### Frontend (iOS)

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Components**: Custom components with React Native core components
- **Styling**: React Native StyleSheet with custom theming
- **Audio Processing**: Expo AV for recording and playback
- **Storage**: AsyncStorage for local data persistence
- **State Management**: React hooks for local state management

### Backend (flask)

- **Framework**: Flask
- **Database**: postgres
- **API**: RESTful API
- **Authentication**: JWT tokens
- **Audio Processing**: OpenAI Whisper and GPT-4

## Project Structure

frontend code is in ~/Projects/speech_ios/
backend code is in ~/Projects/coyote-ai/backend (specifically the speech directory)

# Speech App Payment System Implementation Plan

## Overview

Implement a dollar-based system where users need sufficient balance to perform OpenAI-dependent actions. Each AI operation will deduct from their balance based on OpenAI's actual costs.

## Database Changes Needed

### 1. User Balance Table

- Add `user_balance` table to track dollar balances
  - User ID (foreign key)
  - Current balance (decimal)
  - Created at
  - Updated at

### 2. Transaction History

- Add `transactions` table to log all balance changes
  - Transaction ID
  - User ID (foreign key)
  - Amount (decimal, positive for additions, negative for debits)
  - Transaction type (purchase, usage, refund)
  - Operation type (transcription, analysis, etc.)
  - Created at
  - Status (completed, failed, pending)
  - Reference ID (e.g., recording ID for usage transactions)

## Operation Costs

Define costs in a configuration dictionary based on OpenAI's pricing:

```python
OPERATION_COSTS = {
    'transcription': 0.006,  # $0.006 per second of audio (Whisper API)
    'analysis': 0.03,        # $0.03 per request (GPT-4)
    'title': 0.01,          # $0.01 per request (GPT-4, shorter prompt)
    'moderation': 0.01,     # $0.01 per request (Moderation API)
}
```

## API Endpoints Needed

### Balance Management

1. GET `/balance` - Get current balance
2. GET `/transactions` - Get transaction history
3. POST `/balance/add` - Add funds (placeholder for now)

### Integration Points

- Modify `/speech/analyze` endpoint to:
  1. Calculate estimated cost based on audio duration
  2. Check balance before processing
  3. Create pending transaction
  4. Process request only if sufficient balance
  5. Update transaction with actual cost on completion

## Implementation Phases

### Phase 1: Core Balance System

- [ ] Create database tables
- [ ] Implement balance tracking
- [ ] Add balance check middleware
- [ ] Add configuration for operation costs
- [ ] Modify analysis endpoint to handle costs

### Phase 2: Transaction History

- [ ] Implement transaction logging
- [ ] Add transaction history endpoint
- [ ] Add admin monitoring tools

### Phase 3: Payment System (Future)

- [ ] Integrate payment processing
- [ ] Add funds addition workflow
- [ ] Implement receipt generation

## Notes

- Costs are based on actual OpenAI API pricing
- Audio transcription cost varies by duration
- Analysis costs are fixed per request
- All costs should be monitored and adjusted based on actual OpenAI usage

# Speech Coach AI - Implementation Plan

## ✅ Cost Calculation System

- Implemented precise cost calculations based on OpenAI API usage
- Added model-specific costs for Whisper, GPT-4, and moderation
- Created token estimation and cost breakdown methods

## ✅ Balance Management System

- Implemented balance tracking and transaction history
- Added endpoints for balance management:
  - GET /speech/balance - View current balance
  - GET /speech/transactions - View transaction history
  - POST /speech/balance/add - Add funds (placeholder)
- Integrated balance checks and updates into analysis workflow
- Implemented transaction lifecycle:
  1. Cost estimation
  2. Balance verification
  3. Fund reservation
  4. Cost calculation
  5. Balance adjustment
  6. Transaction completion

## Next Steps

- [ ] Implement actual payment processing for adding funds
- [ ] Add balance notifications when funds are low
- [ ] Consider implementing automatic top-up options
- [ ] Add usage analytics and cost breakdown views
