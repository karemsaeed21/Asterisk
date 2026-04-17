import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { BookingStatus, BookingRejection } from '../types/index.js';

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
            alternativeTimeSlot: alternativeTimeSlot ? Number(alternativeTimeSlot) : undefined,
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
