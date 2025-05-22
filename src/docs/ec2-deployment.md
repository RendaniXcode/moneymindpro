
# AWS AppSync Integration Deployment Guide for EC2

## Environment Variable Setup

To deploy this application on EC2, you'll need to properly configure environment variables for the AppSync GraphQL API integration. Follow these steps:

### 1. Create Environment Variables File

Create a `.env.production` file in the root directory of your project with the following variables:

```env
VITE_APPSYNC_API_KEY=your-appsync-api-key
VITE_APPSYNC_ENDPOINT=https://your-appsync-endpoint.amazonaws.com/graphql
VITE_APPSYNC_REALTIME_ENDPOINT=wss://your-appsync-realtime-endpoint.amazonaws.com/graphql
```

### 2. Setup on EC2

When deploying to EC2, you have several options for setting environment variables:

#### Option A: Using System Environment Variables

In your EC2 instance, add these environment variables to your system:

```bash
# Add to ~/.bashrc or appropriate shell config
export VITE_APPSYNC_API_KEY=your-appsync-api-key
export VITE_APPSYNC_ENDPOINT=https://your-appsync-endpoint.amazonaws.com/graphql
export VITE_APPSYNC_REALTIME_ENDPOINT=wss://your-appsync-realtime-endpoint.amazonaws.com/graphql
```

#### Option B: Using a Process Manager (PM2)

If using PM2 to run your Node.js application, create an ecosystem.config.js file:

```javascript
module.exports = {
  apps: [{
    name: "financial-reports-app",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production",
      VITE_APPSYNC_API_KEY: "your-appsync-api-key",
      VITE_APPSYNC_ENDPOINT: "https://your-appsync-endpoint.amazonaws.com/graphql",
      VITE_APPSYNC_REALTIME_ENDPOINT: "wss://your-appsync-realtime-endpoint.amazonaws.com/graphql"
    }
  }]
}
```

Start your application with:
```bash
pm2 start ecosystem.config.js
```

#### Option C: Using Docker

If deploying with Docker, pass environment variables in your docker-compose.yml:

```yaml
version: '3'
services:
  app:
    build: .
    environment:
      - VITE_APPSYNC_API_KEY=your-appsync-api-key
      - VITE_APPSYNC_ENDPOINT=https://your-appsync-endpoint.amazonaws.com/graphql
      - VITE_APPSYNC_REALTIME_ENDPOINT=wss://your-appsync-realtime-endpoint.amazonaws.com/graphql
    ports:
      - "3000:3000"
```

Or use a .env file with docker-compose:

```yaml
version: '3'
services:
  app:
    build: .
    env_file:
      - .env.production
    ports:
      - "3000:3000"
```

### 3. Build Process

When building your application for production:

```bash
npm run build
```

Vite will replace the environment variables in your code during the build process.

### 4. Security Best Practices

1. **Use AWS Secrets Manager**: For enhanced security, retrieve the API key from AWS Secrets Manager at runtime.

2. **IAM Roles**: Configure EC2 IAM roles to access AppSync rather than using API keys.

3. **Rotate Keys**: Regularly rotate your API keys and update your environment variables.

4. **Access Restrictions**: Restrict API key access by IP in the AppSync console.

5. **Encrypt Environment Variables**: Consider encrypting sensitive environment variables and decrypting them at runtime.

### 5. Validation

After deployment, validate your AppSync connection by visiting the application and checking the console logs for successful connection messages. You can also use the built-in validation utility:

```javascript
import { validateAppSyncConnection } from '@/utils/validateAppSyncConnection';

// Use in your component or startup script
validateAppSyncConnection()
  .then(result => {
    if (result.success) {
      console.log('Connection validated:', result.message);
    } else {
      console.error('Connection failed:', result.message);
    }
  });
```

## Troubleshooting

If you encounter connection issues:

1. Check EC2 security groups to ensure outbound access to AppSync endpoints
2. Verify environment variables are correctly set
3. Test the API key manually using a tool like Postman
4. Check VPC settings if your EC2 instance is in a private subnet
5. Review CloudWatch logs for any AppSync API errors
