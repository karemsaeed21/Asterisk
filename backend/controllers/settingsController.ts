import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getSettings = async (req: Request, res: Response) => {
    try {
        const { data: settings, error } = await supabase
            .from('system_settings')
            .select('*')
            .eq('id', 'config')
            .single();

        if (error || !settings) {
            // Default configuration if none exists
            const defaultConfig = {
                id: 'config',
                slot_mode: 'STANDARD',
                slots: [
                    { id: 1, startTime: '08:30', hour: 8.5 },
                    { id: 2, startTime: '10:30', hour: 10.5 },
                    { id: 3, startTime: '12:30', hour: 12.5 },
                    { id: 4, startTime: '02:30', hour: 14.5 },
                    { id: 5, startTime: '04:30', hour: 16.5 },
                    { id: 6, startTime: '06:30', hour: 18.5 },
                ]
            };
            
            // Insert default if it doesn't exist
            await supabase.from('system_settings').upsert(defaultConfig);
            res.status(200).json(defaultConfig);
            return;
        }

        // Map snake_case from DB to camelCase if needed, 
        // but here we keep data structure consistent with frontend
        res.status(200).json(settings);
    } catch (error) {
         console.error('Error fetching settings:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPublicSettings = async (req: Request, res: Response) => {
    // This is a version of getSettings that returns limited non-sensitive configuration
    // currently just slots and slot mode.
    try {
        const { data: settings, error } = await supabase
            .from('system_settings')
            .select('*')
            .eq('id', 'config')
            .single();

        if (error || !settings) {
            // Return defaults if not found
            res.status(200).json({
                slot_mode: 'STANDARD',
                slots: [
                    { id: 1, startTime: '08:30', hour: 8.5 },
                    { id: 2, startTime: '10:30', hour: 10.5 },
                    { id: 3, startTime: '12:30', hour: 12.5 },
                    { id: 4, startTime: '02:30', hour: 14.5 },
                    { id: 5, startTime: '04:30', hour: 16.5 },
                    { id: 6, startTime: '06:30', hour: 18.5 },
                ]
            });
            return;
        }

        res.status(200).json({
            slotMode: settings.slot_mode,
            slots: settings.slots
        });
    } catch (error) {
        console.error('Error fetching public settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const { slotMode, slots } = req.body;
        
        const { error } = await supabase
            .from('system_settings')
            .update({
                slot_mode: slotMode,
                slots: slots,
                updated_at: new Date().toISOString()
            })
            .eq('id', 'config');

        if (error) throw error;

        res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
