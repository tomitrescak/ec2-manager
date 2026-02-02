import type { NextConfig } from "next";

const requiredEnvVars = [
  'AMAZON_ACCESS_KEY_ID',
  'AMAZON_SECRET_ACCESS_KEY', 
  'AMAZON_REGION',
  'EC2_INSTANCE_ID',
  'ADMIN_PASSWORD'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required environment variable: ${envVar}`);
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
