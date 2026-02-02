<!-- EC2 Monitor Application Instructions -->

This is a Next.js application for monitoring and controlling AWS EC2 instances.

## Project Structure
- Frontend: Next.js with TypeScript and Tailwind CSS
- Backend: Next.js API routes with AWS SDK v3
- Authentication: Password-based protection via environment variables

## Key Features
- Real-time EC2 instance status monitoring
- Start/stop instance controls with password protection
- Auto-refresh every 30 seconds
- Responsive design with dark mode support

## Important Files
- `.env.local` - Environment configuration (AWS credentials, instance ID, password)
- `src/lib/aws.ts` - AWS EC2 service utilities
- `src/app/api/ec2/` - API routes for EC2 operations
- `src/app/page.tsx` - Main dashboard component

## Setup Requirements
1. Configure `.env.local` with actual AWS credentials and instance ID
2. Ensure AWS IAM user has EC2 permissions (DescribeInstances, StartInstances, StopInstances)
3. Set a secure admin password

## Development
- Use `pnpm dev` to start development server
- Application runs on http://localhost:3001 (port 3000 was in use)