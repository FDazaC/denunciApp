import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

@Injectable()
export class SupabaseService {

    private supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!,
        {
            realtime: {
                transport: ws as any,
            },
        },
    );

    getClient() {
        return this.supabase;
    }
}