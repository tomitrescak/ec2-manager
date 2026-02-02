import { NextRequest, NextResponse } from 'next/server';
import { stopInstance } from '@/lib/aws';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instanceId, password } = body;

    // Verify password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const targetInstanceId = instanceId || process.env.EC2_INSTANCE_ID;

    if (!targetInstanceId) {
      return NextResponse.json(
        { error: 'Instance ID is required' },
        { status: 400 }
      );
    }

    await stopInstance(targetInstanceId);

    return NextResponse.json({ 
      success: true, 
      message: 'Instance stop command sent successfully' 
    });
  } catch (error) {
    console.error('Failed to stop instance:', error);
    return NextResponse.json(
      { error: 'Failed to stop instance' },
      { status: 500 }
    );
  }
}