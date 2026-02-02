import { NextRequest, NextResponse } from 'next/server';
import { getInstanceStatus } from '@/lib/aws';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get('instanceId') || process.env.EC2_INSTANCE_ID;

  if (!instanceId) {
    return NextResponse.json(
      { error: 'Instance ID is required' },
      { status: 400 }
    );
  }

  try {
    const status = await getInstanceStatus(instanceId);
    
    if (!status) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to get instance status:', error);
    return NextResponse.json(
      { error: 'Failed to get instance status' },
      { status: 500 }
    );
  }
}