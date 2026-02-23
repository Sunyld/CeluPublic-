module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://wuppmtktghypzgbiyldj.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cHBtdGt0Z2h5cHpnYml5bGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDc2MjYsImV4cCI6MjA4NjY4MzYyNn0.FBeRMBEaP9mMgSkZEp5h6-Lk5p0iLp4ApQhy7EAB58Q"));
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Persistência local para MVP.
 * Permite que o app funcione sem backend; depois pode ser trocado por Supabase.
 */ __turbopack_context__.s([
    "storage",
    ()=>storage
]);
const KEYS = {
    ADS: 'celupublic_ads',
    CATEGORIES: 'celupublic_categories',
    USERS: 'celupublic_users',
    BANNERS: 'celupublic_banners',
    LIKED_IDS: 'celupublic_liked',
    CURRENT_USER: 'celupublic_current_user',
    AD_CLICKS: 'celupublic_ad_clicks'
};
function get(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw == null) return fallback;
        return JSON.parse(raw);
    } catch  {
        return fallback;
    }
}
function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function normalizeAd(a) {
    const status = 'status' in a && a.status != null ? a.status : a.published === true ? 'published' : 'draft';
    const { published, ...rest } = a;
    return {
        ...rest,
        status
    };
}
const storage = {
    getAds () {
        const raw = get(KEYS.ADS, []);
        return raw.map(normalizeAd);
    },
    setAds (ads) {
        set(KEYS.ADS, ads);
    },
    getCategories () {
        return get(KEYS.CATEGORIES, []);
    },
    setCategories (categories) {
        set(KEYS.CATEGORIES, categories);
    },
    getUsers () {
        return get(KEYS.USERS, []);
    },
    setUsers (users) {
        set(KEYS.USERS, users);
    },
    getBanners () {
        return get(KEYS.BANNERS, []);
    },
    setBanners (banners) {
        set(KEYS.BANNERS, banners);
    },
    getLikedIds () {
        return get(KEYS.LIKED_IDS, {});
    },
    setLikedIds (ids) {
        set(KEYS.LIKED_IDS, ids);
    },
    getCurrentUserId () {
        return get(KEYS.CURRENT_USER, null);
    },
    setCurrentUserId (id) {
        set(KEYS.CURRENT_USER, id);
    },
    getAdClicks () {
        return get(KEYS.AD_CLICKS, []);
    },
    setAdClicks (clicks) {
        set(KEYS.AD_CLICKS, clicks);
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/usersRepo.local.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usersRepo",
    ()=>usersRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storage.ts [app-ssr] (ecmascript)");
;
const usersRepo = {
    async list (filters) {
        let list = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getUsers();
        if (filters?.status) list = list.filter((u)=>u.status === filters.status);
        if (filters?.role) list = list.filter((u)=>u.role === filters.role);
        return list.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async getById (id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getUsers().find((u)=>u.id === id) ?? null;
    },
    getCurrentUserId () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getCurrentUserId();
    },
    setCurrentUserId (id) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setCurrentUserId(id);
    },
    async create (data) {
        const now = new Date().toISOString();
        const user = {
            ...data,
            id: data.id ?? crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
        };
        const users = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getUsers();
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setUsers([
            ...users,
            user
        ]);
        return user;
    },
    async updateStatus (id, status) {
        const users = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getUsers();
        const index = users.findIndex((u)=>u.id === id);
        if (index === -1) return null;
        const now = new Date().toISOString();
        const updated = {
            ...users[index],
            status,
            updatedAt: now
        };
        const next = [
            ...users
        ];
        next[index] = updated;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setUsers(next);
        return updated;
    },
    async update (id, data) {
        const users = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getUsers();
        const index = users.findIndex((u)=>u.id === id);
        if (index === -1) return null;
        const now = new Date().toISOString();
        const updated = {
            ...users[index],
            ...data,
            updatedAt: now
        };
        const next = [
            ...users
        ];
        next[index] = updated;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setUsers(next);
        return updated;
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Standardized app errors for repository and UI feedback.
 */ __turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "ERROR_CODES",
    ()=>ERROR_CODES,
    "ERROR_MESSAGES",
    ()=>ERROR_MESSAGES,
    "getMessageForError",
    ()=>getMessageForError,
    "toAppError",
    ()=>toAppError,
    "withTimeout",
    ()=>withTimeout
]);
const ERROR_CODES = {
    LIMIT_REACHED: 'LIMIT_REACHED',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    TIMEOUT: 'TIMEOUT',
    SUPABASE_CONFIG: 'SUPABASE_CONFIG',
    STORAGE_BUCKET_MISSING: 'STORAGE_BUCKET_MISSING',
    UNKNOWN: 'UNKNOWN'
};
class AppError extends Error {
    code;
    details;
    constructor(code, message, /** Optional low-level details for logging/diagnostics (never mostrado cru na UI). */ details){
        super(message), this.code = code, this.details = details;
        this.name = 'AppError';
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
const ERROR_MESSAGES = {
    [ERROR_CODES.LIMIT_REACHED]: 'Atingiu o limite de anúncios para este tipo. Remova um anúncio antigo ou contacte o administrador.',
    [ERROR_CODES.NOT_FOUND]: 'Não encontrado.',
    [ERROR_CODES.UNAUTHORIZED]: 'Sem permissão para esta ação.',
    [ERROR_CODES.TIMEOUT]: 'A operação demorou demasiado tempo. Tente novamente.',
    [ERROR_CODES.SUPABASE_CONFIG]: 'Configuração do Supabase em falta. Verifique as variáveis de ambiente no servidor.',
    [ERROR_CODES.STORAGE_BUCKET_MISSING]: "Bucket de armazenamento em falta no Supabase. Confirme o nome do bucket no dashboard.",
    [ERROR_CODES.UNKNOWN]: 'Ocorreu um erro inesperado. Tente novamente.'
};
function getMessageForError(error) {
    if (error instanceof AppError) return ERROR_MESSAGES[error.code] ?? error.message;
    if (error instanceof Error) return error.message;
    return 'Ocorreu um erro. Tente novamente.';
}
function toAppError(error, context) {
    if (error instanceof AppError) return error;
    // Supabase client error (postgrest, storage, auth)
    const supa = error;
    if (supa?.message || supa?.status || supa?.code) {
        const status = supa.status;
        const message = supa.message ?? context?.fallbackMessage ?? 'Erro ao comunicar com o servidor. Tente novamente.';
        if (status === 401 || status === 403) {
            return new AppError(ERROR_CODES.UNAUTHORIZED, message, supa);
        }
        if (status === 404) {
            return new AppError(ERROR_CODES.NOT_FOUND, message, supa);
        }
        return new AppError(ERROR_CODES.UNKNOWN, message, supa);
    }
    if (error instanceof Error) {
        return new AppError(ERROR_CODES.UNKNOWN, error.message, error);
    }
    return new AppError(ERROR_CODES.UNKNOWN, context?.fallbackMessage ?? 'Ocorreu um erro. Tente novamente.', error);
}
async function withTimeout(promise, ms, label = 'Operação') {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject)=>{
        timeoutId = setTimeout(()=>{
            reject(new AppError(ERROR_CODES.TIMEOUT, `${label} demorou demasiado tempo a responder. Tente novamente mais tarde.`));
        }, ms);
    });
    try {
        const result = await Promise.race([
            promise,
            timeoutPromise
        ]);
        return result;
    } finally{
        if (timeoutId) clearTimeout(timeoutId);
    }
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabase",
    ()=>getSupabase,
    "getSupabaseClientId",
    ()=>getSupabaseClientId,
    "supabase",
    ()=>supabase,
    "supabaseConfigError",
    ()=>supabaseConfigError,
    "useSupabase",
    ()=>useSupabase
]);
/**
 * Supabase client SINGLETON — único no app inteiro.
 *
 * Regras:
 * - createClient chamado UMA única vez (guard `supabaseInstance`).
 * - storageKey FIXO → evita logout em refresh por chave trocada.
 * - storage: window.localStorage explícito → evita SSR issues e garante persistência.
 * - persistSession: true + autoRefreshToken: true → sessão estável.
 * - detectSessionInUrl: true → necessário para PKCE/OAuth callback.
 *
 * USE SEMPRE `getSupabase()` nos repos/context. Nunca re-importe createClient.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
;
;
const url = ("TURBOPACK compile-time value", "https://wuppmtktghypzgbiyldj.supabase.co");
const anonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cHBtdGt0Z2h5cHpnYml5bGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDc2MjYsImV4cCI6MjA4NjY4MzYyNn0.FBeRMBEaP9mMgSkZEp5h6-Lk5p0iLp4ApQhy7EAB58Q");
const useSupabaseFlag = String(("TURBOPACK compile-time value", "true") ?? '').toLowerCase() === 'true';
const hasCredentials = !!url && !!anonKey;
const useSupabase = useSupabaseFlag && hasCredentials;
const supabaseConfigError = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
/**
 * Chave de storage FIXA.
 * CRÍTICO: deve ser estável entre reloads e builds.
 * Se mudar → todos os utilizadores fazem logout.
 */ const SUPABASE_STORAGE_KEY = 'celu_auth_v1';
/**
 * ID único desta instância (singleton proof).
 * Deve ser igual em todos os lugares do app.
 */ const CLIENT_INSTANCE_ID = typeof crypto !== 'undefined' ? crypto.randomUUID() : 'ssr-client-id';
