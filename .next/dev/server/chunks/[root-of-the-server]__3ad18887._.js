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
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/api/ads/public/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate
]);
/**
 * GET /api/ads/public
 * Lista anúncios: publicados (published + owner approved) + se autenticado, os próprios (qualquer status).
 * Usa service role. Funciona para anônimo e autenticado.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/error.ts [app-route] (ecmascript)");
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
const dynamic = 'force-dynamic';
const revalidate = 0;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') ?? '';
        const q = searchParams.get('q') ?? '';
        const city = searchParams.get('city') ?? '';
        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
        const limit = 100;
        const offset = (page - 1) * limit;
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user } } = await supabase.auth.getUser();
        let query = admin.from('ads').select(`
                id, owner_id, type, status, title, description, price_mzn, price_note,
                province, city, neighborhood, category, whatsapp, created_at, updated_at
            `).order('updated_at', {
            ascending: false
        }).range(offset, offset + limit - 1);
        if (category) query = query.eq('category', category);
        if (city) query = query.eq('city', city);
        if (q && q.trim()) {
            const term = `%${q.trim()}%`;
            query = query.or(`title.ilike.${term},description.ilike.${term}`);
        }
        const { data: adsRows, error: adsError } = await query;
        if (adsError) {
            const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(adsError);
            console.error('[API/ADS/PUBLIC] ads error:', ser);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                ...ser
            }, {
                status: 500
            });
        }
        let rows = adsRows ?? [];
        let ownAds = [];
        if (user) {
            const { data: own } = await admin.from('ads').select(`
                    id, owner_id, type, status, title, description, price_mzn, price_note,
                    province, city, neighborhood, category, whatsapp, created_at, updated_at
                `).eq('owner_id', user.id);
            ownAds = own ?? [];
        }
        const ownerIds = [
            ...new Set([
                ...rows.map((r)=>r.owner_id),
                ...ownAds.map((r)=>r.owner_id)
            ])
        ];
        const { data: profiles } = await admin.from('profiles').select('id, full_name, status').in('id', ownerIds);
        const approvedIds = new Set((profiles ?? []).filter((p)=>p.status === 'approved').map((p)=>p.id));
        const profileMap = new Map((profiles ?? []).map((p)=>[
                p.id,
                p.full_name
            ]));
        const publicRows = rows.filter((r)=>r.status === 'published' && approvedIds.has(r.owner_id));
        const ownIds = new Set(ownAds.map((r)=>r.id));
        const merged = [
            ...ownAds,
            ...publicRows.filter((r)=>!ownIds.has(r.id))
        ];
        const adIds = merged.map((r)=>r.id);
        const { data: imgRows } = await admin.from('ad_images').select('ad_id, path, sort_order').in('ad_id', adIds).order('sort_order', {
            ascending: true
        });
        const imagesByAd = new Map();
        for (const r of imgRows ?? []){
            const list = imagesByAd.get(r.ad_id) ?? [];
            list.push({
                path: r.path,
                sort_order: r.sort_order
            });
            imagesByAd.set(r.ad_id, list);
        }
        const ads = merged.map((r)=>{
            const imgs = (imagesByAd.get(r.id) ?? []).sort((a, b)=>a.sort_order - b.sort_order);
            return rowToAd(r, imgs.map((i)=>buildPublicUrl(i.path)), profileMap.get(r.owner_id));
        });
        console.log('[API/ADS/PUBLIC] returning', ads.length, 'ads');
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ads,
            total: ads.length
        });
    } catch (err) {
        const ser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeSupabaseError"])(err);
        console.error('[API/ADS/PUBLIC] unexpected error:', ser);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            message: ser.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3ad18887._.js.map