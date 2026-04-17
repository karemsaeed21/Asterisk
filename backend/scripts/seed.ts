import { supabase } from '../config/supabase.js';
import { Role, RoomType } from '../types/index.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('--- Asterisk Supabase Production Data Seeding ---');

  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Seed System Settings (Dynamic Slots)
    console.log('Configuring System Settings...');
    const { data: existingSettings } = await supabase
        .from('system_settings')
        .select('*')
        .eq('id', 'config')
        .single();
    
    if (!existingSettings) {
      const { error } = await supabase.from('system_settings').insert({
        id: 'config',
        slot_mode: 'STANDARD',
        slots: [
          { id: 1, startTime: '08:30 AM', hour: 8.5 },
          { id: 2, startTime: '10:30 AM', hour: 10.5 },
          { id: 3, startTime: '12:30 PM', hour: 12.5 },
          { id: 4, startTime: '02:30 PM', hour: 14.5 },
          { id: 5, startTime: '04:30 PM', hour: 16.5 },
          { id: 6, startTime: '06:30 PM', hour: 18.5 }
        ]
      });
      if (error) throw error;
      console.log('✅ System Settings initialized (Standard Mode).');
    }

    // 2. Seed Users
    console.log('Provisioning Initial Personnel...');
    const users = [
      { employee_id: 'admin_001', name: 'Super Admin', role: Role.ADMIN },
      { employee_id: 'branch_manager_01', name: 'Eng. Sarah Yasin', role: Role.BRANCH_MANAGER },
      { employee_id: 'secretary_01', name: 'Mona Hassan', role: Role.SECRETARY },
      { employee_id: 'dr_ahmed', name: 'Dr. Ahmed Khaled', role: Role.EMPLOYEE },
    ];

    for (const u of users) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('employee_id', u.employee_id)
        .single();

      if (!existingUser) {
        const { error } = await supabase.from('users').insert({
          employee_id: u.employee_id,
          name: u.name,
          role: u.role,
          password_hash: passwordHash
        });
        if (error) throw error;
        console.log(`✅ User ${u.name} seeded.`);
      }
    }

    // 3. Seed Rooms (Academic & Multi-Purpose)
    console.log('Mapping Campus Resources...');
    const rooms = [
      { name: 'Lecture Hall 101', type: RoomType.LECTURE, capacity: 200, is_active: true },
      { name: 'Lecture Hall 102', type: RoomType.LECTURE, capacity: 150, is_active: true },
      { name: 'Computer Lab A', type: RoomType.LECTURE, capacity: 40, is_active: true },
      { name: 'Physics Lab', type: RoomType.LECTURE, capacity: 30, is_active: true },
      { name: 'Main Auditorium', type: RoomType.MULTI_PURPOSE, capacity: 500, is_active: true },
      { name: 'VIP Seminar Room', type: RoomType.MULTI_PURPOSE, capacity: 50, is_active: true },
      { name: 'Meeting Room Alpha', type: RoomType.MULTI_PURPOSE, capacity: 20, is_active: true },
    ];

    for (const r of rooms) {
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('*')
        .eq('name', r.name)
        .single();

      if (!existingRoom) {
        const { error } = await supabase.from('rooms').insert(r);
        if (error) throw error;
        console.log(`✅ Room ${r.name} mapped.`);
      }
    }

    console.log('--- Seeding Complete Successfully ---');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
