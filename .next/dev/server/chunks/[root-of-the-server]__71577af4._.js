module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
function createAdminClient() {
    const supabaseUrl = ("TURBOPACK compile-time value", "https://wuppmtktghypzgbiyldj.supabase.co");
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('[ADMIN] Supabase URL or Service Role Key is missing. Check your environment variables.');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl || '', supabaseServiceKey || '', {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://wuppmtktghypzgbiyldj.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cHBtdGt0Z2h5cHpnYml5bGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDc2MjYsImV4cCI6MjA4NjY4MzYyNn0.FBeRMBEaP9mMgSkZEp5h6-Lk5p0iLp4ApQhy7EAB58Q"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/error.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Serializa erros Supabase/Postgrest para logs e respostas JSON.
 * Evita "{}" no console quando o objeto não é enumerável.
 */ __turbopack_context__.s([
    "serializeSupabaseError",
    ()=>serializeSupabaseError
]);
function serializeSupabaseError(err) {
    if (err == null) return {
        message: 'Unknown error'
    };
    const e = err;
    return {
        message: typeof e?.message === 'string' ? e.message : String(err),
        code: typeof e?.code === 'string' ? e.code : undefined,
        details: e?.details,
        hint: typeof e?.hint === 'string' ? e.hint : undefined,
        status: typeof e?.status === 'number' ? e.status : undefined,
        name: typeof e?.name === 'string' ? e.name : undefined
    };
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    WHATSAPP_LINK: 'https://wa.me/258878330517?text=Olá!%20Acabei%20de%20fazer%20o%20pagamento%20da%20taxa%20de%2020MT%20para%20ativação%20da%20minha%20conta.%20Pode%20ajudar-me?',
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
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/api/vendedor/anuncios/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
/**
 * GET e POST /api/vendedor/anuncios
 * GET: lista anúncios do owner autenticado (todos os status).
 * POST: publicar anúncio (ads + ad_images + storage upload).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/error.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/constants.ts [app-route] (ecmascript)");
;
;
;
;
;
const BUCKET = 'ad-images';
function buildPublicUrl(path) {
    const url = ("TURBOPACK compile-time value", "https://wuppmtktghypzgbiyldj.supabase.co");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const clean = path.replace(/^\/+|\/+$/g, '');
    return `${url}/storage/v1/object/public/${BUCKET}/${clean}`;
}
function rowToAd(r, images, userName) {
    return {
        id: r.id,
        userId: r.owner_id,
        userName: userName ?? undefined,
        type: r.type,
        status: r.status,
        title: r.title,
        description: r.description,
        price: r.price_mzn != null ? Number(r.price_mzn) : null,
        priceOnRequest: r.price_note != null && String(r.price_note).length > 0,
        location: r.city,
        province: r.province,
        neighborhood: r.neighborhood ?? undefined,
        categoryId: r.category,
        whatsapp: r.whatsapp,
        images,
        likes: 0,
        createdAt: r.created_at,
        updatedAt: r.updated_at
    };
}
function dataUrlToBuffer(dataUrl) {
    const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,(.+)$/i);
    const base64 = match?.[2] ?? dataUrl.replace(/^data:[^;]+;base64,/, '');
    const mime = match?.[1]?.toLowerCase() ?? 'jpeg';
    const extMap = {
        jpeg: 'jpg',
        jpg: 'jpg',
        png: 'png',
        webp: 'webp',
        gif: 'gif'
    };
    const ext = extMap[mime] ?? 'jpg';
    return {
        buffer: Buffer.from(base64, 'base64'),
        ext
    };
}
async function ensureApprovedSeller(supabase, userId) {
    const { data: rpc } = await supabase.rpc('is_admin', {
        uid: userId
    });
    if (rpc === true) return {
        ok: true,
        isAdmin: true
    };
    const { data: profile, error } = await supabase.from('profiles').select('status, role').eq('id', userId).maybeSingle();
    if (error || !profile) {
        return {
            ok: false,
            message: 'Perfil não encontrado'
        };
    }
    if (profile.status !== 'approved') {
        return {
            ok: false,
            message: 'Conta não aprovada. Aguarde a ativação.'
        };
    }
    if (profile.role !== 'seller' && profile.role !== 'admin') {
        return {
            ok: false,
            message: 'Acesso reservado a vendedores.'
        };
    }
    return {
        ok: true,
        isAdmin: false
    };
}
const dynamic = 'force-dynamic';
async function GET() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'Não autenticado'
            }, {
                status: 401
            });
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data: rows, error } = await admin.from('ads').select('*').eq('owner_id', user.id).order('updated_at', {
            ascending: false
        });
        if (error) {
            const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(error);
            console.error('[API/VENDEDOR/ANUNCIOS] GET error:', ser);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: ser.message
            }, {
                status: 500
            });
        }
        const adIds = (rows ?? []).map((r)=>r.id);
        const { data: imgRows } = adIds.length > 0 ? await admin.from('ad_images').select('ad_id, path, sort_order').in('ad_id', adIds).order('sort_order', {
            ascending: true
        }) : {
            data: []
        };
        const imagesByAd = new Map();
        for (const r of imgRows ?? []){
            const list = imagesByAd.get(r.ad_id) ?? [];
            list.push({
                path: r.path,
                sort_order: r.sort_order
            });
            imagesByAd.set(r.ad_id, list);
        }
        const ads = (rows ?? []).map((r)=>{
            const list = (imagesByAd.get(r.id) ?? []).sort((a, b)=>a.sort_order - b.sort_order);
            const imgs = list.map((i)=>buildPublicUrl(i.path));
            return rowToAd(r, imgs);
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ads
        });
    } catch (err) {
        const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(err);
        console.error('[API/VENDEDOR/ANUNCIOS] GET unexpected error:', ser);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            message: ser.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'Não autenticado'
            }, {
                status: 401
            });
        }
        const check = await ensureApprovedSeller(supabase, user.id);
        if (!check.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: check.message
            }, {
                status: 403
            });
        }
        const body = await request.json().catch(()=>({}));
        const title = String(body?.title ?? '').trim();
        const description = String(body?.description ?? '').trim();
        const province = String(body?.province ?? '').trim();
        const city = String(body?.city ?? body?.location ?? '').trim();
        const neighborhood = (body?.neighborhood ?? '').trim() || null;
        const categoryId = String(body?.categoryId ?? body?.category ?? '').trim();
        const whatsapp = String(body?.whatsapp ?? '').replace(/\D/g, '');
        const type = body?.type === 'service' ? 'service' : 'product';
        const priceOnRequest = Boolean(body?.priceOnRequest);
        const price = priceOnRequest || body?.price == null || body?.price === '' ? null : Number(body.price);
        const images = Array.isArray(body?.images) ? body.images : [];
        if (images.length > __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_AD_IMAGES) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: `Máximo ${__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_AD_IMAGES} imagens permitidas.`
            }, {
                status: 400
            });
        }
        if (!title || !city || !province || !categoryId || !whatsapp) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'Título, província, cidade, categoria e WhatsApp são obrigatórios'
            }, {
                status: 400
            });
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data: existing } = await admin.from('ads').select('id, type').eq('owner_id', user.id);
        const list = existing ?? [];
        const countProduct = list.filter((r)=>r.type === 'product').length;
        const countService = list.filter((r)=>r.type === 'service').length;
        if (type === 'product' && countProduct >= __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_PRODUCTS) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: `Limite de ${__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_PRODUCTS} produtos atingido.`
            }, {
                status: 400
            });
        }
        if (type === 'service' && countService >= __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_SERVICES) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: `Limite de ${__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_SERVICES} serviços atingido.`
            }, {
                status: 400
            });
        }
        const adRow = {
            owner_id: user.id,
            type,
            status: 'published',
            title,
            description,
            price_mzn: price,
            price_note: priceOnRequest ? 'Sob consulta' : null,
            province,
            city,
            neighborhood,
            category: categoryId,
            whatsapp
        };
        const { data: inserted, error: insertError } = await admin.from('ads').insert(adRow).select('id').single();
        if (insertError) {
            const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(insertError);
            console.error('[API/VENDEDOR/ANUNCIOS] insert ads error:', ser);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                ...ser
            }, {
                status: 500
            });
        }
        const adId = inserted.id;
        console.log('[ADS/CREATE] adId:', adId, 'ownerId:', user.id.slice(0, 8), 'imagesCount:', images.length);
        const dataUrls = images.filter((x)=>typeof x === 'string' && x.startsWith('data:'));
        const toUpload = dataUrls.slice(0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_AD_IMAGES);
        const uploadedPaths = [];
        let insertedCount = 0;
        for(let i = 0; i < toUpload.length; i++){
            const dataUrl = toUpload[i];
            try {
                const { buffer, ext } = dataUrlToBuffer(dataUrl);
                const filename = `${crypto.randomUUID()}.${ext}`;
                const path = `${user.id}/${adId}/${filename}`;
                const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
                const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, buffer, {
                    contentType,
                    upsert: true
                });
                console.log('[ADS/UPLOAD] bucket:', BUCKET, 'path:', path, 'bytes:', buffer.length, 'contentType:', contentType, 'status:', uploadError ? 'error' : 'ok');
                if (uploadError) {
                    console.error('[API/VENDEDOR/ANUNCIOS] storage upload error:', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(uploadError));
                    continue;
                }
                uploadedPaths.push(path);
                const { error: imgError } = await admin.from('ad_images').insert({
                    ad_id: adId,
                    path,
                    sort_order: i
                });
                if (imgError) {
                    console.error('[API/VENDEDOR/ANUNCIOS] ad_images insert error:', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(imgError));
                } else {
                    insertedCount++;
                }
            } catch (e) {
                console.error('[API/VENDEDOR/ANUNCIOS] image process error:', e);
            }
        }
        console.log('[ADS/DB] inserted ad_images count:', insertedCount);
        if (toUpload.length > 0 && insertedCount === 0) {
            if (uploadedPaths.length > 0) {
                await admin.storage.from(BUCKET).remove(uploadedPaths);
                console.warn('[ADS/CREATE] cleanup: removed', uploadedPaths.length, 'uploaded files');
            }
            await admin.from('ads').delete().eq('id', adId);
            console.warn('[ADS/CREATE] rollback: deleted ad', adId, '(no ad_images inserted)');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'Falha ao guardar imagens. Tente novamente.'
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            adId
        });
    } catch (err) {
        const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(err);
        console.error('[API/VENDEDOR/ANUNCIOS] unexpected error:', ser);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            message: ser.message ?? 'Erro interno'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__71577af4._.js.map