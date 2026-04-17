import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 5001}/api`;

async function runTests() {
  console.log('🚀 Starting Point 1 Full Testing...');

  try {
    // 1. Initial Login (Admin)
    console.log('\n--- 1. Authentication ---');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      employee_id: 'admin_001',
      password: 'password123'
    });
    const token = loginRes.data.token;
    const adminHeaders = { Authorization: `Bearer ${token}` };
    console.log('✅ Admin login successful.');

    // 2. Room Management (Point 1.1)
    console.log('\n--- 1.1 Core Entities: Room Management ---');
    const roomsRes = await axios.get(`${API_URL}/rooms`, { headers: adminHeaders });
    console.log(`✅ Fetched ${roomsRes.data.rooms.length} rooms.`);

    const newRoomName = `Test Room ${Date.now()}`;
    const createRoomRes = await axios.post(`${API_URL}/rooms`, {
      name: newRoomName,
      type: 'LECTURE',
      capacity: 50
    }, { headers: adminHeaders });
    const testRoom = createRoomRes.data.room;
    console.log(`✅ Created new room: ${testRoom.name} (ID: ${testRoom.id})`);

    // 3. Time Slots & Availability (Point 1.2)
    console.log('\n--- 1.2 Time & Scheduling: Slots & Availability ---');
    const date = '2026-05-01';
    const slotId = 1; // 08:30 AM
    const availRes = await axios.get(`${API_URL}/rooms/availability`, {
      params: { date, slotId },
      headers: adminHeaders
    });
    console.log(`✅ Fetched availability for ${date} Slot ${slotId}. Found ${availRes.data.availableRooms.length} rooms.`);

    // 4. Booking Modalities (Point 1.3)
    console.log('\n--- 1.3 Booking Modalities: Ad-Hoc & Event ---');
    
    // Ad-Hoc Booking
    console.log('Testing Ad-Hoc Lecture Booking...');
    const adHocRes = await axios.post(`${API_URL}/bookings`, {
      roomId: testRoom.id,
      type: 'ACADEMIC_EXCEPTIONAL',
      date,
      slotId: 1
    }, { headers: adminHeaders });
    console.log(`✅ Ad-Hoc Booking created (Status: ${adHocRes.data.booking.status})`);

    // Event Booking
    console.log('Testing Event Booking...');
    const eventRes = await axios.post(`${API_URL}/bookings`, {
      roomId: testRoom.id,
      type: 'MULTI_PURPOSE',
      date: '2026-05-02',
      slotId: 2,
      multiPurposeDetails: {
        purpose: 'Annual Conference',
        eventManagerName: 'John Doe',
        mobileNumber: '0123456789',
        needsMics: true
      }
    }, { headers: adminHeaders });
    console.log(`✅ Event Booking created (Status: ${eventRes.data.booking.status})`);

    // 5. Conflict Prevention
    console.log('\n--- Conflict Prevention Check ---');
    try {
      await axios.post(`${API_URL}/bookings`, {
        roomId: testRoom.id,
        type: 'ACADEMIC_EXCEPTIONAL',
        date,
        slotId: 1
      }, { headers: adminHeaders });
      console.log('❌ Conflict prevention FAILED (allowed duplicate booking).');
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        console.log('✅ Conflict prevention SUCCESS (blocked duplicate booking).');
      } else {
        console.log('❌ Unexpected error during conflict test:', err.message);
      }
    }

    console.log('\n✨ Point 1 Full Testing Completed Successfully.');

  } catch (error: any) {
    console.error('\n❌ Testing Failed:', error.response?.data || error.message);
  }
}

runTests();
