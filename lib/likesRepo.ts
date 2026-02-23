export interface LikesRepository {
  getUserLikes(userId: string): Promise<string[]>;
  toggleLike(adId: string, userId: string): Promise<boolean>;
  getLikeCounts(adIds: string[]): Promise<Record<string, number>>;
}

export { likesRepo } from './local/likesRepo.local';

