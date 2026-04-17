import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { UserStatus } from '../types/index.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
      res.status(400).json({ message: 'Missing employee_id or password' });
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('employee_id', employee_id)
      .single();
    
    if (error) {
        if (error.code === 'PGRST116') {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.status(401).json({ message: 'Authentication service error' });
        return;
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (user.status === UserStatus.PENDING) {
        res.status(403).json({ message: 'Identity Clearance Pending. Please contact a Campus Administrator.' });
        return;
    }

    if (user.status === UserStatus.REJECTED) {
        res.status(403).json({ message: 'Identity Verification Failed. Access permanently revoked.' });
        return;
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '8h' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { employee_id, password, name } = req.body;

        if (!employee_id || !password || !name) {
            res.status(400).json({ message: 'Missing required registration fields' });
            return;
        }

        // Check if employee ID already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('employee_id', employee_id)
            .single();
        
        if (existingUser) {
            res.status(409).json({ message: 'Identity ID already registered' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                employee_id,
                name,
                password_hash: passwordHash,
                status: UserStatus.PENDING
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ 
            message: 'Registration request received. Awaiting administrative clearance.',
            user: {
                employee_id: newUser.employee_id,
                name: newUser.name,
                status: newUser.status
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
