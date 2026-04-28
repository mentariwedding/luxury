import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Stub client agar app tidak crash ketika env vars belum di-set (mis. saat preview tanpa Supabase).
// Setiap query akan resolve dengan { data: null, error } sehingga komponen jatuh ke fallback.
function createStubClient() {
    if (typeof window === 'undefined') {
        // Server: log sekali untuk debug
        console.warn(
            '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set. ' +
                'Aplikasi akan menggunakan konten default. Tambahkan env vars untuk konten dinamis.',
        );
    }

    const stubError = { message: 'Supabase belum dikonfigurasi (env vars tidak ditemukan).' };
    const stubResult = { data: null, error: stubError, count: null };

    // Builder yang chainable: .select().eq().order().limit().single() dst.
    function makeBuilder() {
        const builder = {
            select: () => builder,
            insert: () => builder,
            update: () => builder,
            delete: () => builder,
            upsert: () => builder,
            eq: () => builder,
            neq: () => builder,
            gt: () => builder,
            gte: () => builder,
            lt: () => builder,
            lte: () => builder,
            like: () => builder,
            ilike: () => builder,
            in: () => builder,
            order: () => builder,
            limit: () => builder,
            range: () => builder,
            single: () => Promise.resolve(stubResult),
            maybeSingle: () => Promise.resolve(stubResult),
            then: (resolve) => Promise.resolve(stubResult).then(resolve),
        };
        return builder;
    }

    return {
        from: () => makeBuilder(),
        auth: {
            getUser: async () => ({ data: { user: null }, error: null }),
            signInWithPassword: async () => ({ data: null, error: stubError }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        storage: {
            from: () => ({
                upload: async () => ({ data: null, error: stubError }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
                remove: async () => ({ data: null, error: stubError }),
            }),
        },
    };
}

export const supabase =
    supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createStubClient();
