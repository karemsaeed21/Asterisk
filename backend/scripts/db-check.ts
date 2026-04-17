import { supabase } from '../config/supabase.js';
import { RoomType } from '../types/index.js';

async function verifyDB() {
  console.log('--- Database Verification ---');

  try {
    // Check Rooms
    const { data: rooms, error: roomError } = await supabase.from('rooms').select('*');
    if (roomError) throw roomError;
    console.log(`Found ${rooms?.length || 0} rooms.`);
    
    const lectureRooms = rooms?.filter(r => r.type === RoomType.LECTURE);
    const multiPurposeRooms = rooms?.filter(r => r.type === RoomType.MULTI_PURPOSE);
    
    console.log(`- Lecture Rooms: ${lectureRooms?.length || 0}`);
    console.log(`- Multi-Purpose Rooms: ${multiPurposeRooms?.length || 0}`);

    // Check System Settings
    const { data: settings, error: settingsError } = await supabase
        .from('system_settings')
        .select('*')
        .eq('id', 'config')
        .single();
    
    if (settingsError) {
        console.log('Settings not found in DB. Will use defaults.');
    } else {
        console.log('System Settings (Slots):');
        console.log(JSON.stringify(settings.slots, null, 2));
    }

    process.exit(0);
  } catch (error: any) {
    console.error('Error during verification:', error.message);
    process.exit(1);
  }
}

verifyDB();
