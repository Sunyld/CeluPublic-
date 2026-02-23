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
function createClient() {
    const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://wuppmtktghypzgbiyldj.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cHBtdGt0Z2h5cHpnYml5bGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDc2MjYsImV4cCI6MjA4NjY4MzYyNn0.FBeRMBEaP9mMgSkZEp5h6-Lk5p0iLp4ApQhy7EAB58Q"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set({
                        name,
                        value,
                        ...options
                    });
                } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set({
                        name,
                        value: '',
                        ...options
                    });
                } catch (error) {
                // The `remove` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/api/admin/banners/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        // 1. Verify user is Admin
        const supabaseUserClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado'
            }, {
                status: 401
            });
        }
        // Check is_admin via RPC or profile
        const { data: profile, error: profileError } = await supabaseUserClient.from('profiles').select('role').eq('id', user.id).single();
        if (profileError || profile?.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Acesso negado: Apenas administradores'
            }, {
                status: 403
            });
        }
        // 2. Parse FormData
        const formData = await request.formData();
        const title = formData.get('title');
        const link = formData.get('link') || '';
        const active = formData.get('active') === 'true';
        const order = parseInt(formData.get('order')) || 0;
        const file = formData.get('file');
        if (!title || !file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Título e imagem são obrigatórios'
            }, {
                status: 400
            });
        }
        const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // 3. Upload to Storage (Service Role)
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `banners/${fileName}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from('banner-images').upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
        });
        if (uploadError) {
            console.error('[API/BANNERS] Upload error:', uploadError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Erro no upload: ${uploadError.message}`
            }, {
                status: 500
            });
        }
        // 4. Insert into DB (Service Role)
        const { data: banner, error: dbError } = await supabaseAdmin.from('banners').insert({
            title,
            link,
            image_path: filePath,
            image_url: filePath,
            active,
            sort_order: order
        }).select().single();
        if (dbError) {
            console.error('[API/BANNERS] DB Insert error:', dbError);
            // Se falhar por coluna inexistente, tentamos sem image_url
            if (dbError.message.includes('image_url')) {
                const { data: retryBanner, error: retryError } = await supabaseAdmin.from('banners').insert({
                    title,
                    link,
                    image_path: filePath,
                    active,
                    sort_order: order
                }).select().single();
                if (retryError) throw retryError;
                return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(retryBanner);
            }
            throw dbError;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(banner);
    } catch (err) {
        console.error('[API/BANNERS] Unexpected error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro interno no servidor'
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const supabaseUserClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não autenticado'
            }, {
                status: 401
            });
        }
        // Admin check
        const { data: profile } = await supabaseUserClient.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Acesso negado'
            }, {
                status: 403
            });
        }
        const formData = await request.formData();
        const id = formData.get('id');
        const active = formData.get('active') === 'true';
        // support optional fields
        const title = formData.get('title');
        const link = formData.get('link');
        const order = formData.get('order') ? parseInt(formData.get('order')) : undefined;
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'ID é obrigatório'
        }, {
            status: 400
        });
        const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const updates = {
            active
        };
        if (title !== null) updates.title = title;
        if (link !== null) updates.link = link;
        if (order !== undefined) updates.sort_order = order;
        updates.updated_at = new Date().toISOString();
        const { data: banner, error: dbError } = await supabaseAdmin.from('banners').update(updates).eq('id', id).select().single();
        if (dbError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: dbError.message
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(banner);
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erro'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08f841de._.js.map