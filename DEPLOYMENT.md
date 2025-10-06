# Deployment Guide

This guide covers deploying the Image Uploader app using Docker and Digital Ocean.

## Prerequisites

1. **Digital Ocean Account** with access to:
   - Container Registry
   - App Platform
   - Access Token

2. **GitHub Repository** with the following secrets configured:
   - `DIGITALOCEAN_ACCESS_TOKEN`
   - `DO_REGISTRY_NAME`
   - `DO_APP_ID` (after creating the app)
   - `SESSION_SECRET`

## Local Development with Docker

### Build and run with Docker:
```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

### Using Docker Compose:
```bash
# Start services
npm run docker:compose:up

# View logs
npm run docker:compose:logs

# Stop services
npm run docker:compose:down
```

## Digital Ocean Setup

### 1. Create Container Registry

1. Go to Digital Ocean Control Panel
2. Navigate to Container Registry
3. Create a new registry (note the name for GitHub secrets)

### 2. Create App Platform App

#### Option A: Using Source Code (Recommended for development)
```bash
# Install doctl CLI
# Create app from source
doctl apps create --spec .do/app.yaml
```

#### Option B: Using Docker Image (Recommended for production)
```bash
# Create app from Docker image
doctl apps create --spec .do/app-docker.yaml
```

### 3. Configure GitHub Secrets

In your GitHub repository, add these secrets:

- `DIGITALOCEAN_ACCESS_TOKEN`: Your DO API token
- `DO_REGISTRY_NAME`: Your container registry name
- `DO_APP_ID`: App ID from step 2 (get with `doctl apps list`)
- `SESSION_SECRET`: Strong random string for session encryption

### 4. Environment Variables

Set these in Digital Ocean App Platform:

- `NODE_ENV=production`
- `PORT=3000` (or 8080 for source deployment)
- `SESSION_SECRET` (use the secret from GitHub)

## Deployment Process

### Automatic Deployment

1. Push to `main` branch
2. GitHub Actions will:
   - Run tests
   - Build Docker image
   - Push to DO Container Registry
   - Deploy to App Platform

### Manual Deployment

```bash
# Build and tag image
docker build -t registry.digitalocean.com/YOUR_REGISTRY/image-uploader:latest .

# Login to registry
doctl registry login

# Push image
docker push registry.digitalocean.com/YOUR_REGISTRY/image-uploader:latest

# Create deployment
doctl apps create-deployment YOUR_APP_ID
```

## Production Configuration

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-super-secret-key
DATABASE_PATH=/app/database/app.db
UPLOAD_PATH=/app/uploads
```

### Volume Mounts (for Docker)
- Database: `/app/database`
- Uploads: `/app/uploads`

## Health Checks

The app includes health check endpoints:
- Health check URL: `/api/user`
- Expected response: JSON with user status

## Scaling

### App Platform Scaling
- Instance count: Configurable in `.do/app.yaml`
- Instance size: `basic-xxs` to `professional-xl`

### Database Considerations
- Current setup uses SQLite (single instance)
- For scaling, consider PostgreSQL with DO Managed Database

## Monitoring

### App Platform provides:
- Application logs
- Metrics and alerts
- Runtime insights

### Access logs:
```bash
# View app logs
doctl apps logs YOUR_APP_ID --type run

# Follow logs
doctl apps logs YOUR_APP_ID --type run --follow
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies are listed
   - Check file permissions

2. **Deployment Failures**
   - Verify environment variables
   - Check health check endpoint
   - Review application logs

3. **Runtime Issues**
   - Check file system permissions
   - Verify database connectivity
   - Monitor resource usage

### Debug Commands

```bash
# Check app status
doctl apps get YOUR_APP_ID

# View recent deployments
doctl apps list-deployments YOUR_APP_ID

# Get app info
doctl apps get YOUR_APP_ID --format yaml
```

## Security Considerations

1. **Environment Variables**: Use DO App Platform secrets for sensitive data
2. **File Uploads**: Validate file types and sizes
3. **Session Security**: Use strong session secrets
4. **Network**: Enable HTTPS (automatic with App Platform)
5. **Container Security**: Regular image updates

## Cost Optimization

1. **Right-sizing**: Start with `basic-xxs` and scale as needed
2. **Registry**: Clean up old images regularly
3. **Monitoring**: Set up alerts for resource usage

## Backup Strategy

1. **Database**: Regular exports (consider DO Spaces for storage)
2. **Uploads**: Sync to DO Spaces or S3-compatible storage
3. **Configuration**: Version control all configs