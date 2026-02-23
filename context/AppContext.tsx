/**
 * Estado global do CeluPublic: ads, categorias, banners, likes.
 * Em modo backend real, tudo vem de Supabase via repositórios.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Ad, Category, Banner, User } from '../types';
import { useEffect } from 'react';
import { PLACEHOLDER_IMAGE } from '../lib/constants';
import { invalidatePublicAdsCache } from '../lib/cachedData';
import { getUsersRepo } from '../lib/repositories/getUsersRepo';
import { getAdsRepo } from '../lib/repositories/getAdsRepo';
import { getLikesRepo } from '../lib/repositories/getLikesRepo';
import { getCategoriesRepo } from '../lib/repositories/getCategoriesRepo';
import { getBannersRepo } from '../lib/repositories/getBannersRepo';
import { getSettingsRepo } from '../lib/repositories/getSettingsRepo';
import { useSupabase, getSupabase } from '../lib/supabaseClient';

type AppState = {
  ads: Ad[];
  categories: Category[];
  banners: Banner[];
  users: User[];
  likedIds: Record<string, boolean>;
  /** Public settings (admin_whatsapp, activation_fee_mzn). From settingsRepo when useSupabase. */
  publicSettings: Record<string, unknown>;
  /** Loading states for each data type */
  loading: {
    ads: boolean;
    categories: boolean;
    banners: boolean;
    users: boolean;
    settings: boolean;
  };
  /** Error states (non-fatal, app continues rendering) */
  errors: {
    ads: string | null;
    categories: string | null;
    banners: string | null;
    users: string | null;
    settings: string | null;
  };
};

type AppContextValue = AppState & {
  setAds: (ads: Ad[] | ((prev: Ad[]) => Ad[])) => void;
  setCategories: (categories: Category[] | ((prev: Category[]) => Category[])) => void;
  setBanners: (banners: Banner[] | ((prev: Banner[]) => Banner[])) => void;
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void;
  refreshUsers: () => void;
  refreshAds: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshBanners: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  toggleLike: (adId: string) => void;
  getAdById: (id: string) => Ad | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getAdsByUser: (userId: string) => Ad[];
  getPublishedAds: () => Ad[];
  getFeaturedAds: () => Ad[];
  getTopRankedAds: () => Ad[];
  getAdsByCategory: (categoryId: string) => Ad[];
  getRelatedAds: (ad: Ad, limit?: number) => Ad[];
};

