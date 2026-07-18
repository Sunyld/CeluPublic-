import type { CategoryIconSuggestion } from '@/types';

const categoryIconMap: Record<string, string> = {
  // Eletrônicos e Informática
  'telemóveis': 'smartphone',
  'celulares': 'smartphone',
  'smartphones': 'smartphone',
  'computadores': 'laptop',
  'laptops': 'laptop',
  'tablets': 'tablet',
  'tvs': 'tv',
  'televisões': 'tv',
  'headphones': 'headphones',
  'fones de ouvido': 'headphones',
  'caixas de som': 'speaker',
  'câmeras': 'camera',
  'games': 'gamepad',
  'videogames': 'gamepad',
  'impressoras': 'printer',
  'monitores': 'monitor',
  'processadores': 'cpu',
  'relógios': 'watch',
  'eletrônicos': 'smartphone',
  'informática': 'laptop',
  // Moda, Calçados e Acessórios
  'moda': 'shirt',
  'roupas': 'shirt',
  'calçados': 'footprints',
  'mochilas': 'backpack',
  'malas': 'handbag',
  'carteiras': 'wallet',
  // Casa e Móveis
  'casa': 'home',
  'móveis': 'sofa',
  'sofas': 'sofa',
  'camas': 'bed',
  'poltronas': 'armchair',
  'mesas': 'table',
  'lâmpadas': 'lamp',
  'iluminação': 'lightbulb',
  // Automóveis e Transporte
  'automóveis': 'car',
  'carros': 'car',
  'motos': 'motorcycle',
  // Comida, Sobremesas e Buquês
  'alimentação': 'utensils',
  'restaurantes': 'utensils',
  'comida': 'utensils-crossed',
  'sobremesas': 'cake',
  'pizzas': 'pizza',
  'sorvetes': 'ice-cream',
  'café': 'coffee',
  'buquês e mimos': 'flower',
  'buquês': 'flower',
  'flores': 'flower',
  'mimos': 'gift',
  // Saúde, Beleza e Material Médico
  'saúde': 'heart',
  'beleza': 'droplet',
  'cosméticos': 'palette',
  'material médico': 'stethoscope',
  'material-medico': 'stethoscope',
  'salão de beleza': 'comb',
  'salão de beleza m/f': 'comb',
  'tranças/cabelo/moda': 'scissors',
  'cabelo': 'comb',
  'tranças': 'scissors',
  // Esportes e Lazer
  'desporto': 'trophy',
  'esportes': 'trophy',
  'academia': 'dumbbell',
  // Ornamentação, Coreografia e Festa
  'ornamentação e coreografia': 'sparkles',
  'ornamentação': 'sparkles',
  'coreografia': 'sparkles',
  'festa': 'party-popper',
  // Livros e Mídia
  'livros': 'book',
  'livros📖': 'book',
  'midia social': 'music',
  'mídia social': 'music-2',
  // Serviços e Negócios
  'serviços': 'briefcase',
  'lojas': 'store',
  'entregas': 'truck',
  'pagamentos': 'credit-card',
  'dinheiro': 'banknote',
  // Outros
  'outros': 'tag',
  'outros🤔': 'tag',
  'presentes': 'gift',
  'pessoas': 'users',
  'localização': 'map-pin',
  'contato': 'phone',
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
