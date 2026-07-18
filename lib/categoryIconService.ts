import type { CategoryIconSuggestion } from '@/types';

const categoryIconMap: Record<string, string> = {
  'telemóveis': 'smartphone',
  'moda': 'shirt',
  'automóveis': 'car',
  'casa': 'home',
  'computadores': 'laptop',
  'serviços': 'briefcase',
  'saúde': 'heart',
  'desporto': 'trophy',
};

export class CategoryIconService {
  static suggestIcon(categoryName: string): CategoryIconSuggestion {
    const normalizedName = categoryName.toLowerCase().trim();
    const iconName = categoryIconMap[normalizedName] || 'tag';
    return {
      name: iconName,
      library: 'lucide',
      fallback: 'tag',
    };
  }
}
