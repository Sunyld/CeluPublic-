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
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/api/profile/ensure/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/admin.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const { id, email, full_name, avatar_url, whatsapp, province, city, account_type } = await request.json();
        if (!id || !email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing id or email'
            }, {
                status: 400
            });
        }
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseServiceKey) {
            console.error('[API/PROFILE/ENSURE] Missing SUPABASE_SERVICE_ROLE_KEY in environment');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Configuração do servidor incompleta (Missing Service Key). Verifique o ficheiro .env'
            }, {
                status: 500
            });
        }
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const isSpecialAdmin = [
            'sunyldjosesomailamatapa@gmail.com',
            'celupublic@gmail.com'
        ].includes(email.toLowerCase());
        const emailNorm = email.toLowerCase();
        // 1) SELECT existente primeiro - NUNCA desaprovar quem já foi aprovado/rejeitado
        const { data: existing } = await supabase.from('profiles').select('id, status, role').eq('id', id).maybeSingle();
        const preserveStatus = existing && [
            'approved',
            'rejected'
        ].includes(existing.status || '');
        if (preserveStatus) {
            console.log('[ENSURE] existing profile status/role preserved:', {
                userId: id.slice(0, 8),
                status: existing.status,
                role: existing.role,
                message: 'NOT overwriting - user was already approved/rejected'
            });
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(profile);
        }
        const role = isSpecialAdmin ? 'admin' : existing?.role || 'seller';
        const status = isSpecialAdmin ? 'approved' : existing?.status || 'pending';
        const upsertPayload = {
            id,
            email: emailNorm,
            full_name: full_name || 'Usuário',
            whatsapp: whatsapp || null,
            province: province || null,
            city: city || null,
            account_type: [
                'seller',
                'provider',
                'both'
            ].includes(account_type) ? account_type : 'seller',
            role,
            status,
            updated_at: new Date().toISOString()
        };
        const { data: profile, error } = await supabase.from('profiles').upsert(upsertPayload, {
            onConflict: 'id'
        }).select().single();
        if (error) {
            console.error('[API/PROFILE/ENSURE] Upsert error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        // 2) Garantir seller_request apenas para pending
        if (status === 'pending' && role !== 'admin') {
            console.log('[API/PROFILE/ENSURE] Ensuring seller_request for pending user:', {
                userId: id.slice(0, 8),
                email: email.toLowerCase().slice(0, 20),
                role,
                status
            });
            const { data: requestData, error: reqError } = await supabase.from('seller_requests').upsert({
                user_id: id,
                status: 'pending'
            }, {
                onConflict: 'user_id'
            }).select();
            if (reqError) {
                console.error('[API/PROFILE/ENSURE] Seller request upsert ERROR:', {
                    userId: id.slice(0, 8),
                    error: reqError.message,
                    code: reqError.code,
                    details: reqError.details,
                    hint: reqError.hint
                });
            // Não falhar a requisição se seller_request falhar - trigger pode criar depois
            } else if (requestData && requestData.length > 0) {
                console.log('[API/PROFILE/ENSURE] Seller request ensured SUCCESS:', {
                    userId: id.slice(0, 8),
                    requestId: requestData[0].id?.slice(0, 8),
                    requestStatus: requestData[0].status,
                    created: !!requestData[0].id
                });
            } else {
                console.warn('[API/PROFILE/ENSURE] Seller request upsert returned empty data:', {
                    userId: id.slice(0, 8),
                    warning: 'No data returned from upsert'
                });
            }
        } else {
            console.log('[API/PROFILE/ENSURE] Skipping seller_request creation:', {
                userId: id.slice(0, 8),
                reason: status === 'pending' ? 'user is admin' : 'user is approved',
                status,
                role
            });
        }
        console.log('[API/PROFILE/ENSURE] Profile ensured successfully:', {
            userId: id.slice(0, 8),
            email: email.toLowerCase().slice(0, 20),
            role,
            status,
            isAdmin: isSpecialAdmin,
            profileId: profile?.id?.slice(0, 8)
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(profile);
    } catch (err) {
        console.error('[API/PROFILE/ENSURE] Unexpected error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f3af352e._.js.map