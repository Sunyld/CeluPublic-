import type { LikesRepository } from '../likesRepo';
import { getSupabase } from '@/lib/supabaseClient';

export const likesRepoSupabase: LikesRepository = {
  async getUserLikes(userId: string) {
    const supabase = getSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('ad_likes')
      .select('ad_id')
      .eq('user_id', userId);
    if (error || !Array.isArray(data)) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][likesRepo.getUserLikes]', error);
      }
      return [];
    }
    return (data as { ad_id: string }[]).map((r) => r.ad_id);
  },

  async toggleLike(adId: string, userId: string) {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('ad_likes')
      .insert({ ad_id: adId, user_id: userId })
      .single();
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

  async getLikeCounts(adIds: string[]) {
    const supabase = getSupabase();
    if (!supabase || adIds.length === 0) return {};
    const { data, error } = await supabase
      .from('ad_like_counts')
      .select('ad_id, likes_count')
      .in('ad_id', adIds);
    if (error || !Array.isArray(data)) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][likesRepo.getLikeCounts]', error);
      }
      return {};
    }
    const out: Record<string, number> = {};
    for (const row of data as { ad_id: string; likes_count: number }[]) {
      out[row.ad_id] = Number(row.likes_count) || 0;
    }
    return out;
  },
};

