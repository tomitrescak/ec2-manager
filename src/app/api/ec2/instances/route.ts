import { NextResponse } from 'next/server';
import { parseInstances } from '@/lib/aws';

export async function GET() {
  try {
    const instances = parseInstances();
    
    if (instances.length === 0) {
      return NextResponse.json(
        { error: 'No instances configured. Please set EC2_INSTANCES environment variable.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ instances });
  } catch (error) {
    console.error('Error fetching instances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instances' },
      { status: 500 }
    );
  }
}