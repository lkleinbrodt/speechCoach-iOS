# Production Setup Guide

This guide covers the production deployment setup for both the frontend and backend of the Speech Coach AI application.

## Frontend Production Setup

### 1. Environment Configuration

Create a production environment file `.env.production`:

```env
EXPO_PUBLIC_API_URL=https://your-production-backend.com
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_key
```

### 2. EAS Build Configuration

Update `eas.json` for production builds:

```json
{
  "build": {
    "production": {
      "ios": {
        "resourceClass": "m-medium",
        "autoIncrement": true
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

### 3. Build and Submit

```bash
# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

## Backend Production Setup

### 1. Environment Variables

Set these environment variables in your production hosting platform:

```env
ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
JWT_SECRET_KEY=your-secure-jwt-secret
FLASK_SECRET_KEY=your-secure-flask-secret
```

### 2. Database Setup

```bash
# Run migrations
flask db upgrade

# Verify database connection
flask db current
```

### 3. Heroku Deployment

```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main

# Run migrations
heroku run flask db upgrade

# Check logs
heroku logs --tail
```

### 4. SSL and Domain Setup

- Configure custom domain in Heroku
- Set up SSL certificate (automatic with Heroku)
- Update DNS records

## Security Checklist

### Frontend

- [ ] Use production Stripe keys
- [ ] Enable App Transport Security (ATS)
- [ ] Configure code signing
- [ ] Enable app encryption

### Backend

- [ ] Use production database
- [ ] Enable HTTPS only
- [ ] Set secure headers
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable request logging
- [ ] Set up monitoring

## Monitoring and Logging

### 1. Application Monitoring

Set up monitoring for:

- API response times
- Error rates
- Database performance
- Payment processing

### 2. Log Management

Configure logging for:

- Authentication events
- Payment transactions
- API usage
- Error tracking

### 3. Health Checks

Implement health check endpoints:

- Database connectivity
- External API status
- Payment system status

## Performance Optimization

### 1. Database

- Set up connection pooling
- Configure read replicas if needed
- Optimize queries
- Set up database backups

### 2. API

- Enable response caching
- Implement rate limiting
- Optimize JSON responses
- Use CDN for static assets

### 3. Mobile App

- Optimize bundle size
- Implement lazy loading
- Use image optimization
- Configure caching strategies

## Backup and Recovery

### 1. Database Backups

```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 2. File Storage

- Configure S3 bucket for future audio storage
- Set up cross-region replication
- Implement lifecycle policies

### 3. Disaster Recovery

- Document recovery procedures
- Test backup restoration
- Set up monitoring alerts

## Compliance and Legal

### 1. Data Protection

- Implement data retention policies
- Set up data deletion procedures
- Configure privacy controls

### 2. Payment Compliance

- PCI DSS compliance for Stripe
- Secure payment processing
- Transaction logging

### 3. User Privacy

- GDPR compliance measures
- User data export functionality
- Privacy policy enforcement

## Testing Production

### 1. Pre-Launch Checklist

- [ ] Test all payment flows
- [ ] Verify Apple Sign In
- [ ] Test speech analysis
- [ ] Check error handling
- [ ] Verify legal documents
- [ ] Test on physical devices

### 2. Load Testing

- [ ] API endpoint performance
- [ ] Database query optimization
- [ ] Payment processing under load
- [ ] Concurrent user testing

### 3. Security Testing

- [ ] Penetration testing
- [ ] API security validation
- [ ] Payment security audit
- [ ] Data encryption verification

## Maintenance

### 1. Regular Updates

- Keep dependencies updated
- Monitor security advisories
- Update SSL certificates
- Review access logs

### 2. Performance Monitoring

- Monitor API response times
- Track database performance
- Watch payment success rates
- Monitor user engagement

### 3. Backup Verification

- Test backup restoration monthly
- Verify data integrity
- Check backup retention policies
- Document any issues

## Support and Documentation

### 1. User Support

- Set up support email system
- Create FAQ documentation
- Implement in-app help
- Monitor user feedback

### 2. Developer Documentation

- API documentation
- Deployment procedures
- Troubleshooting guides
- Change management process

### 3. Monitoring Alerts

- Set up error rate alerts
- Configure performance alerts
- Monitor payment failures
- Track user engagement metrics