// ── Log de arranque ────────────────────────────────────────────────────────────
if ("TURBOPACK compile-time truthy", 1) {
    // eslint-disable-next-line no-console
    console.log('[BOOT] Supabase flag:', useSupabaseFlag, '| hasCredentials:', hasCredentials);
    // eslint-disable-next-line no-console
    // console.log('[BOOT] storageHelpers version:', __STORAGE_HELPERS_VERSION__);
    // eslint-disable-next-line no-console
    console.log('[BOOT] CLIENT_INSTANCE_ID:', CLIENT_INSTANCE_ID);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
let supabaseInstance = null;
function createSupabase() {
    // Modo local ou credenciais em falta: não cria client
    if (!useSupabaseFlag || !hasCredentials) {
        return null;
    }
    // SINGLETON: devolve instância existente se já criada
    if (supabaseInstance) {
        if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line no-console
            console.log('[BOOT] Supabase singleton reutilizado, clientId:', CLIENT_INSTANCE_ID);
        }
        return supabaseInstance;
    }
    try {
        supabaseInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                // CRÍTICO: storageKey fixo evita logout em refresh por chave instável
                storageKey: SUPABASE_STORAGE_KEY,
                // storage explícito: garante localStorage e não sessionStorage
                storage: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined,
                // flowType PKCE: mais seguro para OAuth
                flowType: 'pkce'
            }
        });
        if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line no-console
            console.log('[BOOT] Supabase client CRIADO:', {
                clientId: CLIENT_INSTANCE_ID,
                storageKey: SUPABASE_STORAGE_KEY,
                url: url?.slice(0, 40) + '...'
            });
        }
        return supabaseInstance;
    } catch (err) {
        if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line no-console
            console.error('[BOOT] Failed to create Supabase client:', err);
            // eslint-disable-next-line no-console
            console.warn('[BOOT] Falling back to local mode');
        }
        return null;
    }
}
function getSupabase() {
    return createSupabase();
}
function getSupabaseClientId() {
    return CLIENT_INSTANCE_ID;
}
const supabase = createSupabase();
// Prova singleton no boot (DEV only)
if (("TURBOPACK compile-time value", "development") === 'development' && supabase) {
    // eslint-disable-next-line no-console
    console.log('[BOOT] supabase export clientId:', CLIENT_INSTANCE_ID, '(deve ser igual em AuthContext e repos)');
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/usersRepo.supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Supabase implementation: profiles table + Auth.
 * Requires RLS policies and profiles table (see supabase/migrations).
 */ __turbopack_context__.s([
    "usersRepoSupabase",
    ()=>usersRepoSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
;
;
function rowToUser(row) {
    if (!row) throw new Error('[USERS_REPO] Invalid profile row');
    return {
        id: row.id,
        email: row.email || '',
        name: row.full_name || 'Utilizador',
        role: row.role === 'admin' ? 'admin' : 'seller',
        status: row.status || 'pending',
        accountType: row.account_type ?? undefined,
        whatsapp: row.whatsapp ?? undefined,
        city: row.city ?? undefined,
        province: row.province ?? undefined,
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString()
    };
}
let currentUserId = null;
const usersRepoSupabase = {
    getCurrentUserId () {
        return currentUserId;
    },
    setCurrentUserId (id) {
        currentUserId = id;
    },
    async list (filters) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return [];
        let query = supabase.from('profiles').select('*').order('created_at', {
            ascending: false
        });
        if (filters?.status) query = query.eq('status', filters.status);
        if (filters?.role) query = query.eq('role', filters.role);
        const { data, error } = await query;
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][usersRepo.list]', error);
            if (error.code === 'PGRST116' || error.message?.includes('policy')) {
                return [];
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, error.message);
        }
        return data.map(rowToUser);
    },
    async getById (id) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (error || !data) {
                if (error) {
                    // If 0 rows found with single(), it's expected if profile trigger hasn't run yet or is pending sync.
                    // PGRST116 = "The result contains 0 rows"
                    if (error.code === 'PGRST116') {
                        return null;
                    }
                    // eslint-disable-next-line no-console
                    console.error('[SUPABASE ERROR][usersRepo.getById]', {
                        code: error.code,
                        message: error.message,
                        details: error.details
                    });
                    // Check for RLS recursion error (42P17)
                    if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('infinite')) {
                        // eslint-disable-next-line no-console
                        console.error('[RLS] profiles policy recursion detected (42P17) - ensure migration 20250216_fix_profiles_rls_no_recursion.sql is applied');
                    }
                }
                return null;
            }
            return rowToUser(data);
        } catch (err) {
            // Catch any unexpected errors (network, etc.)
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][usersRepo.getById] unexpected error:', err);
            return null;
        }
    },
    async create () {
        // CRÍTICO: Criação de perfis deve ser feita via Route Handler servidor (bypass RLS).
        // O client anon/auth não tem permissão de INSERT direto em profiles em muitos cenários de bootstrap.
        // Isso evita o erro 42501 (new row violates row-level security policy).
        throw new Error('[USERS_REPO] Direct create is disabled from client. Use /api/profile/ensure');
    },
    async updateStatus (id, status) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const { data, error } = await supabase.from('profiles').update({
            status,
            updated_at: new Date().toISOString()
        }).eq('id', id).select().single();
        if (error || !data) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][usersRepo.updateStatus]', error);
            }
            return null;
        }
        return rowToUser(data);
    },
    async update (id, payload) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const updates = {
            updated_at: new Date().toISOString()
        };
        if (payload.name != null) updates.full_name = payload.name;
        if (payload.email != null) updates.email = payload.email;
        if (payload.whatsapp != null) updates.whatsapp = payload.whatsapp;
        if (payload.province != null) updates.province = payload.province;
        if (payload.city != null) updates.city = payload.city;
        if (payload.role != null) updates.role = payload.role;
        if (payload.status != null) updates.status = payload.status;
        if (payload.accountType != null) updates.account_type = payload.accountType;
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
        if (error || !data) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][usersRepo.update]', error);
            }
            return null;
        }
        return rowToUser(data);
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getUsersRepo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUsersRepo",
    ()=>getUsersRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$usersRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/usersRepo.local.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$usersRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/usersRepo.supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
