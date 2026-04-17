import { supabase } from '../config/supabase.js';
import { BookingType, BookingStatus, AASTSlot } from '../types/index.js';

async function seedFixedSchedules() {
  console.log('--- Seeding Fixed 16-Week Schedules ---');

  try {
    // 1. Get Admin User
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('employee_id', 'admin_001');
      
    if (userError || !users || users.length === 0) {
      throw new Error('Admin user not found. Run seed.ts first.');
    }
    const adminId = users[0].id;
    console.log(`Found Admin: ${adminId}`);

    // 2. Get Rooms
    const { data: rooms, error: roomError } = await supabase
      .from('rooms')
      .select('id, name')
      .in('name', ['Lecture Hall 101', 'Lecture Hall 102', 'Computer Lab A']);
      
    if (roomError || !rooms || rooms.length === 0) {
      throw new Error('Rooms not found. Run seed.ts first.');
    }

    const roomMap: Record<string, string> = {};
    for (const r of rooms) {
      roomMap[r.name] = r.id;
    }

    // 3. Define Schedules to Create
    const schedulesToCreate = [
      { roomName: 'Lecture Hall 101', slotId: AASTSlot.SLOT_1_0830 },
      { roomName: 'Lecture Hall 102', slotId: AASTSlot.SLOT_3_1230 },
      { roomName: 'Computer Lab A', slotId: AASTSlot.SLOT_5_1630 },
    ];

    const weeks = 16;
    const baseDate = new Date(); // Start today
    const bookingsToInsert: any[] = [];

    for (const schedule of schedulesToCreate) {
      const roomId = roomMap[schedule.roomName];
      if (!roomId) {
        console.warn(`Room ${schedule.roomName} not found, skipping.`);
        continue;
      }

      console.log(`Generating 16-week schedule for ${schedule.roomName} at Slot ${schedule.slotId}...`);
      
      for (let i = 0; i < weeks; i++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + (i * 7));
        const dateStr = currentDate.toISOString().split('T')[0];

        bookingsToInsert.push({
          room_id: roomId,
          requester_id: adminId,
          type: BookingType.ACADEMIC_FIXED,
          date: dateStr,
          slot_id: schedule.slotId,
          status: BookingStatus.APPROVED
        });
      }
    }

    if (bookingsToInsert.length === 0) {
        console.log('No bookings to insert.');
        process.exit(0);
    }

    // 4. Insert into Supabase
    const { error: insertError } = await supabase
      .from('bookings')
      .insert(bookingsToInsert);

    if (insertError) throw insertError;

    console.log(`✅ Successfully seeded ${bookingsToInsert.length} fixed schedule bookings.`);
    process.exit(0);

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedFixedSchedules();
