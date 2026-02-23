module.exports = [
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PosLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$providers$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/providers/AuthProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$app$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/components/ui/app-button.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function PosLogin() {
    const { user, authStatus, profileStatus, getPostLoginRedirect, logout, authError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$providers$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (authStatus === 'authenticated' && profileStatus === 'ready' && user) {
            const target = getPostLoginRedirect(user);
            router.replace(target);
        } else if (authStatus === 'anonymous') {
            router.replace('/entrar');
        }
    }, [
        user,
        authStatus,
        profileStatus,
        getPostLoginRedirect,
        router
    ]);
    if (profileStatus === 'error') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[80vh] items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full text-center space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "h-6 w-6 text-destructive"
                        }, void 0, false, {
                            fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                            lineNumber: 27,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                        lineNumber: 26,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold",
                        children: "Erro ao carregar perfil"
                    }, void 0, false, {
                        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                        lineNumber: 29,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: authError || 'Ocorreu um problema ao preparar o seu acesso. Por favor, tente novamente.'
                    }, void 0, false, {
                        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                        lineNumber: 30,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$app$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppButton"], {
                                onClick: ()=>window.location.reload(),
                                children: "Tentar Novamente"
                            }, void 0, false, {
                                fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                                lineNumber: 34,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$components$2f$ui$2f$app$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppButton"], {
                                variant: "ghost",
                                onClick: ()=>logout(),
                                children: "Sair e entrar com outra conta"
                            }, void 0, false, {
                                fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                                lineNumber: 37,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                        lineNumber: 33,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                lineNumber: 25,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
            lineNumber: 24,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-[80vh] items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "mx-auto h-8 w-8 animate-spin text-primary"
                }, void 0, false, {
                    fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                    lineNumber: 49,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-sm text-muted-foreground font-medium",
                    children: "A preparar o teu acesso..."
                }, void 0, false, {
                    fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                    lineNumber: 50,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-xs text-muted-foreground",
                    children: "Isso deve levar apenas alguns segundos."
                }, void 0, false, {
                    fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
            lineNumber: 48,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/app/pos-login/page.tsx",
        lineNumber: 47,
        columnNumber: 9
    }, this);
}
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LoaderCircle
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M21 12a9 9 0 1 1-6.219-8.56",
            key: "13zald"
        }
    ]
];
const LoaderCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("loader-circle", __iconNode);
;
 //# sourceMappingURL=loader-circle.js.map
}),
"[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reactjs$2f$Celu$2f$project$2d$bolt$2d$sb1$2d$r7qsskrc$2f$funcional$2f$project$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reactjs/Celu/project-bolt-sb1-r7qsskrc/funcional/project/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=Reactjs_Celu_project-bolt-sb1-r7qsskrc_funcional_project_e88ec9e4._.js.map