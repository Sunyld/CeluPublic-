import { getSupabase } from '@/lib/supabaseClient';
import { getAdsRepo } from '@/lib/repositories/getAdsRepo';
import { storage } from './storage';
import type { AdView } from '@/types';

// Key for storing local ad views
const LOCAL_VIEWS_KEY = 'celupublic_ad_views';

interface IncrementViewOptions {
  adId: string;
  visitorIdentifier: string;
  ip?: string;
  userAgent?: string;
}

export class AdsViewService {
  /**
   * Increment ad view - handles both Supabase (server) and local storage (client)
   * Returns true if the view was counted, false if it was a duplicate
   */
  static async incrementView(options: IncrementViewOptions): Promise<boolean> {
    const { adId, visitorIdentifier, ip, userAgent } = options;
    const supabase = getSupabase();

    if (supabase) {
      // Use API endpoint instead of direct RPC (avoids permission errors)
      const response = await fetch(`/api/ads/${adId}/increment-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorIdentifier, ip, userAgent }),
      });
      
      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error('[AdsViewService] API error incrementing view:', response.statusText);
        return false;
      }
      
      const result = await response.json();
      return result.counted ?? false;
    } else {
            // Local storage implementation
            return await this.incrementViewLocal(adId, visitorIdentifier);
        }
  }

  /**
     * Local implementation of incrementView using localStorage
     */
    private static async incrementViewLocal(adId: string, visitorIdentifier: string): Promise<boolean> {
        const now = new Date();
        const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const viewKey = `${adId}-${visitorIdentifier}-${todayKey}`;

        // Get existing local views
        const localViews = this.getLocalViews();

        // Check if already viewed today
        if (localViews[viewKey]) {
            return false;
        }

        // Mark as viewed
        localViews[viewKey] = now.toISOString();
        localStorage.setItem(LOCAL_VIEWS_KEY, JSON.stringify(localViews));

        // Increment ad views in local storage
        const adsRepo = getAdsRepo();
        const ad = await adsRepo.getById(adId);
        if (ad) {
            await adsRepo.update(adId, { views: ad.views + 1 });
        }

        return true;
    }

  /**
   * Get local views record from localStorage
   */
  private static getLocalViews(): Record<string, string> {
    try {
      const raw = localStorage.getItem(LOCAL_VIEWS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /**
   * Generate a visitor identifier (uses session ID or generates a random one)
   */
  static getVisitorIdentifier(): string {
    const SESSION_KEY = 'celupublic_visitor_id';

    // Try to get existing session ID
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }

    return id;
  }
}