function getUsersRepo() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$usersRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usersRepoSupabase"] : __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$usersRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usersRepo"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/authInstrumentation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Instrumentação de autenticação para debugging e rastreamento de fluxos.
 * Gera trace IDs únicos por tentativa de login e loga eventos estruturados.
 */ __turbopack_context__.s([
    "clearAuthLogs",
    ()=>clearAuthLogs,
    "generateAuthAttemptId",
    ()=>generateAuthAttemptId,
    "getAuthLogs",
    ()=>getAuthLogs,
    "logAuthEvent",
    ()=>logAuthEvent
]);
const LOGS = [];
const MAX_LOGS = 100;
function generateAuthAttemptId() {
    return `auth_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
function logAuthEvent(attemptId, event, data) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const log = {
        attemptId,
        timestamp: Date.now(),
        event,
        data
    };
    LOGS.push(log);
    if (LOGS.length > MAX_LOGS) {
        LOGS.shift();
    }
    // eslint-disable-next-line no-console
    console.log(`[AUTH_FLOW] ${event}`, {
        attemptId,
        ...data
    });
}
function getAuthLogs() {
    return [
        ...LOGS
    ];
}
function clearAuthLogs() {
    LOGS.length = 0;
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/providers/AuthProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getUsersRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getUsersRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$authInstrumentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/authInstrumentation.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const ADMIN_EMAIL = 'sunyldjosesomailamatapa@gmail.com';
const USE_SUPABASE = ("TURBOPACK compile-time value", "true") === 'true';
function AuthProvider({ children }) {
    const [authStatus, setAuthStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(("TURBOPACK compile-time truthy", 1) ? 'booting' : "TURBOPACK unreachable");
    const [profileStatus, setProfileStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [profileUser, setProfileUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [authError, setAuthError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const currentAttemptIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$authInstrumentation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateAuthAttemptId"])());
    const repo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getUsersRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUsersRepo"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])(), []);
    const lastHandledUserIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ensureProfileCacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const ensureFailedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const ensureAttemptedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Derived flags
    const user = profileUser;
    const isPending = !!user && [
        'pending',
        'pending_payment',
        'pending_review'
    ].includes(user.status);
    const isRejected = user?.status === 'rejected';
    const isBlocked = user?.status === 'blocked';
    const isAdmin = user?.role === 'admin';
    const isApprovedSeller = user?.status === 'approved';
    const getPostLoginRedirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((profile)=>{
        const p = profile ?? profileUser;
        if (!p) return '/';
        // Admin logic
        if (p.role === 'admin' && p.status === 'approved') return '/admin';
        // Seller logic
        if (p.status === 'approved') return '/vendedor';
        // Activation flow for seller
        if ([
            'pending_payment',
            'pending_review',
            'rejected',
            'pending'
        ].includes(p.status)) {
            return '/vendedor/ativacao';
        }
        return '/ativacao'; // Fallback
    }, [
        profileUser
    ]);
    const ensureProfileForSupabaseUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (supabaseUser)=>{
        const id = supabaseUser.id;
        const email = (supabaseUser.email ?? '').toLowerCase();
        const isAdminEmail = email === ADMIN_EMAIL;
        // 1. Check promise cache (prevents concurrent calls)
        const cached = ensureProfileCacheRef.current.get(id);
        if (cached) return cached;
        // 2. Check cooldown for recent failures
        const failedAt = ensureFailedRef.current.get(id);
        if (failedAt && Date.now() - failedAt < 30_000) {
            setProfileStatus('error');
            return null;
        }
        const promise = (async ()=>{
            setProfileStatus('loading');
            console.log('[PROFILE] Checking for userId:', id.slice(0, 8));
            try {
                // a) Try client-side SELECT first
                let profile = await repo.getById(id);
                if (profile) {
                    console.log('[PROFILE] Found via client SELECT');
                    if (isAdminEmail && profile.role !== 'admin') {
                        profile = await repo.update(id, {
                            role: 'admin',
                            status: 'approved'
                        });
                    }
                    setProfileStatus('ready');
                    return profile;
                }
                // b) Not found -> Check Circuit Breaker before calling API
                if (ensureAttemptedRef.current.has(id)) {
                    console.warn('[PROFILE] Circuit breaker active: skipping second ensure attempt');
                    setProfileStatus('error');
                    setAuthError('Perfil não encontrado após tentativa de criação.');
                    return null;
                }
                console.log('[PROFILE] Not found on client. Attempting server-side ensure...');
                ensureAttemptedRef.current.add(id);
                const meta = supabaseUser.user_metadata ?? {};
                const name = meta.full_name ?? meta.name ?? email ?? 'Utilizador';
                // c) Call Server Route Handler using service_role
                const response = await fetch('/api/profile/ensure', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id,
                        email,
                        full_name: name
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Falha na resposta do servidor');
                }
                const created = await response.json();
                console.log('[PROFILE] Successfully ensured via server route handler');
                setProfileStatus('ready');
                return created;
            } catch (err) {
                console.error('[PROFILE] Error in ensureProfile flow:', err);
                ensureFailedRef.current.set(id, Date.now());
                setProfileStatus('error');
                setAuthError(err.message || 'Erro ao carregar ou criar perfil');
                return null;
            }
        })();
        ensureProfileCacheRef.current.set(id, promise);
        // Cleanup cache after 10s
        setTimeout(()=>ensureProfileCacheRef.current.delete(id), 10000);
        return promise;
    }, [
        repo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        let cancelled = false;
        supabase.auth.getSession().then(async ({ data: { session } })=>{
            if (cancelled) return;
            if (session?.user) {
                setAuthStatus('authenticated');
                const profile = await ensureProfileForSupabaseUser(session.user);
                if (!cancelled) setProfileUser(profile);
            } else {
                setAuthStatus('anonymous');
            }
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session)=>{
            if (cancelled) return;
            if (event === 'SIGNED_OUT') {
                setProfileUser(null);
                setAuthStatus('anonymous');
                setProfileStatus('idle');
            } else if (session?.user) {
                setAuthStatus('authenticated');
                if (lastHandledUserIdRef.current !== session.user.id) {
                    lastHandledUserIdRef.current = session.user.id;
                    const profile = await ensureProfileForSupabaseUser(session.user);
                    if (!cancelled) setProfileUser(profile);
                }
            }
        });
        return ()=>{
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [
        supabase,
        ensureProfileForSupabaseUser
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email, password)=>{
        setAuthStatus('authenticating');
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        });
        if (error || !data.user) {
            setAuthStatus('anonymous');
            setAuthError(error?.message || 'Login falhou');
            return null;
        }
        const profile = await ensureProfileForSupabaseUser(data.user);
        setProfileUser(profile);
        return profile;
    }, [
        supabase,
        ensureProfileForSupabaseUser
    ]);
    const loginWithGoogle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const redirectTo = `${window.location.origin}/auth/callback`;
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    prompt: 'select_account',
                    access_type: 'offline'
                }
            }
        });
    }, [
        supabase
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await supabase.auth.signOut();
        setProfileUser(null);
        setAuthStatus('anonymous');
        setProfileStatus('idle');
    }, [
        supabase
    ]);
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (payload)=>{
        const { data, error } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
            options: {
                data: {
                    full_name: payload.full_name
                }
            }
        });
        if (error || !data.user) {
            setAuthError(error?.message || 'Falha no cadastro');
            return null;
        }
        console.log('[AUTH] Signup success, ensuring profile via server...');
        // Ensure profile via server route handler (bypass RLS)
        const response = await fetch('/api/profile/ensure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.user.id,
                email: payload.email,
                full_name: payload.full_name,
                whatsapp: payload.whatsapp,
                province: payload.province,
                account_type: payload.account_type
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('[AUTH] Register profile ensure failed:', errorData);
            setAuthStatus('anonymous');
            setAuthError('Utilizador criado, mas falha ao gerar perfil: ' + (errorData.error || 'Erro interno'));
            return null;
        }
        const profile = await response.json();
        setProfileUser(profile);
        setProfileStatus('ready');
        return profile;
    }, [
        supabase
    ]);
    const refreshProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        if (sbUser) {
            const p = await repo.getById(sbUser.id);
            setProfileUser(p);
        }
    }, [
        supabase,
        repo
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            user,
            login,
            logout,
            register,
            isPending,
            isRejected,
            isBlocked,
            isAdmin,
            isApprovedSeller,
            authStatus,
            profileStatus,
            authError,
            refreshProfile,
            loginWithGoogle,
            getPostLoginRedirect
        }), [
        user,
        login,
        logout,
        register,
        isPending,
        isRejected,
        isBlocked,
        isAdmin,
        isApprovedSeller,
        authStatus,
        profileStatus,
        authError,
        refreshProfile,
        loginWithGoogle,
        getPostLoginRedirect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/providers/AuthProvider.tsx",
        lineNumber: 329,
        columnNumber: 12
    }, this);
}
function useAuth() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Constantes do CeluPublic.
 */ __turbopack_context__.s([
    "APP_NAME",
    ()=>APP_NAME,
    "CIDADES_POR_PROVINCIA",
    ()=>CIDADES_POR_PROVINCIA,
    "CONTACT_INFO",
    ()=>CONTACT_INFO,
    "LIMITS",
    ()=>LIMITS,
    "PLACEHOLDER_IMAGE",
    ()=>PLACEHOLDER_IMAGE,
    "PROVINCIAS_MOCAMBIQUE",
    ()=>PROVINCIAS_MOCAMBIQUE
]);
const APP_NAME = 'CeluPublic';
const CONTACT_INFO = {
    WHATSAPP: '+258 87 833 0517',
    WHATSAPP_RAW: '258878330517',
    EMAIL: 'celupublic@gmail.com',
    SUPPORT_SEC: 'celupublic@gmail.com'
};
const LIMITS = {
    MAX_PRODUCTS: 10,
    MAX_SERVICES: 5,
    MAX_AD_IMAGES: 5,
    ACTIVATION_FEE_MT: 20
};
const PROVINCIAS_MOCAMBIQUE = [
    'Cabo Delgado',
    'Gaza',
    'Inhambane',
    'Manica',
    'Maputo',
    'Maputo Cidade',
    'Nampula',
    'Niassa',
    'Sofala',
    'Tete',
    'Zambézia'
];
const CIDADES_POR_PROVINCIA = {
    'Cabo Delgado': [
        'Pemba',
        'Montepuez',
        'Mocímboa da Praia',
        'Chinde'
    ],
    'Gaza': [
        'Xai-Xai',
        'Chókwè',
        'Macia',
        'Chibuto'
    ],
    'Inhambane': [
        'Inhambane',
        'Maxixe',
        'Vilanculos',
        'Massinga'
    ],
    'Manica': [
        'Chimoio',
        'Manica',
        'Gondola',
        'Sussundenga'
    ],
    'Maputo': [
        'Matola',
        'Boane',
        'Manhiça',
        'Marracuene',
        'Namaacha'
    ],
    'Maputo Cidade': [
        'Maputo',
        'KaMavota',
        'KaMubukwana',
        'KaMaxakeni',
        'KaMphumo',
        'KaTembe',
        'KaNyaka'
    ],
    'Nampula': [
        'Nampula',
        'Nacala',
        'Angoche',
        'Monapo',
        'Mozambique'
    ],
    'Niassa': [
        'Lichinga',
        'Cuamba',
        'Metangula'
    ],
    'Sofala': [
        'Beira',
        'Dondo',
        'Nhamatanda',
        'Chibabava'
    ],
    'Tete': [
        'Tete',
        'Moatize',
        'Angónia',
        'Zumbo'
    ],
    'Zambézia': [
        'Quelimane',
        'Mocuba',
        'Gurúè',
        'Milange',
        'Nicoadala'
    ]
};
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e2e8f0/64748b?text=Sem+imagem';
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/cache.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCache",
    ()=>getCache,
    "invalidate",
    ()=>invalidate,
    "invalidatePrefix",
    ()=>invalidatePrefix,
    "setCache",
    ()=>setCache
]);
/**
 * Simple in-app cache with TTL. Used for ads list and other data to avoid reprocessing.
 * Invalidate when data is mutated (create/update/delete).
 */ const CACHE_PREFIX = 'celupublic_cache_';
const META_KEY = CACHE_PREFIX + 'meta';
function getMeta() {
    try {
        const raw = localStorage.getItem(META_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch  {
        return {};
    }
}
function setMeta(meta) {
    try {
        localStorage.setItem(META_KEY, JSON.stringify(meta));
    } catch  {
    // ignore
    }
}
function getCache(key) {
    try {
        const meta = getMeta();
        const entry = meta[key];
        if (!entry || Date.now() > entry.expires) return null;
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        return raw ? JSON.parse(raw) : null;
    } catch  {
        return null;
    }
}
function setCache(key, value, ttlMs) {
    try {
        const meta = getMeta();
        meta[key] = {
            expires: Date.now() + ttlMs
        };
        setMeta(meta);
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
    } catch  {
    // ignore
    }
}
function invalidate(key) {
    try {
        const meta = getMeta();
        delete meta[key];
        setMeta(meta);
        localStorage.removeItem(CACHE_PREFIX + key);
    } catch  {
    // ignore
    }
}
function invalidatePrefix(prefix) {
    try {
        const meta = getMeta();
        let changed = false;
        for (const k of Object.keys(meta)){
            if (k.startsWith(prefix)) {
                delete meta[k];
                localStorage.removeItem(CACHE_PREFIX + k);
                changed = true;
            }
        }
        if (changed) setMeta(meta);
    } catch  {
    // ignore
    }
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/selectors/adsSelectors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Public ad selectors: only published ads whose owner has status "approved".
 * Use these for Home, AdListing, AdDetail related ads — not for admin or seller dashboard.
 */ __turbopack_context__.s([
    "getAdsByCategoryPublic",
    ()=>getAdsByCategoryPublic,
    "getPublicAds",
    ()=>getPublicAds,
    "getRelatedPublicAds",
    ()=>getRelatedPublicAds,
    "getTopRankedPublicAds",
    ()=>getTopRankedPublicAds,
    "isAdOwnerApproved",
    ()=>isAdOwnerApproved
]);
function approvedOwnerIds(users) {
    const set = new Set();
    // Safe: guard against undefined/null
    if (!users || !Array.isArray(users)) return set;
    for (const u of users){
        if (u?.status === 'approved' && u?.id) set.add(u.id);
    }
    return set;
}
function getPublicAds(ads, users) {
    // Safe: guard against undefined/null arrays
    if (!ads || !Array.isArray(ads)) return [];
    if (!users || !Array.isArray(users)) return [];
    try {
        const approved = approvedOwnerIds(users);
        return ads.filter((a)=>a?.status === 'published' && a?.userId && approved.has(a.userId)).sort((a, b)=>{
            const timeA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const timeB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return timeB - timeA;
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[SELECTORS] Error in getPublicAds:', err);
        return [];
    }
}
function getTopRankedPublicAds(ads, users, limit = 8) {
    const publicAds = getPublicAds(ads, users);
    return [
        ...publicAds
    ].sort((a, b)=>b.likes - a.likes).slice(0, limit);
}
function getAdsByCategoryPublic(ads, users, categoryId) {
    const approved = approvedOwnerIds(users);
    return ads.filter((a)=>a.status === 'published' && approved.has(a.userId) && a.categoryId === categoryId).sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
function getRelatedPublicAds(ad, ads, users, limit = 4) {
    const approved = approvedOwnerIds(users);
    return ads.filter((a)=>a.status === 'published' && approved.has(a.userId) && a.id !== ad.id && (a.categoryId === ad.categoryId || a.type === ad.type)).sort((a, b)=>b.likes - a.likes).slice(0, limit);
}
function isAdOwnerApproved(ad, users) {
    const u = users.find((x)=>x.id === ad.userId);
    return u?.status === 'approved';
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/clicksRepo.local.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Local implementation: ad clicks stored in localStorage.
 * TODO Supabase: replace with ad_clicks table (id, ad_id, created_at, type).
 * Suggested index: (created_at), (ad_id, created_at) for stats by ad and by date.
 */ __turbopack_context__.s([
    "clicksRepo",
    ()=>clicksRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/cache.ts [app-ssr] (ecmascript)");
;
;
const CACHE_PREFIX_CLICK_STATS = 'clickStats'; // invalidates clickStats:7d:v1 etc.
function genId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `click-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
const clicksRepo = {
    async trackWhatsAppClick (adId, _userId) {
        const now = new Date().toISOString();
        const click = {
            id: genId(),
            adId,
            createdAt: now,
            type: 'whatsapp'
        };
        const clicks = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAdClicks();
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setAdClicks([
            ...clicks,
            click
        ]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidatePrefix"])(CACHE_PREFIX_CLICK_STATS);
    },
    async listClicks (filters) {
        let list = [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAdClicks()
        ];
        if (filters?.adId) list = list.filter((c)=>c.adId === filters.adId);
        if (filters?.from) {
            const fromMs = new Date(filters.from).getTime();
            list = list.filter((c)=>new Date(c.createdAt).getTime() >= fromMs);
        }
        if (filters?.to) {
            const toMs = new Date(filters.to).getTime();
            list = list.filter((c)=>new Date(c.createdAt).getTime() <= toMs);
        }
        list.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return list;
    },
    async getStats (filters) {
        const list = await this.listClicks({
            from: filters?.from,
            to: filters?.to
        });
        const clicksByAdId = {};
        for (const c of list){
            clicksByAdId[c.adId] = (clicksByAdId[c.adId] ?? 0) + 1;
        }
        const topAds = Object.entries(clicksByAdId).map(([adId, clicks])=>({
                adId,
                clicks
            })).sort((a, b)=>b.clicks - a.clicks);
        return {
            totalClicks: list.length,
            clicksByAdId,
            topAds
        };
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/clicksRepo.supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clicksRepoSupabase",
    ()=>clicksRepoSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
;
;
const clicksRepoSupabase = {
    async trackWhatsAppClick (adId, userId) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return;
        const { error } = await supabase.from('ad_clicks').insert({
            ad_id: adId,
            user_id: userId ?? null,
            type: 'whatsapp'
        });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][clicksRepo.trackWhatsAppClick]', error);
            throw error;
        }
    },
    async listClicks (_filters) {
        // Not used in Supabase mode for UI; return vazio.
        return [];
    },
    async getStats (filters) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return {
            totalClicks: 0,
            clicksByAdId: {},
            topAds: []
        };
        // 1) Primeiro tentamos usar as views agregadas (quando existirem).
        const useWindow = !!(filters?.from || filters?.to);
        const viewTable = useWindow ? 'ad_click_counts_7d' : 'ad_click_counts_all';
        try {
            const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withTimeout"])(supabase.from(viewTable).select('ad_id, clicks_total, clicks_7d'), 12_000, 'Estatísticas de cliques');
            if (!error && Array.isArray(data)) {
                const clicksByAdId = {};
                let total = 0;
                for (const row of data){
                    const adId = row.ad_id;
                    const count = row.clicks_total ?? row.clicks_7d ?? 0;
                    if (!adId) continue;
                    clicksByAdId[adId] = count;
                    total += count;
                }
                const topAds = Object.entries(clicksByAdId).map(([adId, clicks])=>({
                        adId,
                        clicks
                    })).sort((a, b)=>b.clicks - a.clicks);
                return {
                    totalClicks: total,
                    clicksByAdId,
                    topAds
                };
            }
            // Se der erro 400 / view inexistente, fazemos fallback manual.
            if (error) {
                const status = error.status;
                const message = error.message;
                const isViewMissing = status === 400 || message && (message.includes('does not exist') || message.includes('relation "ad_click_counts_') || message.toLowerCase().includes('view'));
                if (!isViewMissing) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        // eslint-disable-next-line no-console
                        console.error('[SUPABASE ERROR][clicksRepo.getStats]', error);
                    }
                    return {
                        totalClicks: 0,
                        clicksByAdId: {},
                        topAds: []
                    };
                }
            }
        } catch (err) {
            if ("TURBOPACK compile-time truthy", 1) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][clicksRepo.getStats view]', err);
            }
        // Em caso de timeout/erro duro, tentamos fallback com tabela base de cliques.
        }
        // 2) Fallback: agrega manualmente a partir de ad_clicks quando as views não existem.
        try {
            let query = supabase.from('ad_clicks').select('ad_id, created_at');
            if (filters?.from) {
                query = query.gte('created_at', filters.from);
            }
            if (filters?.to) {
                query = query.lte('created_at', filters.to);
            }
            const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withTimeout"])(query, 12_000, 'Estatísticas de cliques (fallback)');
            if (error || !Array.isArray(data)) {
                if (error && ("TURBOPACK compile-time value", "development") === 'development') {
                    // eslint-disable-next-line no-console
                    console.error('[SUPABASE ERROR][clicksRepo.getStats fallback]', error);
                }
                return {
                    totalClicks: 0,
                    clicksByAdId: {},
                    topAds: []
                };
            }
            const clicksByAdId = {};
            let total = 0;
            for (const row of data){
                const adId = row.ad_id;
                if (!adId) continue;
                clicksByAdId[adId] = (clicksByAdId[adId] ?? 0) + 1;
                total += 1;
            }
            const topAds = Object.entries(clicksByAdId).map(([adId, clicks])=>({
                    adId,
                    clicks
                })).sort((a, b)=>b.clicks - a.clicks);
            return {
                totalClicks: total,
                clicksByAdId,
                topAds
            };
        } catch (err) {
            const appError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toAppError"])(err, {
                fallbackMessage: 'Não foi possível carregar estatísticas de cliques.'
            });
            if ("TURBOPACK compile-time truthy", 1) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][clicksRepo.getStats fallback fatal]', appError);
            }
            return {
                totalClicks: 0,
                clicksByAdId: {},
                topAds: []
            };
        }
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getClicksRepo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getClicksRepo",
    ()=>getClicksRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$clicksRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/clicksRepo.local.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$clicksRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/clicksRepo.supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
