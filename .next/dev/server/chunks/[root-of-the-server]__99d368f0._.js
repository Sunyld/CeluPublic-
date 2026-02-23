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
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/api/vendedor/anuncios/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "dynamic",
    ()=>dynamic
]);
/**
 * GET e PATCH /api/vendedor/anuncios/[id]
 * Carregar e atualizar anúncio. Valida ownership.
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
async function ensureOwnerOrAdmin(supabase, userId, ownerId) {
    if (userId === ownerId) return true;
    const { data } = await supabase.rpc('is_admin', {
        uid: userId
    });
    if (data === true) return true;
    const { data: p } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
    return p?.role === 'admin';
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
const dynamic = 'force-dynamic';
async function GET(_request, { params }) {
    try {
        const { id } = await params;
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'id obrigatório'
        }, {
            status: 400
        });
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado'
            }, {
                status: 401
            });
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data: adRow, error: adErr } = await admin.from('ads').select('*').eq('id', id).maybeSingle();
        if (adErr || !adRow) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Anúncio não encontrado'
            }, {
                status: 404
            });
        }
        const ownerId = adRow.owner_id;
        if (!await ensureOwnerOrAdmin(supabase, user.id, ownerId)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Acesso negado'
            }, {
                status: 403
            });
        }
        const { data: imgRows } = await admin.from('ad_images').select('path, sort_order').eq('ad_id', id).order('sort_order', {
            ascending: true
        });
        const imgs = (imgRows ?? []).sort((a, b)=>a.sort_order - b.sort_order).map((i)=>buildPublicUrl(i.path));
        const { data: profile } = await admin.from('profiles').select('full_name').eq('id', ownerId).maybeSingle();
        const ad = rowToAd(adRow, imgs, profile?.full_name);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(ad);
    } catch (err) {
        const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(err);
        console.error('[API/VENDEDOR/ANUNCIOS/GET] error:', ser);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: ser.message
        }, {
            status: 500
        });
    }
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
async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'id obrigatório'
        }, {
            status: 400
        });
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado'
            }, {
                status: 401
            });
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data: adRow, error: adErr } = await admin.from('ads').select('owner_id').eq('id', id).maybeSingle();
        if (adErr || !adRow) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Anúncio não encontrado'
            }, {
                status: 404
            });
        }
        const ownerId = adRow.owner_id;
        if (!await ensureOwnerOrAdmin(supabase, user.id, ownerId)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Acesso negado'
            }, {
                status: 403
            });
        }
        const body = await request.json().catch(()=>({}));
        const images = Array.isArray(body?.images) ? body.images : [];
        if (images.length > __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_AD_IMAGES) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Máximo ${__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_AD_IMAGES} imagens permitidas.`
            }, {
                status: 400
            });
        }
        const updates = {
            updated_at: new Date().toISOString()
        };
        if (body?.title != null) updates.title = String(body.title).trim();
        if (body?.description != null) updates.description = String(body.description).trim();
        if (body?.price != null) updates.price_mzn = Number(body.price);
        if (body?.price === null) updates.price_mzn = null;
        if (body?.priceOnRequest != null) updates.price_note = body.priceOnRequest ? 'Sob consulta' : null;
        if (body?.province != null) updates.province = String(body.province).trim();
        if (body?.city != null || body?.location != null) updates.city = String(body.city ?? body.location ?? '').trim();
        if (body?.neighborhood !== undefined) updates.neighborhood = body.neighborhood?.trim() || null;
        if (body?.categoryId != null) updates.category = String(body.categoryId).trim();
        if (body?.whatsapp != null) updates.whatsapp = String(body.whatsapp).replace(/\D/g, '');
        if (body?.type != null) updates.type = body.type === 'service' ? 'service' : 'product';
        if (body?.status != null) updates.status = body.status;
        if (Object.keys(updates).length > 1) {
            const { error: upErr } = await admin.from('ads').update(updates).eq('id', id);
            if (upErr) {
                const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(upErr);
                console.error('[API/VENDEDOR/ANUNCIOS/PATCH] update error:', ser);
                return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: ser.message
                }, {
                    status: 500
                });
            }
        }
        const baseUrl = ("TURBOPACK compile-time value", "https://wuppmtktghypzgbiyldj.supabase.co") ?? '';
        const urlPrefix = `${baseUrl}/storage/v1/object/public/${BUCKET}/`;
        function urlToPath(url) {
            if (typeof url !== 'string' || !url.startsWith('http')) return null;
            const idx = url.indexOf(urlPrefix);
            if (idx === -1) return null;
            return url.slice(idx + urlPrefix.length).replace(/^\/+|\/+$/g, '') || null;
        }
        const pathsToKeep = [];
        const dataUrls = [];
        for (const img of images){
            if (typeof img === 'string' && img.startsWith('data:')) {
                dataUrls.push(img);
            } else if (typeof img === 'string' && img.startsWith('http')) {
                const p = urlToPath(img);
                if (p) pathsToKeep.push(p);
            }
        }
        const { data: existing } = await admin.from('ad_images').select('path').eq('ad_id', id);
        const existingPaths = (existing ?? []).map((r)=>r.path);
        const pathsToDelete = existingPaths.filter((p)=>!pathsToKeep.includes(p));
        if (pathsToDelete.length > 0) {
            await admin.storage.from(BUCKET).remove(pathsToDelete);
        }
        const toUpload = dataUrls.slice(0, Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LIMITS"].MAX_AD_IMAGES - pathsToKeep.length));
        const allPaths = [
            ...pathsToKeep
        ];
        for(let i = 0; i < toUpload.length; i++){
            const dataUrl = toUpload[i];
            try {
                const { buffer, ext } = dataUrlToBuffer(dataUrl);
                const filename = `${crypto.randomUUID()}.${ext}`;
                const path = `${user.id}/${id}/${filename}`;
                const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
                const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, buffer, {
                    contentType,
                    upsert: true
                });
                if (uploadErr) continue;
                allPaths.push(path);
            } catch (e) {
                console.error('[API/VENDEDOR/ANUNCIOS/PATCH] image upload error:', e);
            }
        }
        await admin.from('ad_images').delete().eq('ad_id', id);
        for(let i = 0; i < allPaths.length; i++){
            await admin.from('ad_images').insert({
                ad_id: id,
                path: allPaths[i],
                sort_order: i
            });
        }
        const { data: updated } = await admin.from('ads').select('*').eq('id', id).single();
        const { data: imgRows } = await admin.from('ad_images').select('path, sort_order').eq('ad_id', id).order('sort_order', {
            ascending: true
        });
        const imgs = (imgRows ?? []).sort((a, b)=>a.sort_order - b.sort_order).map((i)=>buildPublicUrl(i.path));
        const ad = rowToAd(updated ?? {}, imgs);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(ad);
    } catch (err) {
        const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(err);
        console.error('[API/VENDEDOR/ANUNCIOS/PATCH] error:', ser);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            message: ser.message
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    const { id } = await params;
    console.log('========================================');
    console.log('[API/SELLER/ADS/DELETE] REQUEST RECEBIDA');
    console.log('[API/SELLER/ADS/DELETE] adId=', id ?? 'undefined');
    console.log('[API/SELLER/ADS/DELETE] method=', request.method);
    console.log('[API/SELLER/ADS/DELETE] url=', request.url);
    console.log('========================================');
    try {
        if (!id) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=missing code=MISSING_ID message=id obrigatório');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'id obrigatório',
                code: 'MISSING_ID'
            }, {
                status: 400
            });
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=UNAUTHORIZED message=', authError?.message ?? 'Não autenticado');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'Não autenticado',
                code: 'UNAUTHORIZED'
            }, {
                status: 401
            });
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data: adRow, error: adErr } = await admin.from('ads').select('owner_id').eq('id', id).maybeSingle();
        if (adErr) {
            const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(adErr);
            console.error('[API/SELLER/ADS/DELETE] select ad error:', ser.message, ser.code);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: ser.message ?? 'Erro ao verificar anúncio',
                code: ser.code
            }, {
                status: 500
            });
        }
        if (!adRow) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=NOT_FOUND message=Anúncio não encontrado');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'Anúncio não encontrado',
                code: 'NOT_FOUND'
            }, {
                status: 404
            });
        }
        const ownerId = adRow.owner_id;
        if (!await ensureOwnerOrAdmin(supabase, user.id, ownerId)) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=FORBIDDEN message=Acesso negado');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: 'Acesso negado. Só o dono do anúncio ou um administrador pode apagá-lo.',
                code: 'FORBIDDEN'
            }, {
                status: 403
            });
        }
        // 1) Paths das imagens para apagar do storage
        const { data: imgRows } = await admin.from('ad_images').select('path').eq('ad_id', id);
        const paths = (imgRows ?? []).map((r)=>r.path);
        // 2) Remover ficheiros do bucket (não falhar se ficheiro não existir)
        if (paths.length > 0) {
            const { error: storageErr } = await admin.storage.from(BUCKET).remove(paths);
            if (storageErr) {
                console.warn('[API/SELLER/ADS/DELETE] storage remove (non-fatal):', storageErr.message, 'paths:', paths.length);
            }
        }
        // 3) Apagar linhas ad_images (antes do ad por FK)
        const { error: delImgErr } = await admin.from('ad_images').delete().eq('ad_id', id);
        if (delImgErr) {
            const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(delImgErr);
            console.error('[API/SELLER/ADS/DELETE] delete ad_images error:', ser.message);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: ser.message ?? 'Erro ao apagar imagens',
                code: 'DB_ERROR'
            }, {
                status: 500
            });
        }
        // 4) Apagar linha do anúncio
        const { error: delAdErr } = await admin.from('ads').delete().eq('id', id);
        if (delAdErr) {
            const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(delAdErr);
            console.error('[API/SELLER/ADS/DELETE] delete ads error:', ser.message);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                message: ser.message ?? 'Erro ao apagar anúncio',
                code: 'DB_ERROR'
            }, {
                status: 500
            });
        }
        console.log('[API/SELLER/ADS/DELETE] ok adId=', id, 'images=', paths.length);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (err) {
        const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(err);
        console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=INTERNAL message=', ser.message, 'details=', ser.code ?? '');
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            message: ser.message ?? 'Erro ao eliminar anúncio',
            code: 'INTERNAL'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__99d368f0._.js.map