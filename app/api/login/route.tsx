import { NextResponse } from 'next/server';
import md5 from 'crypto-js/md5';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  let isValid = false;
  
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
  
  const pass = adminPassword;

  if (process.env.NEXT_PUBLIC_ADMIN_USERNAME === username && pass === password) {
    isValid = true;
  }
  
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  return NextResponse.json({ 
    success: true,
  });
}