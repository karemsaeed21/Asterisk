import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { BookingStatus, BookingRejection, BookingType, AASTSlot } from '../types/index.js';

export const approveBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params as { bookingId: string };

        const { error } = await supabase
            .from('bookings')
            .update({
                status: BookingStatus.APPROVED,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);

        if (error) {
            res.status(404).json({ message: 'Booking not found or error updating' });
            return;
        }

        res.status(200).json({ message: 'Booking approved successfully.' });
    } catch (error) {
        console.error('Error approving booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const rejectBookingWithAlternatives = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params as { bookingId: string };
        const { reason, alternativeTimeSlot, alternativeDate, alternativeRoomId } = req.body;
        const user = req.user!;

        if (!reason) {
            res.status(400).json({ message: 'Rejection reason is required.' });
            return;
        }

        const rejectionDetails: BookingRejection = {
            reason,
            alternativeTimeSlot: alternativeTimeSlot ? (Number(alternativeTimeSlot) as AASTSlot) : undefined,
            alternativeDate,
            alternativeRoomId,
            rejectedBy: user.id,
            rejectedAt: new Date().toISOString()
        };

        const { error } = await supabase
            .from('bookings')
            .update({
                status: BookingStatus.REJECTED,
                multi_purpose_details: rejectionDetails, // Storing rejection details in the jsonb column or a dedicated one
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);

        if (error) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        res.status(200).json({ message: 'Booking rejected with alternatives.' });
    } catch (error) {
        console.error('Error rejecting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getPendingRequests = async (req: Request, res: Response) => {
    try {
        const { data: requests, error } = await supabase
            .from('bookings')
            .select(`
                *,
                rooms!inner(name),
                users!inner(name)
            `)
            .in('status', [BookingStatus.PENDING_ADMIN, BookingStatus.PENDING_BRANCH_MGR]);

        if (error) throw error;

        // Optionally flattening the joined data if the frontend expects a specific format
        res.status(200).json({ requests });
    } catch (error) {
         console.error('Error fetching pending requests:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}

export const createFixedSchedule = async (req: Request, res: Response) => {
    try {
        const { roomId, slotId, startDate, weeks = 16, academicDetails } = req.body;
        const user = req.user!;

        if (!roomId || !slotId || !startDate) {
            res.status(400).json({ message: 'roomId, slotId, and startDate are required' });
            return;
        }

        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
            res.status(400).json({ message: 'Invalid startDate format' });
            return;
        }

        const bookingsToInsert = [];
        for (let i = 0; i < weeks; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i * 7);
            const dateStr = current.toISOString().split('T')[0];

            bookingsToInsert.push({
                room_id: roomId,
                requester_id: user.id,
                type: BookingType.ACADEMIC_FIXED,
                date: dateStr,
                slot_id: Number(slotId),
                status: BookingStatus.APPROVED,
                academic_details: academicDetails
            });
        }

        // Check for conflicts over all these dates
        const dates = bookingsToInsert.map(b => b.date);
        const { data: conflicts, error: conflictError } = await supabase
            .from('bookings')
            .select('id, date')
            .eq('room_id', roomId)
            .eq('slot_id', Number(slotId))
            .in('date', dates)
            .in('status', [BookingStatus.APPROVED, BookingStatus.PENDING_BRANCH_MGR, BookingStatus.PENDING_ADMIN]);

        if (conflictError) throw conflictError;

        if (conflicts && conflicts.length > 0) {
            res.status(409).json({ 
                message: 'Conflicts detected for one or more dates in the schedule.',
                conflicts 
            });
            return;
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert(bookingsToInsert)
            .select();

        if (error) throw error;

        res.status(201).json({ message: `Successfully created ${weeks}-week schedule.`, bookings: data });
    } catch (error) {
        console.error('Error creating fixed schedule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteFixedSchedule = async (req: Request, res: Response) => {
    try {
        const { roomId, slotId, startDate, weeks = 16 } = req.query as { roomId: string, slotId: string, startDate: string, weeks?: string };

        if (!roomId || !slotId || !startDate) {
            res.status(400).json({ message: 'roomId, slotId, and startDate are required' });
            return;
        }

        const numWeeks = Number(weeks);
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + (numWeeks - 1) * 7);

        const startDateStr = start.toISOString().split('T')[0];
        const endDateStr = end.toISOString().split('T')[0];

        // Ensure we only delete bookings falling on the exact same day of the week
        // A generic approach is to fetch them all in range, filter in JS, and delete by IDs
        const { data: records, error: fetchError } = await supabase
            .from('bookings')
            .select('id, date')
            .eq('room_id', roomId)
            .eq('slot_id', Number(slotId))
            .eq('type', BookingType.ACADEMIC_FIXED)
            .gte('date', startDateStr)
            .lte('date', endDateStr);

        if (fetchError) throw fetchError;

        const targetDay = start.getDay();
        const idsToDelete = (records || [])
            .filter(r => new Date(r.date).getDay() === targetDay)
            .map(r => r.id);

        if (idsToDelete.length === 0) {
            res.status(404).json({ message: 'No matching fixed schedule bookings found.' });
            return;
        }

        const { error: deleteError } = await supabase
            .from('bookings')
            .delete()
            .in('id', idsToDelete);

        if (deleteError) throw deleteError;

        res.status(200).json({ message: `Successfully deleted ${idsToDelete.length} bookings from the schedule.` });
    } catch (error) {
        console.error('Error deleting fixed schedule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getFixedSchedules = async (req: Request, res: Response) => {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select(`
                *,
                rooms!inner(name),
                users!inner(name)
            `)
            .eq('type', BookingType.ACADEMIC_FIXED)
            .gte('date', new Date().toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) throw error;

        res.status(200).json({ schedules: bookings });
    } catch (error) {
        console.error('Error fetching fixed schedules:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getDailySchedule = async (req: Request, res: Response) => {
    try {
        const { date } = req.query as { date?: string };

        if (!date) {
            res.status(400).json({ message: 'date is required' });
            return;
        }

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select(`
                *,
                rooms!inner(id, name, type, capacity),
                users(name)
            `)
            .eq('date', date);

        if (error) throw error;

        // Fetch all active rooms to render empty rows in the UI
        const { data: rooms, error: roomError } = await supabase
            .from('rooms')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (roomError) throw roomError;

        res.status(200).json({ bookings, rooms });
    } catch (error) {
        console.error('Error fetching daily schedule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateBookingData = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { roomId, slotId, date, academicDetails, multiPurposeDetails } = req.body;

        // Check for conflicts if room, slot, or date is changing
        if (roomId || slotId || date) {
            const { data: currentBooking, error: fetchError } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', bookingId)
                .single();

            if (fetchError) throw fetchError;

            const targetRoomId = roomId || currentBooking.room_id;
            const targetSlotId = slotId || currentBooking.slot_id;
            const targetDate = date || currentBooking.date;

            // Check against APPROVED and PENDING bookings, excluding current one
            const { data: conflicts, error: conflictError } = await supabase
                .from('bookings')
                .select('id')
                .eq('room_id', targetRoomId)
                .eq('slot_id', targetSlotId)
                .eq('date', targetDate)
                .neq('id', bookingId)
                .in('status', ['APPROVED', 'PENDING_ADMIN', 'PENDING_BRANCH_MGR']);

            if (conflictError) throw conflictError;

            if (conflicts && conflicts.length > 0) {
                res.status(409).json({ message: 'Conflict detected: The target slot is already occupied.' });
                return;
            }
        }

        const updates: any = {};
        if (roomId) updates.room_id = roomId;
        if (slotId) updates.slot_id = slotId;
        if (date) updates.date = date;
        if (academicDetails) updates.academic_details = academicDetails;
        if (multiPurposeDetails) updates.multi_purpose_details = multiPurposeDetails;

        const { data, error } = await supabase
            .from('bookings')
            .update(updates)
            .eq('id', bookingId)
            .select();

        if (error) throw error;

        res.status(200).json({ message: 'Booking updated successfully', booking: data[0] });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;

        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) throw error;

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
