import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { Role, User, UserPermissionOverrides, Delegation, DelegationStatus } from '../types/index.js';

interface AuthPayload {
  userId: string;
  role: Role;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: User;
      overrides?: UserPermissionOverrides;
      activeDelegation?: Delegation;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       res.status(401).json({ message: 'No token provided' });
       return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    
    let decoded: AuthPayload;
    try {
      decoded = jwt.verify(token, secret) as AuthPayload;
    } catch (err) {
       res.status(401).json({ message: 'Invalid token' });
       return;
    }

    // Load User from Supabase
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

    if (userError || !user) {
       res.status(401).json({ message: 'User not found' });
       return;
    }

    req.user = user as User;

    // Load Overrides from user_permissions_overrides table
    const { data: overrides } = await supabase
      .from('user_permissions_overrides')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (overrides) {
      req.overrides = {
        id: overrides.id,
        userId: overrides.user_id,
        can_view_schedule: overrides.can_view_schedule,
        can_approve_requests: overrides.can_approve_requests,
        can_manage_rooms: overrides.can_manage_rooms,
        updatedAt: overrides.updated_at
      } as UserPermissionOverrides;
    }

    // Load Active Delegations from delegations table
    const now = new Date().toISOString();
    const { data: delegations } = await supabase
      .from('delegations')
      .select('*')
      .eq('substitute_id', user.id)
      .eq('status', DelegationStatus.ACTIVE);
      
    if (delegations && delegations.length > 0) {
        for (const del of delegations) {
            if (now >= del.start_date && now <= del.end_date) {
                req.activeDelegation = {
                    id: del.id,
                    delegatorId: del.delegator_id,
                    substituteId: del.substitute_id,
                    startDate: del.start_date,
                    endDate: del.end_date,
                    status: del.status,
                    createdAt: del.created_at
                } as Delegation;
                
                // --- PERMISSION INHERITANCE ---
                // Fetch delegator identity to inherit their role/powers
                const { data: delegator } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', del.delegator_id)
                    .single();
                
                if (delegator && delegator.role) {
                    console.log(`[AUTH] Inheritance Active: Substitute ${user.name} now acting as ${delegator.role}`);
                    // Temporarily upgrade the user's role for this request
                    req.user.role = delegator.role;
                }
                break; 
            }
        }
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ message: 'Server authentication error' });
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
       res.status(401).json({ message: 'Unauthorized: Missing role' });
       return;
    }
    
    // Admin and Branch Manager naturally override or have full access
    if (req.user.role === Role.ADMIN || req.user.role === Role.BRANCH_MANAGER) {
      return next();
    }

    // --- OVERRIDE ENFORCEMENT ---
    // Check if user has explicit override for viewing schedules (most common use case for Employee/Secretary)
    if (req.overrides?.can_view_schedule && allowedRoles.length === 2 && allowedRoles.includes(Role.ADMIN) && allowedRoles.includes(Role.BRANCH_MANAGER)) {
        // This is a "See All" route that usually restricted to high roles
        return next();
    }

    // Role check
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    
    res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
  };
};

export const requireFeature = (featureName: keyof UserPermissionOverrides) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
             res.status(401).json({ message: 'Unauthorized' });
             return;
        }

        if (req.user.role === Role.ADMIN || req.user.role === Role.BRANCH_MANAGER) {
            return next();
        }

        if (req.overrides && req.overrides[featureName]) {
            return next();
        }
        
        res.status(403).json({ message: `Forbidden: Requires feature ${String(featureName)}` });
    }
}
