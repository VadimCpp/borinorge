import { NextRequest, NextResponse } from 'next/server';
import { userPool } from '@/app/cognito';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      userPool.signUp(
        email,
        password,
        [], // no custom attributes
        [], // validation data
        (err, data) => {
          if (err) {
            console.error('Signup error:', err);
            resolve(
              NextResponse.json(
                { message: err.message || 'Signup failed' },
                { status: 400 }
              )
            );
          } else {
            resolve(
              NextResponse.json(
                { 
                  message: 'User registered successfully. Please check your email for confirmation code.',
                  userSub: data?.userSub 
                },
                { status: 200 }
              )
            );
          }
        }
      );
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 