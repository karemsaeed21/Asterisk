import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

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

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    // Mapping DB columns to the legacy User interface expected by the frontend
    const userPayload = {
        id: user.id,
        employee_id: user.employee_id,
        name: user.name,
        role: user.role
    };

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '8h' });

    res.status(200).json({
      token,
      user: userPayload
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
