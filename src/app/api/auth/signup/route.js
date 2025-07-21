
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, phone, password } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // TODO: Implement actual user creation logic
    // This is a placeholder - replace with your user management system
    // Examples: Database insertion, password hashing, email verification, etc.
    
    // Connect to DB
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role: allow only 'admin' to set role, otherwise always 'user'
    let role = 'user';
    // If you want to allow admin to create other roles, you can check here (e.g., from session)
    if (body.role && ['admin', 'superadmin', 'agent', 'user'].includes(body.role)) {
      // Optionally, add logic to check if the current user is admin before allowing this
      role = body.role;
    }

    // Save user to database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      company: company || '',
      phone: phone || '',
      password: hashedPassword,
      role
    });

    // TODO: Send welcome email (optional)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        company: newUser.company,
        phone: newUser.phone
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
