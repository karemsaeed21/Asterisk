import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { Role, DelegationStatus } from '../types/index.js';

/**
 * Gets all users (Admin only)
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, employee_id, name, role, created_at');

        if (error) throw error;

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Updates or creates permission overrides for a specific user
 */
export const updateUserOverride = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { canViewSchedule, canApproveRequests, canManageRooms } = req.body;

        const { error } = await supabase
            .from('user_permissions_overrides')
            .upsert({
                user_id: userId,
                can_view_schedule: canViewSchedule,
                can_approve_requests: canApproveRequests,
                can_manage_rooms: canManageRooms,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;

        res.status(200).json({ message: 'User overrides updated successfully' });
    } catch (error) {
        console.error('Error updating overrides:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Creates a new delegation record
 */
export const createDelegation = async (req: Request, res: Response) => {
    try {
        const { substituteId, startDate, endDate } = req.body;
        const delegatorId = req.user!.id;

        // Validation
        if (!substituteId || !startDate || !endDate) {
            res.status(400).json({ message: 'Substitute ID and date range are required.' });
            return;
        }

        const { data: delegation, error } = await supabase
            .from('delegations')
            .insert({
                delegator_id: delegatorId,
                substitute_id: substituteId,
                start_date: startDate,
                end_date: endDate,
                status: DelegationStatus.ACTIVE
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ delegation });
    } catch (error) {
        console.error('Error creating delegation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Revokes an existing delegation
 */
export const revokeDelegation = async (req: Request, res: Response) => {
    try {
        const { delegationId } = req.params;

        const { error } = await supabase
            .from('delegations')
            .update({ status: DelegationStatus.REVOKED })
            .eq('id', delegationId);

        if (error) throw error;

        res.status(200).json({ message: 'Delegation revoked successfully' });
    } catch (error) {
        console.error('Error revoking delegation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
