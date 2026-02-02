import { NextRequest, NextResponse } from 'next/server';
import { getInstanceStatus } from '@/lib/aws';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get('instanceId') || process.env.EC2_INSTANCE_ID;

  if (!instanceId) {
    const envDebugHtml = `
      <div style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 5px;">
        <h3>Environment Variables Debug</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr style="background: #e0e0e0;">
            <th style="padding: 8px; text-align: left;">Variable</th>
            <th style="padding: 8px; text-align: left;">Status</th>
            <th style="padding: 8px; text-align: left;">Value Preview</th>
          </tr>
          <tr>
            <td style="padding: 8px;">EC2_INSTANCE_ID</td>
            <td style="padding: 8px;">${process.env.EC2_INSTANCE_ID ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.EC2_INSTANCE_ID ? `${process.env.EC2_INSTANCE_ID.substring(0, 8)}...` : 'Not set'}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">AMAZON_ACCESS_KEY_ID</td>
            <td style="padding: 8px;">${process.env.AMAZON_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.AMAZON_ACCESS_KEY_ID ? `${process.env.AMAZON_ACCESS_KEY_ID.substring(0, 8)}...` : 'Not set'}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">AMAZON_SECRET_ACCESS_KEY</td>
            <td style="padding: 8px;">${process.env.AMAZON_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.AMAZON_SECRET_ACCESS_KEY ? '***hidden***' : 'Not set'}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">AMAZON_REGION</td>
            <td style="padding: 8px;">${process.env.AMAZON_REGION ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.AMAZON_REGION || 'Not set'}</td>
          </tr>
        </table>
      </div>
    `;
    
    return NextResponse.json(
      { 
        error: 'Instance ID is required',
        debug: envDebugHtml
      },
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
    
    const envDebugHtml = `
      <div style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 5px;">
        <h3>Environment Variables Debug</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr style="background: #e0e0e0;">
            <th style="padding: 8px; text-align: left;">Variable</th>
            <th style="padding: 8px; text-align: left;">Status</th>
            <th style="padding: 8px; text-align: left;">Value Preview</th>
          </tr>
          <tr>
            <td style="padding: 8px;">EC2_INSTANCE_ID</td>
            <td style="padding: 8px;">${process.env.EC2_INSTANCE_ID ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.EC2_INSTANCE_ID ? `${process.env.EC2_INSTANCE_ID.substring(0, 8)}...` : 'Not set'}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">AMAZON_ACCESS_KEY_ID</td>
            <td style="padding: 8px;">${process.env.AMAZON_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.AMAZON_ACCESS_KEY_ID ? `${process.env.AMAZON_ACCESS_KEY_ID.substring(0, 8)}...` : 'Not set'}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">AMAZON_SECRET_ACCESS_KEY</td>
            <td style="padding: 8px;">${process.env.AMAZON_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.AMAZON_SECRET_ACCESS_KEY ? '***hidden***' : 'Not set'}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">AMAZON_REGION</td>
            <td style="padding: 8px;">${process.env.AMAZON_REGION ? '✅ Set' : '❌ Missing'}</td>
            <td style="padding: 8px;">${process.env.AMAZON_REGION || 'Not set'}</td>
          </tr>
        </table>
        <p style="margin-top: 15px;"><strong>Error:</strong> ${error}</p>
      </div>
    `;
    
    return NextResponse.json(
      { 
        error: 'Failed to get instance status',
        debug: envDebugHtml
      },
      { status: 500 }
    );
  }
}