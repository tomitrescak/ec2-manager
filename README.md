# EC2 Instance Monitor

A Next.js application for monitoring and controlling AWS EC2 instances with password protection.

## Features

- **Real-time monitoring** of EC2 instance status
- **Start/Stop controls** with password protection
- **Auto-refresh** every 30 seconds
- **Dark mode support**
- **Responsive design** with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- pnpm package manager
- AWS account with EC2 access
- AWS credentials (Access Key and Secret Key)

## Installation

1. **Clone and navigate to the project directory:**
   ```bash
   git clone <repository-url>
   cd ec2monitor
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   
   Copy the `.env.local` file and update with your values:
   ```bash
   cp .env.local .env.local.example
   ```

   Edit `.env.local` with your actual values:
   ```env
   # AWS Configuration
   AMAZON_ACCESS_KEY_ID=your_actual_access_key
   AMAZON_SECRET_ACCESS_KEY=your_actual_secret_key
   AMAZON_REGION=us-east-1

   # EC2 Instance Configuration
   EC2_INSTANCE_ID=i-1234567890abcdef0

   # Application Password
   ADMIN_PASSWORD=your_secure_password

   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## AWS Setup

### Required AWS Permissions

Your AWS user/role needs the following IAM permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:StartInstances",
                "ec2:StopInstances"
            ],
            "Resource": "*"
        }
    ]
}
```

### Getting AWS Credentials

1. **Create an IAM user:**
   - Go to AWS IAM Console
   - Create a new user with programmatic access
   - Attach the above policy
   - Save the Access Key ID and Secret Access Key

2. **Find your EC2 Instance ID:**
   - Go to AWS EC2 Console
   - Find your instance in the instances list
   - Copy the Instance ID (starts with `i-`)

## Development

Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **View Instance Status**: The dashboard automatically displays your EC2 instance information
2. **Start Instance**: Enter your admin password and click "Start"
3. **Stop Instance**: Enter your admin password and click "Stop"
4. **Refresh**: Click "Refresh Status" or wait for auto-refresh (every 30 seconds)

## Security Notes

- **Never commit** your `.env.local` file with real credentials
- Use **strong passwords** for the `ADMIN_PASSWORD`
- Consider using **IAM roles** instead of access keys in production
- Implement **additional security layers** for production use

## Production Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:
- `AMAZON_ACCESS_KEY_ID`
- `AMAZON_SECRET_ACCESS_KEY`
- `AMAZON_REGION`
- `EC2_INSTANCE_ID`
- `ADMIN_PASSWORD`

### Recommended Security Enhancements

For production deployments, consider:
- Using AWS IAM roles instead of access keys
- Implementing proper authentication (Auth0, NextAuth.js)
- Adding rate limiting
- Using HTTPS
- Adding audit logging

## API Endpoints

- `GET /api/ec2/status` - Get instance status
- `POST /api/ec2/start` - Start instance (requires password)
- `POST /api/ec2/stop` - Stop instance (requires password)

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **AWS SDK v3** - AWS integration
- **pnpm** - Package management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
