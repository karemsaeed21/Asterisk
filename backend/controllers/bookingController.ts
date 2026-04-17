import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { Booking, BookingType, BookingStatus, Role, AASTSlot } from '../types/index.js';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { roomId, type, date, slotId, multiPurposeDetails, academicDetails } = req.body;
        const user = req.user!;

        // 0. Fetch Dynamic System Settings from system_settings table
        const { data: settings, error: settingsError } = await supabase
            .from('system_settings')
            .select('*')
            .eq('id', 'config')
            .single();

        const defaultConfig = { 
            slots: [
              { id: 1, hour: 8.5 },
              { id: 2, hour: 10.5 },
              { id: 3, hour: 12.5 },
              { id: 4, hour: 14.5 },
              { id: 5, hour: 16.5 },
              { id: 6, hour: 18.5 }
            ]
        };

        const config = settings || defaultConfig;
        const numericSlotId = Number(slotId) as AASTSlot;
        const slotConfig = config.slots.find((s: any) => s.id === numericSlotId);
        const validatedSlotHour = slotConfig ? slotConfig.hour : 8.5;

        // 1. Strict Mutex & Conflict Prevention (Only if room is assigned)
        if (roomId) {
            const { data: existingBookings, error: conflictError } = await supabase
                .from('bookings')
                .select('id')
                .eq('room_id', roomId)
                .eq('date', date)
                .eq('slot_id', numericSlotId)
                .in('status', [BookingStatus.APPROVED, BookingStatus.PENDING_BRANCH_MGR, BookingStatus.PENDING_ADMIN]);

            if (existingBookings && existingBookings.length > 0) {
                res.status(409).json({ message: 'Room is already occupied or pending approval for this time slot.' });
                return;
            }
        }

        // 2. Strict Time Constraints (24h / 48h)
        const bookingDate = new Date(`${date}T00:00:00Z`);
        bookingDate.setUTCHours(Math.floor(validatedSlotHour), (validatedSlotHour % 1) * 60, 0, 0);
        
        const now = new Date();
        const diffInHours = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (user.role === Role.SECRETARY && diffInHours < 48) {
            res.status(403).json({ message: 'College Secretary must book at least 48 hours in advance.' });
            return;
        }

        if (user.role === Role.EMPLOYEE && diffInHours < 24) {
            res.status(403).json({ message: 'Employees must book at least 24 hours in advance.' });
            return;
        }

        // 3. Secretary Restrictions (Multi-Purpose Only)
        if (user.role === Role.SECRETARY) {
            if (diffInHours < 48) {
                res.status(403).json({ message: 'College Secretary must book at least 48 hours in advance.' });
                return;
            }
            if (type !== BookingType.MULTI_PURPOSE) {
                res.status(403).json({ message: 'College Secretary is restricted to Multi-Purpose bookings only.' });
                return;
            }
        }

        // 3. Routing Approval
        let initialStatus: BookingStatus = BookingStatus.PENDING_ADMIN;
        if (user.role === Role.BRANCH_MANAGER) {
             initialStatus = BookingStatus.APPROVED;
        } else if (user.role === Role.ADMIN) {
             if (type === BookingType.MULTI_PURPOSE) {
                 initialStatus = BookingStatus.PENDING_BRANCH_MGR;
             } else {
                 initialStatus = BookingStatus.APPROVED;
             }
        }

        // 4. Create Record in Supabase
        const { data: newBooking, error: insertError } = await supabase
            .from('bookings')
            .insert({
                room_id: roomId,
                requester_id: user.id,
                type: type,
                date: date,
                slot_id: numericSlotId,
                status: initialStatus,
                multi_purpose_details: type === BookingType.MULTI_PURPOSE ? multiPurposeDetails : null,
                academic_details: (type === BookingType.ACADEMIC_FIXED || type === BookingType.ACADEMIC_EXCEPTIONAL) ? academicDetails : null
            })
            .select()
            .single();

        if (insertError) throw insertError;

        res.status(201).json({ booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyRequests = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        const { limit } = req.query as { limit?: string };
        const numericLimit = limit ? Number(limit) : 50;

        const { data: requests, error } = await supabase
             .from('bookings')
             .select('*')
             .eq('requester_id', user.id)
             .limit(numericLimit)
             .order('date', { ascending: false });

        if (error) throw error;
        
        res.status(200).json({ requests });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