function getClicksRepo() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$clicksRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clicksRepoSupabase"] : __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$clicksRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clicksRepo"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/likesRepo.local.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "likesRepo",
    ()=>likesRepo
]);
const PREFIX = 'CELU_LIKES:';
function getKey(userId) {
    return `${PREFIX}${userId}`;
}
function load(userId) {
    try {
        const raw = localStorage.getItem(getKey(userId));
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch  {
        return [];
    }
}
function save(userId, ids) {
    try {
        localStorage.setItem(getKey(userId), JSON.stringify(ids));
    } catch  {
    // ignore
    }
}
const likesRepo = {
    async getUserLikes (userId) {
        return load(userId);
    },
    async toggleLike (adId, userId) {
        const list = load(userId);
        const idx = list.indexOf(adId);
        if (idx >= 0) {
            list.splice(idx, 1);
            save(userId, list);
            return false;
        }
        list.push(adId);
        save(userId, list);
        return true;
    },
    async getLikeCounts (_adIds) {
        // Local mode: contagens vêm do próprio objeto Ad.likes (mantém comportamento atual).
        return {};
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/likesRepo.supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "likesRepoSupabase",
    ()=>likesRepoSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
const likesRepoSupabase = {
    async getUserLikes (userId) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from('ad_likes').select('ad_id').eq('user_id', userId);
        if (error || !Array.isArray(data)) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][likesRepo.getUserLikes]', error);
            }
            return [];
        }
        return data.map((r)=>r.ad_id);
    },
    async toggleLike (adId, userId) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return false;
        const { error } = await supabase.from('ad_likes').insert({
            ad_id: adId,
            user_id: userId
        }).single();
        if (!error) return true;
        // Duplicate PK -> unlike
        if (error.code === '23505') {
            const { error: delError } = await supabase.from('ad_likes').delete().eq('ad_id', adId).eq('user_id', userId);
            if (delError) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][likesRepo.toggleLike delete]', delError);
                throw delError;
            }
            return false;
        }
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][likesRepo.toggleLike]', error);
        throw error;
    },
    async getLikeCounts (adIds) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase || adIds.length === 0) return {};
        const { data, error } = await supabase.from('ad_like_counts').select('ad_id, likes_count').in('ad_id', adIds);
        if (error || !Array.isArray(data)) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][likesRepo.getLikeCounts]', error);
            }
            return {};
        }
        const out = {};
        for (const row of data){
            out[row.ad_id] = Number(row.likes_count) || 0;
        }
        return out;
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getLikesRepo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLikesRepo",
    ()=>getLikesRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$likesRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/likesRepo.local.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$likesRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/likesRepo.supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
function getLikesRepo() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$likesRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["likesRepoSupabase"] : __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$likesRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["likesRepo"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/cachedData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Cached computed data: public ads list and click stats (7d).
 * Uses src/lib/cache.ts with TTL; invalidate on ad/user/click mutations.
 */ __turbopack_context__.s([
    "getCachedClickStatsLast7Days",
    ()=>getCachedClickStatsLast7Days,
    "getCachedLikeCounts",
    ()=>getCachedLikeCounts,
    "getCachedPublicAds",
    ()=>getCachedPublicAds,
    "invalidateClickStatsCache",
    ()=>invalidateClickStatsCache,
    "invalidateLikeCountsCache",
    ()=>invalidateLikeCountsCache,
    "invalidatePublicAdsCache",
    ()=>invalidatePublicAdsCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/cache.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$selectors$2f$adsSelectors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/selectors/adsSelectors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getClicksRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getClicksRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getLikesRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getLikesRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const PUBLIC_ADS_KEY = 'publicAds:v1';
const PUBLIC_ADS_TTL_MS = 60_000; // 60s
const CLICK_STATS_7D_KEY = 'clickStats:7d:v1';
const CLICK_STATS_TTL_MS = 30_000; // 30s
const LIKE_COUNTS_KEY = 'likeCounts:v1';
const LIKE_COUNTS_TTL_MS = 30_000;
function getCachedPublicAds(ads, users) {
    const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCache"])(PUBLIC_ADS_KEY);
    if (cached != null) return cached;
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$selectors$2f$adsSelectors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPublicAds"])(ads, users);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCache"])(PUBLIC_ADS_KEY, result, PUBLIC_ADS_TTL_MS);
    return result;
}
function invalidatePublicAdsCache() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidate"])(PUBLIC_ADS_KEY);
}
async function getCachedClickStatsLast7Days() {
    const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCache"])(CLICK_STATS_7D_KEY);
    if (cached != null) return cached;
    try {
        const to = new Date();
        const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
        const stats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getClicksRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getClicksRepo"])().getStats({
            from: from.toISOString(),
            to: to.toISOString()
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCache"])(CLICK_STATS_7D_KEY, stats, CLICK_STATS_TTL_MS);
        return stats;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[CACHE] Failed to load click stats:', err);
        // Return empty stats instead of throwing
        const emptyStats = {
            totalClicks: 0,
            clicksByAdId: {},
            topAds: []
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCache"])(CLICK_STATS_7D_KEY, emptyStats, CLICK_STATS_TTL_MS);
        return emptyStats;
    }
}
function invalidateClickStatsCache() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidate"])(CLICK_STATS_7D_KEY);
}
async function getCachedLikeCounts(adIds) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"]) return {};
    const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCache"])(LIKE_COUNTS_KEY);
    if (cached != null) return cached;
    try {
        const counts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getLikesRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLikesRepo"])().getLikeCounts(adIds);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCache"])(LIKE_COUNTS_KEY, counts, LIKE_COUNTS_TTL_MS);
        return counts;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[CACHE] Failed to load like counts:', err);
        // Return empty map instead of throwing
        const emptyCounts = {};
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCache"])(LIKE_COUNTS_KEY, emptyCounts, LIKE_COUNTS_TTL_MS);
        return emptyCounts;
    }
}
function invalidateLikeCountsCache() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidate"])(LIKE_COUNTS_KEY);
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/adsRepo.local.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adsRepo",
    ()=>adsRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/cache.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/constants.ts [app-ssr] (ecmascript)");