const defaultState: AppState = {
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
    settings: false,
  },
  errors: {
    ads: null,
    categories: null,
    banners: null,
    users: null,
    settings: null,
  },
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ads, setAdsState] = useState<Ad[]>(defaultState.ads);
  const [categories, setCategoriesState] = useState<Category[]>(defaultState.categories);
  const [banners, setBannersState] = useState<Banner[]>(defaultState.banners);
  const [users, setUsersState] = useState<User[]>(defaultState.users);
  const [likedIds, setLikedIdsState] = useState<Record<string, boolean>>(defaultState.likedIds);
  const [publicSettings, setPublicSettingsState] = useState<Record<string, unknown>>(defaultState.publicSettings);
  const [loading, setLoading] = useState(defaultState.loading);
  const [errors, setErrors] = useState(defaultState.errors);

  const setAds = useCallback((updater: Ad[] | ((prev: Ad[]) => Ad[])) => {
    setAdsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      invalidatePublicAdsCache();
      return next;
    });
  }, []);

  const setCategories = useCallback((updater: Category[] | ((prev: Category[]) => Category[])) => {
    setCategoriesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  const setBanners = useCallback((updater: Banner[] | ((prev: Banner[]) => Banner[])) => {
    setBannersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  const setUsers = useCallback((updater: User[] | ((prev: User[]) => User[])) => {
    setUsersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      invalidatePublicAdsCache();
      return next;
    });
  }, []);

  const refreshUsers = useCallback(async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    setErrors((prev) => ({ ...prev, users: null }));
    try {
      const list = await getUsersRepo().list();
      setUsersState(list);
      setLoading((prev) => ({ ...prev, users: false }));
      // eslint-disable-next-line no-console
      console.log('[DB] Loaded users:', list.length);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[DB] Failed to load users', err);
      setLoading((prev) => ({ ...prev, users: false }));
      // Check for RLS recursion error (42P17) - don't crash the app
      if (err?.code === '42P17' || err?.message?.includes('recursion') || err?.message?.includes('infinite')) {
        // eslint-disable-next-line no-console
        console.error('[DB] RLS recursion detected (42P17) - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
        setErrors((prev) => ({ ...prev, users: 'Erro de configuração do banco de dados. Contacte o suporte.' }));
      } else {
        setErrors((prev) => ({ ...prev, users: 'Não foi possível carregar utilizadores.' }));
      }
      // Don't throw - allow app to continue rendering
    }
  }, []);

  const refreshAds = useCallback(async () => {
    setLoading((prev) => ({ ...prev, ads: true }));
    setErrors((prev) => ({ ...prev, ads: null }));
    try {
      let list: Ad[] = [];
      if (useSupabase) {
        const r = await fetch('/api/ads/public', { cache: 'no-store' });
        if (r.ok) {
          const d = await r.json();
          list = d.ads ?? [];
        } else {
          list = await getAdsRepo().list();
        }
      } else {
        list = await getAdsRepo().list();
      }
      setAdsState(list);
      invalidatePublicAdsCache();
      setLoading((prev) => ({ ...prev, ads: false }));
      // eslint-disable-next-line no-console
      console.log('[DB] Loaded ads:', list.length);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[DB] Failed to load ads', err);
      setLoading((prev) => ({ ...prev, ads: false }));
      // Check for RLS recursion error (42P17) - don't crash the app
      if (err?.code === '42P17' || err?.message?.includes('recursion') || err?.message?.includes('infinite')) {
        // eslint-disable-next-line no-console
        console.error('[DB] RLS recursion detected (42P17) - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
        setErrors((prev) => ({ ...prev, ads: 'Erro de configuração do banco de dados. Contacte o suporte.' }));
      } else {
        setErrors((prev) => ({ ...prev, ads: 'Não foi possível carregar anúncios.' }));
      }
      // Don't throw - allow app to continue rendering
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    setErrors((prev) => ({ ...prev, categories: null }));
    try {
      const list = await getCategoriesRepo().list();
      setCategoriesState(list);
      setLoading((prev) => ({ ...prev, categories: false }));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[DB] Failed to load categories', err);
      setLoading((prev) => ({ ...prev, categories: false }));
      if (err?.code === '42P17' || err?.message?.includes('recursion') || err?.message?.includes('infinite')) {
        setErrors((prev) => ({ ...prev, categories: 'Erro de configuração do banco de dados.' }));
      } else {
        setErrors((prev) => ({ ...prev, categories: 'Não foi possível carregar categorias.' }));
      }
    }
  }, []);

  const refreshBanners = useCallback(async () => {
    setLoading((prev) => ({ ...prev, banners: true }));
    setErrors((prev) => ({ ...prev, banners: null }));
    try {
      const list = await getBannersRepo().listPublic();
      setBannersState(list);
      setLoading((prev) => ({ ...prev, banners: false }));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[DB] Failed to load banners', err);
      setLoading((prev) => ({ ...prev, banners: false }));
      setErrors((prev) => ({ ...prev, banners: 'Não foi possível carregar banners.' }));
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    setLoading((prev) => ({ ...prev, settings: true }));
    setErrors((prev) => ({ ...prev, settings: null }));
    try {
      const settings = await getSettingsRepo().listPublic();
      setPublicSettingsState(settings);
      setLoading((prev) => ({ ...prev, settings: false }));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[DB] Failed to load settings', err);
      setLoading((prev) => ({ ...prev, settings: false }));
      setErrors((prev) => ({ ...prev, settings: 'Não foi possível carregar configurações.' }));
    }
  }, []);

  // Carregamento inicial de todos os dados a partir dos repositórios (Supabase/local consoante implementação).
  // SAFE BOOT: Never throw errors, always render with fallback states
  useEffect(() => {
    // Public data (categories, banners, settings) can be loaded immediately
    // These are safe to load without session and should not crash
    void refreshCategories();
    void refreshBanners();
    void refreshSettings();

    // Users and ads: load carefully, but don't wait for auth
    // If Supabase is enabled, try to load (public data should be accessible via RLS)
    // If it fails, state will show error but app continues rendering
    if (useSupabase) {
      const supabase = getSupabase();
      if (supabase) {
        // Try to get session, but don't wait - load data anyway (public data)
        supabase.auth.getSession().then(() => {
          // Load users and ads (public data should be accessible)
          void refreshUsers();
          void refreshAds();
        }).catch((err) => {
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
  }, [refreshUsers, refreshAds, refreshCategories, refreshBanners, refreshSettings, useSupabase]);

  useEffect(() => {
    if (users.length > 0) {
      const usersRepo = getUsersRepo();
      const currentId = usersRepo.getCurrentUserId?.();
      // Carregamos likes do utilizador autenticado, se houver.
      if (currentId) {
        getLikesRepo()
          .getUserLikes(currentId)
          .then((ids) => {
            const map: Record<string, boolean> = {};
            for (const id of ids) map[id] = true;
            setLikedIdsState(map);
          })
          .catch((err: any) => {
            // eslint-disable-next-line no-console
            console.error('[DB] Failed to load user likes', err);
            // Don't crash - just set empty likes
            setLikedIdsState({});
          });
      } else {
        setLikedIdsState({});
      }
    }
  }, [useSupabase, users]);

  const toggleLike = useCallback((adId: string) => {
    const wasLiked = likedIds[adId];
    setLikedIdsState((prev) => {
      const next = { ...prev, [adId]: !prev[adId] };
      return next;
    });
    if (!useSupabase) {
      setAdsState((prev) => {
        const ad = prev.find((a) => a.id === adId);
        if (!ad) return prev;
        const delta = wasLiked ? -1 : 1;
        const next = prev.map((a) =>
          a.id === adId ? { ...a, likes: Math.max(0, a.likes + delta) } : a
        );
        return next;
      });
    }
  }, [likedIds, useSupabase]);

  const getAdById = useCallback(
    (id: string) => ads.find((a) => a.id === id),
    [ads]
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const getAdsByUser = useCallback(
    (userId: string) => ads.filter((a) => a.userId === userId),
    [ads]
  );

  const getPublishedAds = useCallback(
    () => ads.filter((a) => a.status === 'published').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [ads]
  );

  const getFeaturedAds = useCallback(() => {
    const published = ads.filter((a) => a.status === 'published');
    return [...published].sort((a, b) => b.likes - a.likes).slice(0, 8);
  }, [ads]);

  const getTopRankedAds = useCallback(() => {
    const published = ads.filter((a) => a.status === 'published');
    return [...published].sort((a, b) => b.likes - a.likes).slice(0, 8);
  }, [ads]);

  const getAdsByCategory = useCallback(
    (categoryId: string) =>
      ads.filter((a) => a.status === 'published' && a.categoryId === categoryId),
    [ads]
  );

  const getRelatedAds = useCallback(
    (ad: Ad, limit = 4) =>
      ads
        .filter((a) => a.status === 'published' && a.id !== ad.id && (a.categoryId === ad.categoryId || a.type === ad.type))
        .sort((a, b) => b.likes - a.likes)
        .slice(0, limit),
    [ads]
  );

  const value = useMemo<AppContextValue>(
    () => ({
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
      getRelatedAds,
    }),
    [
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
      getRelatedAds,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function getAdImage(ad: Ad): string {
  return ad.images?.[0] || PLACEHOLDER_IMAGE;
}
