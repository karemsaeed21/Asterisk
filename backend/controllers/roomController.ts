import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { Room, RoomType, BookingStatus } from '../types/index.js';

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { type } = req.query as { type?: string };
    
    let query = supabase.from('rooms').select('*');

    if (type) {
      if (typeof type === 'string' && Object.values(RoomType).includes(type as RoomType)) {
        query = query.eq('type', type);
      } else {
        res.status(400).json({ message: 'Invalid room type' });
        return;
      }
    }

    const { data: rooms, error } = await query;
    if (error) throw error;

    res.status(200).json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoomAvailability = async (req: Request, res: Response) => {
    try {
        const { date, slotId, type } = req.query as { date?: string; slotId?: string; type?: string };

        if (!date || !slotId) {
            res.status(400).json({ message: 'Date and slotId are required' });
            return;
        }

        const numericSlot = Number(slotId);

        // Step 1: Subquery to find IDs of occupied rooms
        // In Supabase client, we usually fetch IDs and then filter, 
        // OR use a raw SQL RPC if it's very complex. 
        // For this simple case, we'll fetch occupied IDs.
        const { data: occupiedBookings, error: bookingError } = await supabase
            .from('bookings')
            .select('room_id')
            .eq('date', date)
            .eq('slot_id', numericSlot)
            .in('status', [BookingStatus.APPROVED, BookingStatus.PENDING_BRANCH_MGR]);

        if (bookingError) throw bookingError;
        const occupiedRoomIds = occupiedBookings.map(b => b.room_id);

        // Step 2: Fetch available rooms (not in the occupied list)
        let query = supabase.from('rooms')
            .select('*')
            .eq('is_active', true);

        if (type) {
            query = query.eq('type', type);
        }

        if (occupiedRoomIds.length > 0) {
            query = query.not('id', 'in', `(${occupiedRoomIds.join(',')})`);
        }

        const { data: availableRooms, error: roomError } = await query;
        if (roomError) throw roomError;

        res.status(200).json({ availableRooms });

    } catch (error) {
        console.error('Error fetching room availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Admin only: Add a new room dynamically
export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, type, capacity } = req.body;

        if (!name || !type) {
            res.status(400).json({ message: 'Name and type are required' });
            return;
        }

        const { data: room, error } = await supabase
            .from('rooms')
            .insert({
                name,
                type: type as RoomType,
                capacity: capacity ? Number(capacity) : 0,
                is_active: true
            })
            .select()
            .single();
        
        if (error) throw error;

        res.status(201).json({ room });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
