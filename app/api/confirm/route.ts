import { NextRequest, NextResponse } from 'next/server';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '@/app/cognito';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and confirmation code are required' },
        { status: 400 }
      );
    }

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    return new Promise((resolve) => {
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) {
          console.error('Confirmation error:', err);
          resolve(
            NextResponse.json(
              { message: err.message || 'Confirmation failed' },
              { status: 400 }
            )
          );
        } else {
          resolve(
            NextResponse.json(
              { message: 'User confirmed successfully' },
              { status: 200 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error('Confirmation API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 