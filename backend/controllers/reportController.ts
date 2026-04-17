import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { BookingStatus, BookingType } from '../types/index.js';

/**
 * Generates the "Daily Morning Report" (Section 8.1)
 * Filters out fixed academic schedules and only returns ad-hoc/multi-purpose outliers.
 */
export const getDailyMorningReport = async (req: Request, res: Response) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Query for APPROVED bookings today that are NOT fixed academic schedules
        // With Supabase, we can join room and user names directly!
        const { data: outliers, error } = await supabase
            .from('bookings')
            .select(`
                *,
                rooms!inner(name),
                users!inner(name)
            `)
            .eq('date', today)
            .eq('status', BookingStatus.APPROVED)
            .in('type', [BookingType.ACADEMIC_EXCEPTIONAL, BookingType.MULTI_PURPOSE]);

        if (error) throw error;

        const reportData = (outliers || []).map(b => {
            const room = b.rooms as any;
            const user = b.users as any;
            return {
                id: b.id,
                room: room?.name || 'Unknown Room',
                type: b.type,
                slotId: b.slot_id,
                requester: user?.name || 'Unknown User',
                techNeeds: b.multi_purpose_details ? {
                    mics: b.multi_purpose_details.needsMics,
                    laptop: b.multi_purpose_details.needsLaptop,
                    video: b.multi_purpose_details.needsVideoConference
                } : null
            };
        });

        res.status(200).json({
            date: today,
            count: reportData.length,
            outliers: reportData
        });

    } catch (error) {
        console.error('Error generating morning report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * VIP Notifications (Section 8.2)
 * Typically this would be a polling/socket/push endpoint.
 * For now, we return high-priority actions taken by the Branch Manager.
 */
export const getVIPNotifications = async (req: Request, res: Response) => {
    try {
        // High priority notifications: Branch Manager approvals on MP rooms
        const { data: notifications, error } = await supabase
            .from('bookings')
            .select(`
                id,
                room_id,
                updated_at,
                rooms!inner(name)
            `)
            .eq('status', BookingStatus.APPROVED)
            .eq('type', BookingType.MULTI_PURPOSE)
            .order('updated_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        const mappedNotifications = (notifications || []).map(doc => {
            const room = doc.rooms as any;
            return {
                id: doc.id,
                message: `Event in ${room?.name || 'Room'} has been finalized by Branch Manager.`,
                timestamp: doc.updated_at
            };
        });

        res.status(200).json({ notifications: mappedNotifications });
    } catch (error) {
        console.error('Error fetching VIP notifications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