;
;
;
;
const CACHE_KEY = 'ads_list';
const adsRepo = {
    async list (filters) {
        const ads = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAds();
        let result = [
            ...ads
        ];
        if (filters?.userId) result = result.filter((a)=>a.userId === filters.userId);
        if (filters?.status !== undefined) result = result.filter((a)=>a.status === filters.status);
        result.sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        return result;
    },
    async getById (id) {
        const ads = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAds();
        return ads.find((a)=>a.id === id) ?? null;
    },
    async create (data, options) {
        const bypassLimit = options?.bypassLimit === true;
        if (!bypassLimit && data.userId) {
            const ads = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAds();
            const ownerAds = ads.filter((a)=>a.userId === data.userId);
            let countProduct = 0;
            let countService = 0;
            for (const a of ownerAds){
                if (a.type === 'product') countProduct++;
                else countService++;
            }
            if (data.type === 'product' && countProduct >= __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIMITS"].MAX_PRODUCTS) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].LIMIT_REACHED, 'Limite de 10 produtos atingido.');
            }
            if (data.type === 'service' && countService >= __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIMITS"].MAX_SERVICES) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].LIMIT_REACHED, 'Limite de 5 serviços atingido.');
            }
        }
        const now = new Date().toISOString();
        const status = data.status ?? 'published';
        const ad = {
            ...data,
            status,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now
        };
        const ads = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAds();
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setAds([
            ...ads,
            ad
        ]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidatePrefix"])(CACHE_KEY);
        return ad;
    },
    async update (id, data) {
        const ads = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAds();
        const index = ads.findIndex((a)=>a.id === id);
        if (index === -1) return null;
        const now = new Date().toISOString();
        const updated = {
            ...ads[index],
            ...data,
            updatedAt: now
        };
        const next = [
            ...ads
        ];
        next[index] = updated;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setAds(next);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidatePrefix"])(CACHE_KEY);
        return updated;
    },
    async delete (id) {
        const ads = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getAds();
        const next = ads.filter((a)=>a.id !== id);
        if (next.length === ads.length) return false;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setAds(next);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidatePrefix"])(CACHE_KEY);
        return true;
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storageHelpers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__STORAGE_HELPERS_VERSION__",
    ()=>__STORAGE_HELPERS_VERSION__,
    "clearStorageUrlCache",
    ()=>clearStorageUrlCache,
    "getPublicUrl",
    ()=>getPublicUrl,
    "getSignedUrl",
    ()=>getSignedUrl,
    "isProbablyUrl",
    ()=>isProbablyUrl,
    "normalizeStoragePath",
    ()=>normalizeStoragePath,
    "resolveStorageUrl",
    ()=>resolveStorageUrl
]);
/**
 * Storage helpers: normalize paths, generate URLs (public or signed).
 * CRITICAL RULES:
 * - Never construct URLs manually by concatenating strings.
 * - Always use Supabase API: getPublicUrl() or createSignedUrl().
 * - DB stores ONLY paths (never full URLs).
 * - UI resolves URLs async when needed (signed URLs require async).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
const __STORAGE_HELPERS_VERSION__ = '2026-02-20T00:00:00Z';
const SIGNED_URL_CACHE = new Map();
function isProbablyUrl(value) {
    return value.startsWith('http://') || value.startsWith('https://');
}
function normalizeStoragePath(input, bucket) {
    if (!input) return '';
    // If it's already a path (no http/https), clean it
    if (!isProbablyUrl(input)) {
        return input.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
    }
    // Extract path from URL
    // Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    // Or: https://<project>.supabase.co/storage/v1/object/sign/<bucket>/<path>?...
    // Or (wrong): https://<project>.supabase.co/storage/v1/object/<bucket>/<path>
    try {
        const url = new URL(input);
        // Match both correct (/public/) and wrong (no /public/) formats
        let pathMatch = url.pathname.match(new RegExp(`/storage/v1/object/(?:public|sign)/${bucket}/(.+)$`));
        if (!pathMatch) {
            // Try wrong format (no /public/)
            pathMatch = url.pathname.match(new RegExp(`/storage/v1/object/${bucket}/(.+)$`));
        }
        if (pathMatch && pathMatch[1]) {
            return decodeURIComponent(pathMatch[1]);
        }
        // Fallback: try to find bucket in pathname
        const bucketIndex = url.pathname.indexOf(`/${bucket}/`);
        if (bucketIndex !== -1) {
            const afterBucket = url.pathname.substring(bucketIndex + bucket.length + 1);
            const queryIndex = afterBucket.indexOf('?');
            const path = queryIndex !== -1 ? afterBucket.substring(0, queryIndex) : afterBucket;
            return decodeURIComponent(path);
        }
    } catch  {
        // Invalid URL, try manual extraction
        const bucketIndex = input.indexOf(`/${bucket}/`);
        if (bucketIndex !== -1) {
            const afterBucket = input.substring(bucketIndex + bucket.length + 1);
            const queryIndex = afterBucket.indexOf('?');
            const path = queryIndex !== -1 ? afterBucket.substring(0, queryIndex) : afterBucket;
            return decodeURIComponent(path);
        }
    }
    // URL but not recognized as a Storage URL for this bucket
    // Returning '' avoids accidentally treating arbitrary external URLs as Storage paths.
    return '';
}
function getPublicUrl(bucket, path) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
    if (!supabase) return '';
    const normalizedPath = normalizeStoragePath(path, bucket);
    if (!normalizedPath) return '';
    const { data } = supabase.storage.from(bucket).getPublicUrl(normalizedPath);
    return data?.publicUrl || '';
}
async function getSignedUrl(bucket, path, ttlSeconds = 3600) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
    if (!supabase) return '';
    const normalizedPath = normalizeStoragePath(path, bucket);
    if (!normalizedPath) return '';
    // Check cache
    const cacheKey = `${bucket}:${normalizedPath}`;
    const cached = SIGNED_URL_CACHE.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.url;
    }
    try {
        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(normalizedPath, ttlSeconds);
        if (error) {
            if ("TURBOPACK compile-time truthy", 1) {
                // eslint-disable-next-line no-console
                console.error('[STORAGE] Failed to create signed URL:', {
                    bucket,
                    path: normalizedPath,
                    error: error.message,
                    code: error?.statusCode,
                    fullError: error
                });
            }
            return '';
        }
        if (data?.signedUrl) {
            // Cache signed URL
            SIGNED_URL_CACHE.set(cacheKey, {
                url: data.signedUrl,
                expiresAt: Date.now() + ttlSeconds * 1000
            });
            return data.signedUrl;
        }
    } catch (err) {
        if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line no-console
            console.error('[STORAGE] Error creating signed URL:', err);
        }
    }
    return '';
}
async function resolveStorageUrl(bucket, pathOrUrl, options) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
    if (!supabase) return '';
    // If it's an external URL (not a Supabase Storage URL), keep it as-is.
    // This keeps placeholders like https://placehold.co/... working.
    if (isProbablyUrl(pathOrUrl) && !pathOrUrl.includes('/storage/v1/object/') && !pathOrUrl.includes(`/${bucket}/`)) {
        return pathOrUrl;
    }
    const normalizedPath = normalizeStoragePath(pathOrUrl, bucket);
    if (!normalizedPath) return '';
    if (options?.preferSigned) {
        // Try signed first
        const signedUrl = await getSignedUrl(bucket, normalizedPath);
        if (signedUrl) return signedUrl;
        // Fallback to public
        return getPublicUrl(bucket, normalizedPath);
    }
    // Try public first (default for public buckets)
    const publicUrl = getPublicUrl(bucket, normalizedPath);
    if (publicUrl) {
        // For public buckets, public URL should work
        // But if bucket is private, we'll get 400/403 when loading, so we could test here
        // For now, return public URL and let UI handle errors
        return publicUrl;
    }
    // Fallback to signed
    return getSignedUrl(bucket, normalizedPath);
}
function clearStorageUrlCache(bucket, path) {
    if (bucket && path) {
        const cacheKey = `${bucket}:${normalizeStoragePath(path, bucket)}`;
        SIGNED_URL_CACHE.delete(cacheKey);
    } else {
        SIGNED_URL_CACHE.clear();
    }
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/adsRepo.supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Supabase implementation: ads + ad_images tables + Storage.
 * Requires migrations 20250114000000 (profiles) and 20250214000000 (ads, ad_images).
 */ __turbopack_context__.s([
    "adsRepoSupabase",
    ()=>adsRepoSupabase,
    "deleteAdImage",
    ()=>deleteAdImage,
    "deleteAllAdImages",
    ()=>deleteAllAdImages,
    "insertAdImages",
    ()=>insertAdImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storageHelpers.ts [app-ssr] (ecmascript)");
;
;
;
;
const BUCKET = 'ad-images';
function rowToAd(row, imagePaths, ownerName) {
    const sorted = [
        ...imagePaths
    ].sort((a, b)=>a.sort_order - b.sort_order);
    // Normalize paths and get URLs (handles both paths and full URLs from DB)
    // Note: We return public URLs here for immediate render, but UI should use useStorageImage hook for async resolution
    const images = sorted.map((i)=>{
        const normalizedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(i.path, BUCKET);
        return normalizedPath ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPublicUrl"])(BUCKET, normalizedPath) : '';
    });
    return {
        id: row.id,
        userId: row.owner_id,
        userName: ownerName,
        type: row.type,
        status: row.status,
        title: row.title,
        description: row.description,
        price: row.price_mzn != null ? Number(row.price_mzn) : null,
        priceOnRequest: row.price_note != null && row.price_note.length > 0,
        location: row.city,
        province: row.province,
        neighborhood: row.neighborhood ?? undefined,
        categoryId: row.category,
        whatsapp: row.whatsapp,
        images,
        likes: 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}
async function fetchImagesForAds(supabase, adIds) {
    if (adIds.length === 0) return new Map();
    try {
        const { data, error } = await supabase.from('ad_images').select('ad_id, path, sort_order').in('ad_id', adIds).order('sort_order', {
            ascending: true
        });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][adsRepo.fetchImagesForAds]', error);
            // Don't throw - return empty map to allow app to continue
            return new Map();
        }
        const map = new Map();
        for (const r of data ?? []){
            const list = map.get(r.ad_id) ?? [];
            list.push({
                path: r.path,
                sort_order: r.sort_order
            });
            map.set(r.ad_id, list);
        }
        return map;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.fetchImagesForAds] unexpected error:', err);
        // Return empty map instead of throwing
        return new Map();
    }
}
const adsRepoSupabase = {
    async list (filters) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return [];
        let query = supabase.from('ads').select('*').order('updated_at', {
            ascending: false
        });
        if (filters?.userId) query = query.eq('owner_id', filters.userId);
        if (filters?.status !== undefined) query = query.eq('status', filters.status);
        const { data, error } = await query;
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][adsRepo.list]', error);
            // Check for RLS recursion error (42P17) - don't crash
            if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('infinite')) {
                // eslint-disable-next-line no-console
                console.error('[DB] RLS recursion detected (42P17) in adsRepo.list - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
                return [];
            }
            // Don't throw - return empty array to allow app to continue
            if (error.code === 'PGRST116' || error.message?.includes('policy')) return [];
            // eslint-disable-next-line no-console
            console.warn('[DB] adsRepo.list error (non-fatal):', error.message);
            return [];
        }
        const rows = data ?? [];
        const adIds = rows.map((r)=>r.id);
        const imagesMap = await fetchImagesForAds(supabase, adIds);
        return rows.map((r)=>{
            const images = imagesMap.get(r.id) ?? [];
            return rowToAd(r, images, undefined);
        });
    },
    async getById (id) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const { data: adData, error: adError } = await supabase.from('ads').select('*').eq('id', id).single();
        if (adError || !adData) {
            if (adError) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][adsRepo.getById]', adError);
            }
            return null;
        }
        const { data: imgData, error: imgError } = await supabase.from('ad_images').select('path, sort_order').eq('ad_id', id).order('sort_order', {
            ascending: true
        });
        if (imgError) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][adsRepo.getById images]', imgError);
            // Don't throw - continue with empty images array
            // eslint-disable-next-line no-console
            console.warn('[DB] adsRepo.getById images error (non-fatal):', imgError.message);
        }
        const row = adData;
        const images = imgData ?? [];
        try {
            return rowToAd(row, images, undefined);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][adsRepo.getById rowToAd]', err);
            return null;
        }
    },
    async create (data, options) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, 'Supabase not configured');
        const bypassLimit = options?.bypassLimit === true;
        if (!bypassLimit && data.userId) {
            const { data: existing, error: existingError } = await supabase.from('ads').select('id, type').eq('owner_id', data.userId);
            if (existingError) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][adsRepo.create existing]', existingError);
                throw existingError;
            }
            const list = existing ?? [];
            const countProduct = list.filter((r)=>r.type === 'product').length;
            const countService = list.filter((r)=>r.type === 'service').length;
            if (data.type === 'product' && countProduct >= __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIMITS"].MAX_PRODUCTS) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].LIMIT_REACHED, 'Limite de 10 produtos atingido.');
            }
            if (data.type === 'service' && countService >= __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIMITS"].MAX_SERVICES) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].LIMIT_REACHED, 'Limite de 5 serviços atingido.');
            }
        }
        const province = data.province ?? '';
        const row = {
            owner_id: data.userId,
            type: data.type,
            status: data.status ?? 'published',
            title: data.title,
            description: data.description,
            price_mzn: data.price != null ? data.price : null,
            price_note: data.priceOnRequest ? 'Sob consulta' : null,
            province,
            city: data.location,
            neighborhood: data.neighborhood ?? null,
            category: data.categoryId,
            whatsapp: data.whatsapp
        };
        const { data: inserted, error } = await supabase.from('ads').insert(row).select().single();
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][adsRepo.create]', error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, error.message);
        }
        const adRow = inserted;
        return rowToAd(adRow, [], data.userName);
    },
    async update (id, data) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const updates = {
            updated_at: new Date().toISOString()
        };
        if (data.title != null) updates.title = data.title;
        if (data.description != null) updates.description = data.description;
        if (data.price != null) updates.price_mzn = data.price;
        if (data.price === null) updates.price_mzn = null;
        if (data.priceOnRequest != null) updates.price_note = data.priceOnRequest ? 'Sob consulta' : null;
        if (data.province != null) updates.province = data.province;
        if (data.location != null) updates.city = data.location;
        if (data.neighborhood !== undefined) updates.neighborhood = data.neighborhood || null;
        if (data.categoryId != null) updates.category = data.categoryId;
        if (data.whatsapp != null) updates.whatsapp = data.whatsapp;
        if (data.type != null) updates.type = data.type;
        if (data.status != null) updates.status = data.status;
        const { data: updated, error } = await supabase.from('ads').update(updates).eq('id', id).select().single();
        if (error || !updated) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][adsRepo.update]', error);
            }
            return null;
        }
        const existing = await this.getById(id);
        return existing;
    },
    async delete (id) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return false;
        const { error } = await supabase.from('ads').delete().eq('id', id);
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][adsRepo.delete]', error);
            throw error;
        }
        return true;
    }
};
async function insertAdImages(adId, paths) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
    if (!supabase) return;
    if (paths.length === 0) return;
    // CRITICAL: Normalize all paths before inserting to DB (ensure no URLs)
    const rows = paths.map((p)=>{
        const normalizedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(p.path, BUCKET);
        if (!normalizedPath) {
            if ("TURBOPACK compile-time truthy", 1) {
                // eslint-disable-next-line no-console
                console.warn('[UPLOAD] Skipping invalid path in insertAdImages:', p.path);
            }
            return null;
        }
        return {
            ad_id: adId,
            path: normalizedPath,
            sort_order: p.sort_order
        };
    }).filter((r)=>r !== null);
    if (rows.length === 0) return;
    const { error } = await supabase.from('ad_images').insert(rows);
    if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.insertAdImages]', error);
        throw error;
    }
}
async function deleteAdImage(adId, path) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
    if (!supabase) return;
    const normalizedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(path, BUCKET);
    if (!normalizedPath) {
        if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line no-console
            console.warn('[UPLOAD] Invalid path in deleteAdImage:', path);
        }
        return;
    }
    // Delete from DB (match by normalized path or original path for compatibility)
    const { error } = await supabase.from('ad_images').delete().eq('ad_id', adId).or(`path.eq.${normalizedPath},path.eq.${path}`);
    if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.deleteAdImage rows]', error);
        throw error;
    }
    // Remove from storage (don't fail if file doesn't exist)
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([
        normalizedPath
    ]);
    if (storageError && ("TURBOPACK compile-time value", "development") === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[UPLOAD] Failed to remove image from storage (non-fatal):', {
            path: normalizedPath,
            error: storageError.message
        });
    // Don't throw - file might already be deleted
    }
}
async function deleteAllAdImages(adId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
    if (!supabase) return;
    const { data: rows, error } = await supabase.from('ad_images').select('path').eq('ad_id', adId);
    if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.deleteAllAdImages select]', error);
        throw error;
    }
    // Normalize all paths before removing from storage
    const paths = (rows ?? []).map((r)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(r.path, BUCKET)).filter((p)=>!!p);
    const { error: delError } = await supabase.from('ad_images').delete().eq('ad_id', adId);
    if (delError) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.deleteAllAdImages delete]', delError);
        throw delError;
    }
    // Remove from storage (don't fail if files don't exist)
    if (paths.length > 0) {
        const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
        if (storageError && ("TURBOPACK compile-time value", "development") === 'development') {
            // eslint-disable-next-line no-console
            console.warn('[UPLOAD] Failed to remove some images from storage (non-fatal):', {
                paths,
                error: storageError.message
            });
        // Don't throw - files might already be deleted
        }
    }
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getAdsRepo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdsRepo",
    ()=>getAdsRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$adsRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/adsRepo.local.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$adsRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/adsRepo.supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
