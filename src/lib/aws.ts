import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } from '@aws-sdk/client-ec2';

const client = new EC2Client({
  region: process.env.AMAZON_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY || '',
  },
});

export interface InstanceStatus {
  instanceId: string;
  state: string;
  publicIp?: string;
  privateIp?: string;
  instanceType?: string;
  launchTime?: Date;
}

export async function getInstanceStatus(instanceId: string): Promise<InstanceStatus | null> {
  try {
    const command = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    });

    const response = await client.send(command);
    const reservation = response.Reservations?.[0];
    const instance = reservation?.Instances?.[0];

    if (!instance) {
      return null;
    }

    return {
      instanceId: instance.InstanceId || '',
      state: instance.State?.Name || 'unknown',
      publicIp: instance.PublicIpAddress,
      privateIp: instance.PrivateIpAddress,
      instanceType: instance.InstanceType,
      launchTime: instance.LaunchTime,
    };
  } catch (error) {
    console.error('Error getting instance status:', error);
    throw error;
  }
}

export async function startInstance(instanceId: string): Promise<boolean> {
  try {
    const command = new StartInstancesCommand({
      InstanceIds: [instanceId],
    });

    await client.send(command);
    return true;
  } catch (error) {
    console.error('Error starting instance:', error);
    throw error;
  }
}

export async function stopInstance(instanceId: string): Promise<boolean> {
  try {
    const command = new StopInstancesCommand({
      InstanceIds: [instanceId],
    });

    await client.send(command);
    return true;
  } catch (error) {
    console.error('Error stopping instance:', error);
    throw error;
  }
}