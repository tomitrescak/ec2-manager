import { NextRequest, NextResponse } from 'next/server';
import { startInstance } from '@/lib/aws';

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

    const targetInstanceId = instanceId;

    if (!targetInstanceId) {
      return NextResponse.json(
        { error: 'Instance ID is required' },
        { status: 400 }
      );
    }

    await startInstance(targetInstanceId);

    return NextResponse.json({ 
      success: true, 
      message: 'Instance start command sent successfully' 
    });
  } catch (error) {
    console.error('Failed to start instance:', error);
    return NextResponse.json(
      { error: 'Failed to start instance' },
      { status: 500 }
    );
  }
}