function getAdsRepo() {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"]) {
        // eslint-disable-next-line no-console
        console.log('[REPO] Using Supabase ads repo');
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$adsRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adsRepoSupabase"];
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$adsRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adsRepo"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/categoriesRepo.local.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoriesRepo",
    ()=>categoriesRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storage.ts [app-ssr] (ecmascript)");
;
const categoriesRepo = {
    async list () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getCategories();
    },
    async create (data) {
        const category = {
            ...data,
            id: crypto.randomUUID()
        };
        const categories = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getCategories();
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setCategories([
            ...categories,
            category
        ]);
        return category;
    },
    async update (id, data) {
        const categories = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getCategories();
        const index = categories.findIndex((c)=>c.id === id);
        if (index === -1) return null;
        const updated = {
            ...categories[index],
            ...data
        };
        const next = [
            ...categories
        ];
        next[index] = updated;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setCategories(next);
        return updated;
    },
    async delete (id) {
        const categories = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getCategories();
        const next = categories.filter((c)=>c.id !== id);
        if (next.length === categories.length) return false;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setCategories(next);
        return true;
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/categoriesRepo.supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoriesRepoSupabase",
    ()=>categoriesRepoSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
;
;
function rowToCategory(row) {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        icon: row.icon ?? undefined
    };
}
const categoriesRepoSupabase = {
    async list () {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from('categories').select('*').order('name', {
            ascending: true
        });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][categoriesRepo.list]', error);
            // Check for RLS recursion error (42P17) - don't crash
            if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('infinite')) {
                // eslint-disable-next-line no-console
                console.error('[DB] RLS recursion detected (42P17) in categoriesRepo.list - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
                return [];
            }
            // Don't throw - return empty array to allow app to continue
            if (error.code === 'PGRST116') return [];
            // eslint-disable-next-line no-console
            console.warn('[DB] categoriesRepo.list error (non-fatal):', error.message);
            return [];
        }
        return (data ?? []).map((r)=>rowToCategory(r));
    },
    async create (data) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, 'Supabase not configured');
        const row = {
            name: data.name,
            slug: data.slug,
            icon: data.icon ?? null
        };
        const { data: inserted, error } = await supabase.from('categories').insert(row).select().single();
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][categoriesRepo.create]', error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, error.message);
        }
        return rowToCategory(inserted);
    },
    async update (id, data) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const updates = {};
        if (data.name != null) updates.name = data.name;
        if (data.slug != null) updates.slug = data.slug;
        if (data.icon !== undefined) updates.icon = data.icon ?? null;
        const { data: updated, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
        if (error || !updated) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][categoriesRepo.update]', error);
            }
            return null;
        }
        return rowToCategory(updated);
    },
    async delete (id) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return false;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][categoriesRepo.delete]', error);
            throw error;
        }
        return true;
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getCategoriesRepo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCategoriesRepo",
    ()=>getCategoriesRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$categoriesRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/categoriesRepo.local.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$categoriesRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/categoriesRepo.supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
function getCategoriesRepo() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$categoriesRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categoriesRepoSupabase"] : __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$categoriesRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categoriesRepo"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/bannersRepo.local.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bannersRepo",
    ()=>bannersRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storage.ts [app-ssr] (ecmascript)");
;
const bannersRepo = {
    async listPublic () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getBanners().filter((b)=>b.active).sort((a, b)=>a.order - b.order);
    },
    async listAll () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getBanners().sort((a, b)=>a.order - b.order);
    },
    async getById (id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getBanners().find((b)=>b.id === id) ?? null;
    },
    async create (data) {
        const now = new Date().toISOString();
        const banner = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: now
        };
        const banners = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getBanners();
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setBanners([
            ...banners,
            banner
        ]);
        return banner;
    },
    async update (id, data) {
        const banners = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getBanners();
        const index = banners.findIndex((b)=>b.id === id);
        if (index === -1) return null;
        const updated = {
            ...banners[index],
            ...data
        };
        const next = [
            ...banners
        ];
        next[index] = updated;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setBanners(next);
        return updated;
    },
    async delete (id) {
        const banners = __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].getBanners();
        const next = banners.filter((b)=>b.id !== id);
        if (next.length === banners.length) return false;
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storage"].setBanners(next);
        return true;
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/imageCompression.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compressImage",
    ()=>compressImage,
    "dataUrlToBlob",
    ()=>dataUrlToBlob
]);
/**
 * Client-side image compression for ad uploads.
 * Resize max width 1280px, compress quality ~0.8.
 * Returns base64 data URL. Ready to swap for Supabase Storage upload (TODO).
 */ const MAX_WIDTH = 1280;
