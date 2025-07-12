# S3 Audio Storage Implementation TODO

## Overview

This document outlines the implementation plan for storing audio files in Amazon S3 for the Speech Coach AI application. Currently, audio files are processed for analysis but not stored, which limits future features like audio playback.

## Current State

- Audio files are uploaded to the backend for processing
- Only transcripts and analysis results are stored in the database
- The `file_path` field in the `Recording` model is currently empty
- Audio files are discarded after processing

## Implementation Plan

### Phase 1: Backend S3 Integration

#### 1.1 S3 Configuration

- [ ] Set up S3 bucket with appropriate permissions
- [ ] Configure CORS for the S3 bucket
- [ ] Create IAM user with minimal required permissions
- [ ] Add S3 credentials to environment variables

#### 1.2 S3 Helper Class

```python
# backend/src/s3.py
class S3Client:
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.s3_client = boto3.client('s3')

    def upload_audio_file(self, audio_data: bytes, user_id: int, recording_id: int) -> str:
        """Upload audio file to S3 and return the file key"""
        file_key = f"users/{user_id}/recordings/{recording_id}/audio.m4a"
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=file_key,
            Body=audio_data,
            ContentType='audio/m4a'
        )
        return file_key

    def delete_audio_file(self, file_key: str) -> bool:
        """Delete audio file from S3"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_key)
            return True
        except Exception as e:
            logger.error(f"Failed to delete S3 file {file_key}: {e}")
            return False

    def get_presigned_url(self, file_key: str, expiration: int = 3600) -> str:
        """Generate presigned URL for secure file access"""
        return self.s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': file_key},
            ExpiresIn=expiration
        )
```

#### 1.3 Update Analysis Endpoint

- [ ] Modify `/speech/analyze` endpoint to store audio files
- [ ] Update the transaction to include S3 upload
- [ ] Handle S3 upload failures gracefully
- [ ] Update the `Recording` model to store the S3 file key

#### 1.4 Update Delete Endpoint

- [ ] Modify `/speech/recordings/<id>/delete` to remove S3 files
- [ ] Handle S3 deletion failures
- [ ] Ensure cleanup happens even if S3 deletion fails

### Phase 2: Frontend Audio Playback

#### 2.1 Audio Player Component

```typescript
// src/components/AudioPlayer.tsx
interface AudioPlayerProps {
  audioUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onPlay,
  onPause,
  onEnd,
}) => {
  // Implementation using expo-av
};
```

#### 2.2 Update Results Screen

- [ ] Add audio playback functionality to results screen
- [ ] Show audio player when audio is available
- [ ] Handle cases where audio is not available
- [ ] Add loading states for audio playback

#### 2.3 Update History Screen

- [ ] Add play button to recording cards
- [ ] Implement quick audio preview
- [ ] Handle audio loading states

### Phase 3: Security and Performance

#### 3.1 Security Measures

- [ ] Implement presigned URLs for secure access
- [ ] Set up bucket policies to prevent direct access
- [ ] Configure proper CORS headers
- [ ] Implement file size limits

#### 3.2 Performance Optimization

- [ ] Implement audio file compression
- [ ] Add CDN for faster audio delivery
- [ ] Implement audio caching strategies
- [ ] Add progress indicators for uploads

#### 3.3 Error Handling

- [ ] Handle S3 upload failures
- [ ] Implement retry logic for failed uploads
- [ ] Graceful degradation when audio is unavailable
- [ ] User-friendly error messages

### Phase 4: Data Management

#### 4.1 Storage Optimization

- [ ] Implement audio file lifecycle policies
- [ ] Set up automatic cleanup of old files
- [ ] Monitor storage costs
- [ ] Implement file compression

#### 4.2 Backup and Recovery

- [ ] Set up S3 bucket versioning
- [ ] Implement cross-region replication
- [ ] Create backup procedures
- [ ] Test recovery processes

## Implementation Steps

### Step 1: Backend Setup

1. Create S3 bucket and configure permissions
2. Implement S3 helper class
3. Update analysis endpoint to store audio files
4. Update delete endpoint to clean up S3 files
5. Add environment variables for S3 configuration

### Step 2: Frontend Integration

1. Create audio player component
2. Update results screen to include audio playback
3. Update history screen with play functionality
4. Add loading states and error handling

### Step 3: Testing and Validation

1. Test audio upload and storage
2. Test audio playback functionality
3. Test error scenarios
4. Performance testing with various file sizes

### Step 4: Production Deployment

1. Configure production S3 bucket
2. Update environment variables
3. Deploy backend changes
4. Deploy frontend changes
5. Monitor for issues

## Environment Variables

### Backend

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=speech-coach-audio
S3_BUCKET_REGION=us-east-1
```

### Frontend

```env
EXPO_PUBLIC_S3_BUCKET_NAME=speech-coach-audio
EXPO_PUBLIC_S3_REGION=us-east-1
```

## Cost Considerations

### S3 Storage Costs

- Standard storage: $0.023 per GB per month
- Estimated cost per recording: ~$0.001 (assuming 1MB per recording)
- Monthly cost for 1000 recordings: ~$1

### Data Transfer Costs

- GET requests: $0.0004 per 1000 requests
- PUT requests: $0.0005 per 1000 requests
- Data transfer out: $0.09 per GB

### Estimated Monthly Costs

- 1000 recordings: ~$5-10/month
- 10000 recordings: ~$50-100/month

## Security Considerations

### Access Control

- Use IAM roles with minimal permissions
- Implement presigned URLs for secure access
- Set up bucket policies to prevent direct access
- Configure proper CORS headers

### Data Protection

- Enable server-side encryption
- Implement client-side encryption for sensitive data
- Set up audit logging
- Regular security reviews

## Monitoring and Alerting

### Key Metrics

- S3 upload success rate
- Audio playback success rate
- Storage usage and costs
- Error rates and types

### Alerts

- S3 upload failures
- High error rates
- Storage cost thresholds
- Performance degradation

## Rollback Plan

### If Issues Arise

1. Disable S3 uploads in backend
2. Revert to current behavior (no audio storage)
3. Clean up any partially uploaded files
4. Update frontend to handle missing audio gracefully

### Data Migration

- Keep existing recordings without audio
- New recordings will have audio when feature is enabled
- Provide migration path for existing users

## Future Enhancements

### Audio Features

- Audio editing capabilities
- Multiple audio formats support
- Audio quality settings
- Background audio processing

### Analytics

- Audio playback analytics
- User engagement metrics
- Storage usage patterns
- Performance optimization insights

## Dependencies

### Backend

- boto3 (already in requirements.txt)
- s3fs (already in requirements.txt)

### Frontend

- expo-av (already installed)
- No additional dependencies required

## Timeline Estimate

- Phase 1 (Backend): 2-3 days
- Phase 2 (Frontend): 2-3 days
- Phase 3 (Security/Performance): 1-2 days
- Phase 4 (Data Management): 1 day
- Testing and Validation: 2-3 days

**Total: 8-12 days**

## Success Criteria

- [ ] Audio files are successfully uploaded to S3
- [ ] Audio playback works reliably in the app
- [ ] Security measures are properly implemented
- [ ] Performance is acceptable for users
- [ ] Error handling is robust
- [ ] Costs are within acceptable limits
- [ ] Monitoring and alerting are in place