const QUALITY = 0.8;
async function compressImage(file) {
    return new Promise((resolve, reject)=>{
        const img = document.createElement('img');
        const url = URL.createObjectURL(file);
        img.onload = ()=>{
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            if (width > MAX_WIDTH) {
                height = Math.round(height * MAX_WIDTH / width);
                width = MAX_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas not available'));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            try {
                const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
                resolve(dataUrl);
            } catch  {
                reject(new Error('Failed to compress'));
            }
        };
        img.onerror = ()=>{
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
}
function dataUrlToBlob(dataUrl) {
    const [header, base64] = dataUrl.split(',');
    const mime = header?.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
    const bin = atob(base64 ?? '');
    const arr = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++)arr[i] = bin.charCodeAt(i);
    return new Blob([
        arr
    ], {
        type: mime
    });
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/bannersRepo.supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BANNERS_BUCKET",
    ()=>BANNERS_BUCKET,
    "bannersRepoSupabase",
    ()=>bannersRepoSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$imageCompression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/imageCompression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/storageHelpers.ts [app-ssr] (ecmascript)");
;
;
;
;
// ── Helpers de MIME ──────────────────────────────────────────────────────────
/** Extrai o mime type de um data URL. Ex: 'data:image/png;base64,...' → 'image/png'. */ function detectDataUrlMime(dataUrl) {
    const match = dataUrl.match(/^data:([a-z]+\/[a-z+.-]+);/i);
    return match?.[1]?.toLowerCase() ?? 'image/jpeg';
}
/** Mapeia mime type para extensão de ficheiro. */ function mimeToExt(mime) {
    const map = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/svg+xml': 'svg'
    };
    return map[mime] ?? 'jpg';
}
const BANNERS_BUCKET = 'banner-images';
function rowToBanner(row) {
    // Normalize path and get URL (handles both paths and full URLs from DB)
    const normalizedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(row.image_path, BANNERS_BUCKET);
    const imageUrl = normalizedPath ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPublicUrl"])(BANNERS_BUCKET, normalizedPath) : '';
    return {
        id: row.id,
        title: row.title,
        imageUrl,
        link: row.link ?? undefined,
        active: row.active,
        order: row.sort_order,
        createdAt: row.created_at
    };
}
const bannersRepoSupabase = {
    async listPublic () {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from('banners').select('*').eq('active', true).order('sort_order', {
            ascending: true
        });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][bannersRepo.listPublic]', error);
            return [];
        }
        return (data ?? []).map((r)=>rowToBanner(r));
    },
    async listAll () {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from('banners').select('*').order('sort_order', {
            ascending: true
        });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][bannersRepo.listAll]', error);
            return [];
        }
        return (data ?? []).map((r)=>rowToBanner(r));
    },
    async getById (id) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const { data, error } = await supabase.from('banners').select('*').eq('id', id).single();
        if (error || !data) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][bannersRepo.getById]', error);
            }
            return null;
        }
        return rowToBanner(data);
    },
    async create (data) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, 'Supabase not configured');
        const id = crypto.randomUUID();
        let imagePath;
        if (data.imageUrl.startsWith('data:')) {
            const blob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$imageCompression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dataUrlToBlob"])(data.imageUrl);
            // Detectar contentType real do dataUrl para não forçar sempre jpeg
            const contentType = detectDataUrlMime(data.imageUrl);
            const ext = mimeToExt(contentType);
            imagePath = `banners/${id}/${crypto.randomUUID()}.${ext}`;
            // Verificar se o bucket existe antes de tentar upload.
            const { error: listError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withTimeout"])(supabase.storage.from(BANNERS_BUCKET).list('', {
                limit: 1
            }), 12_000, 'Verificação do bucket de banners');
            if (listError) {
                const status = listError.status;
                const message = listError.message;
                const isMissing = status === 404 || message && message.toLowerCase().includes('bucket') && message.toLowerCase().includes('not found');
                if (isMissing) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].STORAGE_BUCKET_MISSING, `Bucket '${BANNERS_BUCKET}' não existe no Supabase. Crie o bucket no dashboard ou ajuste o nome na configuração.`, listError);
                }
            }
            const { error: uploadError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withTimeout"])(supabase.storage.from(BANNERS_BUCKET).upload(imagePath, blob, {
                contentType,
                upsert: false
            }), 12_000, 'Upload do banner');
            if (uploadError) {
                if ("TURBOPACK compile-time truthy", 1) {
                    // eslint-disable-next-line no-console
                    console.error('[UPLOAD] Error uploading banner:', {
                        bucket: BANNERS_BUCKET,
                        path: imagePath,
                        size: blob.size,
                        contentType: 'image/jpeg',
                        error: uploadError.message,
                        statusCode: uploadError?.statusCode ?? uploadError?.status,
                        fullError: uploadError
                    });
                }
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, `Erro ao fazer upload do banner: ${uploadError.message}`, uploadError);
            }
            if ("TURBOPACK compile-time truthy", 1) {
                // eslint-disable-next-line no-console
                console.log('[UPLOAD] Banner uploaded successfully:', {
                    bucket: BANNERS_BUCKET,
                    path: imagePath,
                    size: blob.size,
                    ok: true
                });
            }
        } else {
            // If it's not a data URL, it might be a full URL or existing path
            // Normalize it to ensure we store only the path
            imagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(data.imageUrl, BANNERS_BUCKET);
            if (!imagePath) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, 'URL ou path de imagem inválido para banner.');
            }
        }
        const row = {
            id,
            title: data.title ?? '',
            image_path: imagePath,
            link: data.link ?? null,
            active: data.active ?? true,
            sort_order: data.order ?? 0
        };
        const { data: inserted, error } = await supabase.from('banners').insert(row).select().single();
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][bannersRepo.create]', error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, error.message);
        }
        return rowToBanner(inserted);
    },
    async update (id, data) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const existing = await this.getById(id);
        if (!existing) return null;
        const updates = {};
        if (data.title != null) updates.title = data.title;
        if (data.link !== undefined) updates.link = data.link ?? null;
        if (data.active != null) updates.active = data.active;
        if (data.order != null) updates.sort_order = data.order;
        if (data.imageUrl != null) {
            if (data.imageUrl.startsWith('data:')) {
                // New image upload
                const { data: row, error: selectError } = await supabase.from('banners').select('image_path').eq('id', id).single();
                if (selectError) {
                    // eslint-disable-next-line no-console
                    console.error('[SUPABASE ERROR][bannersRepo.update select image_path]', selectError);
                    throw selectError;
                }
                const oldPath = row?.image_path;
                const blob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$imageCompression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dataUrlToBlob"])(data.imageUrl);
                // Detectar contentType real do dataUrl
                const contentType = detectDataUrlMime(data.imageUrl);
                const ext = mimeToExt(contentType);
                const newPath = `banners/${id}/${crypto.randomUUID()}.${ext}`;
                const { error: uploadError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withTimeout"])(supabase.storage.from(BANNERS_BUCKET).upload(newPath, blob, {
                    contentType,
                    upsert: false
                }), 12_000, 'Upload do banner');
                if (uploadError) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        // eslint-disable-next-line no-console
                        console.error('[UPLOAD] Error uploading banner:', {
                            bucket: BANNERS_BUCKET,
                            path: newPath,
                            size: blob.size,
                            contentType: 'image/jpeg',
                            error: uploadError.message,
                            statusCode: uploadError?.statusCode ?? uploadError?.status,
                            fullError: uploadError
                        });
                    }
                    throw uploadError;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    // eslint-disable-next-line no-console
                    console.log('[UPLOAD] Banner uploaded successfully:', {
                        bucket: BANNERS_BUCKET,
                        path: newPath,
                        size: blob.size,
                        ok: true
                    });
                }
                updates.image_path = newPath;
                // Remove old file (don't fail if it doesn't exist)
                if (oldPath) {
                    const normalizedOldPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(oldPath, BANNERS_BUCKET);
                    if (normalizedOldPath) {
                        const { error: removeError } = await supabase.storage.from(BANNERS_BUCKET).remove([
                            normalizedOldPath
                        ]);
                        if (removeError && ("TURBOPACK compile-time value", "development") === 'development') {
                            // eslint-disable-next-line no-console
                            console.warn('[UPLOAD] Failed to remove old banner file (non-fatal):', {
                                path: normalizedOldPath,
                                error: removeError.message
                            });
                        }
                    }
                }
            } else {
                // URL or path provided - normalize to path only
                const normalizedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(data.imageUrl, BANNERS_BUCKET);
                if (normalizedPath) {
                    updates.image_path = normalizedPath;
                }
            }
        }
        const { data: updated, error } = await supabase.from('banners').update(updates).eq('id', id).select().single();
        if (error || !updated) {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[SUPABASE ERROR][bannersRepo.update]', error);
            }
            return null;
        }
        return rowToBanner(updated);
    },
    async delete (id) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return false;
        const { data: row, error: selectError } = await supabase.from('banners').select('image_path').eq('id', id).single();
        if (selectError) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][bannersRepo.delete select image_path]', selectError);
            throw selectError;
        }
        const path = row?.image_path;
        const { error: delError } = await supabase.from('banners').delete().eq('id', id);
        if (delError) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][bannersRepo.delete delete]', delError);
            throw delError;
        }
        if (path) {
            const normalizedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$storageHelpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeStoragePath"])(path, BANNERS_BUCKET);
            if (normalizedPath) {
                const { error: removeError } = await supabase.storage.from(BANNERS_BUCKET).remove([
                    normalizedPath
                ]);
                if (removeError && ("TURBOPACK compile-time value", "development") === 'development') {
                    // eslint-disable-next-line no-console
                    console.warn('[SUPABASE ERROR][bannersRepo.delete remove] (non-fatal):', {
                        path: normalizedPath,
                        error: removeError.message
                    });
                // Don't throw - file might already be deleted
                }
            }
        }
        return true;
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getBannersRepo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBannersRepo",
    ()=>getBannersRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$bannersRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/bannersRepo.local.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$bannersRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/bannersRepo.supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
function getBannersRepo() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$bannersRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bannersRepoSupabase"] : __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$bannersRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bannersRepo"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/settingsRepo.local.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "settingsRepo",
    ()=>settingsRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/constants.ts [app-ssr] (ecmascript)");
;
const FALLBACK_PUBLIC = {
    admin_whatsapp: {
        number: __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTACT_INFO"].WHATSAPP_RAW
    },
    activation_fee_mzn: {
        amount: __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIMITS"].ACTIVATION_FEE_MT
    }
};
const settingsRepo = {
    async get (key) {
        return FALLBACK_PUBLIC[key] ?? null;
    },
    async listPublic () {
        return {
            ...FALLBACK_PUBLIC
        };
    },
    async update () {
    // Local mode: no-op; settings are constants
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/settingsRepo.supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "settingsRepoSupabase",
    ()=>settingsRepoSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/errors.ts [app-ssr] (ecmascript)");
;
;
const PUBLIC_KEYS = [
    'admin_whatsapp',
    'activation_fee_mzn',
    'support_email'
];
const settingsRepoSupabase = {
    async get (key) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return null;
        const { data, error } = await supabase.from('admin_settings').select('value').eq('key', key).maybeSingle();
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][settingsRepo.get]', error);
            return null;
        }
        return data?.value ?? null;
    },
    async listPublic () {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) return {};
        const { data, error } = await supabase.from('admin_settings').select('key, value').in('key', [
            ...PUBLIC_KEYS
        ]);
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][settingsRepo.listPublic]', error);
            return {};
        }
        const out = {};
        for (const row of data ?? []){
            const r = row;
            out[r.key] = r.value;
        }
        return out;
    },
    async update (key, value) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
        if (!supabase) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, 'Supabase not configured');
        const { error } = await supabase.from('admin_settings').upsert({
            key,
            value,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'key'
        });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][settingsRepo.update]', error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$errors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNAUTHORIZED, error.message);
        }
    }
};
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getSettingsRepo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSettingsRepo",
    ()=>getSettingsRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$settingsRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/local/settingsRepo.local.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$settingsRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/supabase/settingsRepo.supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
function getSettingsRepo() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"] ? __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$supabase$2f$settingsRepo$2e$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["settingsRepoSupabase"] : __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$local$2f$settingsRepo$2e$local$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["settingsRepo"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/AppContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "getAdImage",
    ()=>getAdImage,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Estado global do CeluPublic: ads, categorias, banners, likes.
 * Em modo backend real, tudo vem de Supabase via repositórios.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cachedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/cachedData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getUsersRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getUsersRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getAdsRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getAdsRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getLikesRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getLikesRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getCategoriesRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getCategoriesRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getBannersRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getBannersRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getSettingsRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/repositories/getSettingsRepo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
const defaultState = {
    ads: [],
    categories: [],
    banners: [],
    users: [],
    likedIds: {},
    publicSettings: {},
    loading: {
        ads: false,
        categories: false,
        banners: false,
        users: false,
        settings: false
    },
    errors: {
        ads: null,
        categories: null,
        banners: null,
        users: null,
        settings: null
    }
};
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AppProvider({ children }) {
    const [ads, setAdsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.ads);
    const [categories, setCategoriesState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.categories);
    const [banners, setBannersState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.banners);
    const [users, setUsersState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.users);
    const [likedIds, setLikedIdsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.likedIds);
    const [publicSettings, setPublicSettingsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.publicSettings);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.loading);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultState.errors);
    const setAds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updater)=>{
        setAdsState((prev)=>{
            const next = typeof updater === 'function' ? updater(prev) : updater;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cachedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidatePublicAdsCache"])();
            return next;
        });
    }, []);
    const setCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updater)=>{
        setCategoriesState((prev)=>{
            const next = typeof updater === 'function' ? updater(prev) : updater;
            return next;
        });
    }, []);
    const setBanners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updater)=>{
        setBannersState((prev)=>{
            const next = typeof updater === 'function' ? updater(prev) : updater;
            return next;
        });
    }, []);
    const setUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updater)=>{
        setUsersState((prev)=>{
            const next = typeof updater === 'function' ? updater(prev) : updater;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cachedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidatePublicAdsCache"])();
            return next;
        });
    }, []);
    const refreshUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading((prev)=>({
                ...prev,
                users: true
            }));
        setErrors((prev)=>({
                ...prev,
                users: null
            }));
        try {
            const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getUsersRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUsersRepo"])().list();
            setUsersState(list);
            setLoading((prev)=>({
                    ...prev,
                    users: false
                }));
            // eslint-disable-next-line no-console
            console.log('[DB] Loaded users:', list.length);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[DB] Failed to load users', err);
            setLoading((prev)=>({
                    ...prev,
                    users: false
                }));
            // Check for RLS recursion error (42P17) - don't crash the app
            if (err?.code === '42P17' || err?.message?.includes('recursion') || err?.message?.includes('infinite')) {
                // eslint-disable-next-line no-console
                console.error('[DB] RLS recursion detected (42P17) - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
                setErrors((prev)=>({
                        ...prev,
                        users: 'Erro de configuração do banco de dados. Contacte o suporte.'
                    }));
            } else {
                setErrors((prev)=>({
                        ...prev,
                        users: 'Não foi possível carregar utilizadores.'
                    }));
            }
        // Don't throw - allow app to continue rendering
        }
    }, []);
    const refreshAds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading((prev)=>({
                ...prev,
                ads: true
            }));
        setErrors((prev)=>({
                ...prev,
                ads: null
            }));
        try {
            const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getAdsRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAdsRepo"])().list();
            setAdsState(list);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$cachedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invalidatePublicAdsCache"])();
            setLoading((prev)=>({
                    ...prev,
                    ads: false
                }));
            // eslint-disable-next-line no-console
            console.log('[DB] Loaded ads:', list.length);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[DB] Failed to load ads', err);
            setLoading((prev)=>({
                    ...prev,
                    ads: false
                }));
            // Check for RLS recursion error (42P17) - don't crash the app
            if (err?.code === '42P17' || err?.message?.includes('recursion') || err?.message?.includes('infinite')) {
                // eslint-disable-next-line no-console
                console.error('[DB] RLS recursion detected (42P17) - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
                setErrors((prev)=>({
                        ...prev,
                        ads: 'Erro de configuração do banco de dados. Contacte o suporte.'
                    }));
            } else {
                setErrors((prev)=>({
                        ...prev,
                        ads: 'Não foi possível carregar anúncios.'
                    }));
            }
        // Don't throw - allow app to continue rendering
        }
    }, []);
    const refreshCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading((prev)=>({
                ...prev,
                categories: true
            }));
        setErrors((prev)=>({
                ...prev,
                categories: null
            }));
        try {
            const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getCategoriesRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCategoriesRepo"])().list();
            setCategoriesState(list);
            setLoading((prev)=>({
                    ...prev,
                    categories: false
                }));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[DB] Failed to load categories', err);
            setLoading((prev)=>({
                    ...prev,
                    categories: false
                }));
            if (err?.code === '42P17' || err?.message?.includes('recursion') || err?.message?.includes('infinite')) {
                setErrors((prev)=>({
                        ...prev,
                        categories: 'Erro de configuração do banco de dados.'
                    }));
            } else {
                setErrors((prev)=>({
                        ...prev,
                        categories: 'Não foi possível carregar categorias.'
                    }));
            }
        }
    }, []);
    const refreshBanners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading((prev)=>({
                ...prev,
                banners: true
            }));
        setErrors((prev)=>({
                ...prev,
                banners: null
            }));
        try {
            const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getBannersRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBannersRepo"])().listPublic();
            setBannersState(list);
            setLoading((prev)=>({
                    ...prev,
                    banners: false
                }));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[DB] Failed to load banners', err);
            setLoading((prev)=>({
                    ...prev,
                    banners: false
                }));
            setErrors((prev)=>({
                    ...prev,
                    banners: 'Não foi possível carregar banners.'
                }));
        }
    }, []);
    const refreshSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading((prev)=>({
                ...prev,
                settings: true
            }));
        setErrors((prev)=>({
                ...prev,
                settings: null
            }));
        try {
            const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getSettingsRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSettingsRepo"])().listPublic();
            setPublicSettingsState(settings);
            setLoading((prev)=>({
                    ...prev,
                    settings: false
                }));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[DB] Failed to load settings', err);
            setLoading((prev)=>({
                    ...prev,
                    settings: false
                }));
            setErrors((prev)=>({
                    ...prev,
                    settings: 'Não foi possível carregar configurações.'
                }));
        }
    }, []);
    // Carregamento inicial de todos os dados a partir dos repositórios (Supabase/local consoante implementação).
    // SAFE BOOT: Never throw errors, always render with fallback states
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Public data (categories, banners, settings) can be loaded immediately
        // These are safe to load without session and should not crash
        void refreshCategories();
        void refreshBanners();
        void refreshSettings();
        // Users and ads: load carefully, but don't wait for auth
        // If Supabase is enabled, try to load (public data should be accessible via RLS)
        // If it fails, state will show error but app continues rendering
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"]) {
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabase"])();
            if (supabase) {
                // Try to get session, but don't wait - load data anyway (public data)
                supabase.auth.getSession().then(()=>{
                    // Load users and ads (public data should be accessible)
                    void refreshUsers();
                    void refreshAds();
                }).catch((err)=>{
                    // eslint-disable-next-line no-console
                    console.warn('[DB] getSession failed, loading data anyway:', err);
                    // Still try to load (might be public data accessible without session)
                    void refreshUsers();
                    void refreshAds();
                });
            } else {
                // No supabase client - skip loading (will use empty arrays)
                // eslint-disable-next-line no-console
                console.warn('[DB] Supabase client not available, skipping data load');
            }
        } else {
            // Local mode - load everything
            void refreshUsers();
            void refreshAds();
        }
    }, [
        refreshUsers,
        refreshAds,
        refreshCategories,
        refreshBanners,
        refreshSettings,
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"]
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (users.length > 0) {
            const usersRepo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getUsersRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUsersRepo"])();
            const currentId = usersRepo.getCurrentUserId?.();
            // Carregamos likes do utilizador autenticado, se houver.
            if (currentId) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$repositories$2f$getLikesRepo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLikesRepo"])().getUserLikes(currentId).then((ids)=>{
                    const map = {};
                    for (const id of ids)map[id] = true;
                    setLikedIdsState(map);
                }).catch((err)=>{
                    // eslint-disable-next-line no-console
                    console.error('[DB] Failed to load user likes', err);
                    // Don't crash - just set empty likes
                    setLikedIdsState({});
                });
            } else {
                setLikedIdsState({});
            }
        }
    }, [
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"],
        users
    ]);
    const toggleLike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((adId)=>{
        const wasLiked = likedIds[adId];
        setLikedIdsState((prev)=>{
            const next = {
                ...prev,
                [adId]: !prev[adId]
            };
            return next;
        });
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"]) {
            setAdsState((prev)=>{
                const ad = prev.find((a)=>a.id === adId);
                if (!ad) return prev;
                const delta = wasLiked ? -1 : 1;
                const next = prev.map((a)=>a.id === adId ? {
                        ...a,
                        likes: Math.max(0, a.likes + delta)
                    } : a);
                return next;
            });
        }
    }, [
        likedIds,
        __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupabase"]
    ]);
    const getAdById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>ads.find((a)=>a.id === id), [
        ads
    ]);
    const getCategoryById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>categories.find((c)=>c.id === id), [
        categories
    ]);
    const getAdsByUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((userId)=>ads.filter((a)=>a.userId === userId), [
        ads
    ]);
    const getPublishedAds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>ads.filter((a)=>a.status === 'published').sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()), [
        ads
    ]);
    const getFeaturedAds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const published = ads.filter((a)=>a.status === 'published');
        return [
            ...published
        ].sort((a, b)=>b.likes - a.likes).slice(0, 8);
    }, [
        ads
    ]);
    const getTopRankedAds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const published = ads.filter((a)=>a.status === 'published');
        return [
            ...published
        ].sort((a, b)=>b.likes - a.likes).slice(0, 8);
    }, [
        ads
    ]);
    const getAdsByCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((categoryId)=>ads.filter((a)=>a.status === 'published' && a.categoryId === categoryId), [
        ads
    ]);
    const getRelatedAds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((ad, limit = 4)=>ads.filter((a)=>a.status === 'published' && a.id !== ad.id && (a.categoryId === ad.categoryId || a.type === ad.type)).sort((a, b)=>b.likes - a.likes).slice(0, limit), [
        ads
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            ads,
            categories,
            banners,
            users,
            likedIds,
            publicSettings,
            loading,
            errors,
            setAds,
            setCategories,
            setBanners,
            setUsers,
            refreshUsers,
            refreshAds,
            refreshCategories,
            refreshBanners,
            refreshSettings,
            toggleLike,
            getAdById,
            getCategoryById,
            getAdsByUser,
            getPublishedAds,
            getFeaturedAds,
            getTopRankedAds,
            getAdsByCategory,
            getRelatedAds
        }), [
        ads,
        categories,
        banners,
        users,
        likedIds,
        publicSettings,
        loading,
        errors,
        setAds,
        setCategories,
        setBanners,
        setUsers,
        refreshUsers,
        refreshAds,
        refreshCategories,
        refreshBanners,
        refreshSettings,
        toggleLike,
        getAdById,
        getCategoryById,
        getAdsByUser,
        getPublishedAds,
        getFeaturedAds,
        getTopRankedAds,
        getAdsByCategory,
        getRelatedAds
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/AppContext.tsx",
        lineNumber: 425,
        columnNumber: 10
    }, this);
}
function useApp() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
function getAdImage(ad) {
    return ad.images?.[0] || __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLACEHOLDER_IMAGE"];
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
            'icon-sm': 'h-8 w-8',
            'icon-lg': 'h-12 w-12'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/button.tsx",
        lineNumber: 44,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = 'Button';
;
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/app-button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppButton",
    ()=>AppButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
/**
 * App-level button wrapper. Uses shadcn Button internally.
 * Standardizes primary/secondary styles across the app.
 */ const variantMap = {
    primary: 'default',
    default: 'default',
    secondary: 'secondary',
    outline: 'outline',
    ghost: 'ghost',
    destructive: 'destructive',
    link: 'link'
};
const AppButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ variant = 'primary', className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
        ref: ref,
        variant: variantMap[variant],
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/app-button.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
AppButton.displayName = 'AppButton';
;
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('rounded-xl border bg-card text-card-foreground shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = 'Card';
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col space-y-1.5 p-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = 'CardHeader';
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('font-semibold leading-none tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx",
        lineNumber: 35,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = 'CardTitle';
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm text-muted-foreground', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx",
        lineNumber: 47,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = 'CardDescription';
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx",
        lineNumber: 59,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = 'CardContent';
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx",
        lineNumber: 67,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = 'CardFooter';
;
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$app$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/app-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/card.tsx [app-ssr] (ecmascript)");
;
;
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function ToastProvider({ children }) {
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((toast)=>{
        const id = toast.id ?? crypto.randomUUID();
        const next = {
            ...toast,
            id,
            variant: toast.variant ?? 'info'
        };
        setToasts((prev)=>[
                ...prev,
                next
            ]);
        // Auto-dismiss após 5s.
        setTimeout(()=>{
            setToasts((prev)=>prev.filter((t)=>t.id !== id));
        }, 5000);
    }, []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            showToast
        }), [
        showToast
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: value,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-end px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex w-full max-w-sm flex-col gap-2",
                    children: toasts.map((toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            className: "pointer-events-auto border shadow-lg",
                            "data-variant": toast.variant,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex flex-col gap-2 py-3",
                                children: [
                                    toast.title ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium",
                                        children: toast.title
                                    }, void 0, false, {
                                        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                                        lineNumber: 62,
                                        columnNumber: 19
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: toast.description
                                    }, void 0, false, {
                                        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                                        lineNumber: 66,
                                        columnNumber: 17
                                    }, this),
                                    toast.actionLabel && toast.onAction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$app$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppButton"], {
                                            size: "sm",
                                            variant: toast.variant === 'error' ? 'destructive' : 'outline',
                                            onClick: toast.onAction,
                                            children: toast.actionLabel
                                        }, void 0, false, {
                                            fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                                            lineNumber: 69,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                                        lineNumber: 68,
                                        columnNumber: 19
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                                lineNumber: 60,
                                columnNumber: 15
                            }, this)
                        }, toast.id, false, {
                            fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
function useToast() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$providers$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/providers/AuthProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/AppContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/context/ToastContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$providers$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/providers.tsx",
                lineNumber: 11,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/providers.tsx",
            lineNumber: 10,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/providers.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2580e6d3._.js.map