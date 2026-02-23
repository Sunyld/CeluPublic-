/**
 * Constantes do CeluPublic.
 */

export const APP_NAME = 'CeluPublic';

export const CONTACT_INFO = {
  WHATSAPP: '+258 87 833 0517',
  WHATSAPP_RAW: '258878330517',
  WHATSAPP_LINK: 'https://wa.me/258878330517?text=Olá!%20Acabei%20de%20fazer%20o%20pagamento%20da%20taxa%20de%2020MT%20para%20ativação%20da%20minha%20conta.%20Pode%20ajudar-me?',
  EMAIL: 'celupublic@gmail.com',
  SUPPORT_SEC: 'celupublic@gmail.com',
} as const;

export const LIMITS = {
  MAX_PRODUCTS: 10,
  MAX_SERVICES: 5,
  MAX_AD_IMAGES: 5,
  ACTIVATION_FEE_MT: 20,
} as const;

/** Províncias de Moçambique (para select no cadastro) */
export const PROVINCIAS_MOCAMBIQUE = [
  'Cabo Delgado',
  'Gaza',
  'Inhambane',
  'Manica',
  'Maputo',
  'Maputo Cidade',
  'Nampula',
  'Niassa',
  'Sofala',
  'Tete',
  'Zambézia',
] as const;

/** Cidades por província (para select no anúncio). Province -> cities. */
export const CIDADES_POR_PROVINCIA: Record<string, string[]> = {
  'Cabo Delgado': ['Pemba', 'Montepuez', 'Mocímboa da Praia', 'Chinde'],
  'Gaza': ['Xai-Xai', 'Chókwè', 'Macia', 'Chibuto'],
  'Inhambane': ['Inhambane', 'Maxixe', 'Vilanculos', 'Massinga'],
  'Manica': ['Chimoio', 'Manica', 'Gondola', 'Sussundenga'],
  'Maputo': ['Matola', 'Boane', 'Manhiça', 'Marracuene', 'Namaacha'],
  'Maputo Cidade': ['Maputo', 'KaMavota', 'KaMubukwana', 'KaMaxakeni', 'KaMphumo', 'KaTembe', 'KaNyaka'],
  'Nampula': ['Nampula', 'Nacala', 'Angoche', 'Monapo', 'Mozambique'],
  'Niassa': ['Lichinga', 'Cuamba', 'Metangula'],
  'Sofala': ['Beira', 'Dondo', 'Nhamatanda', 'Chibabava'],
  'Tete': ['Tete', 'Moatize', 'Angónia', 'Zumbo'],
  'Zambézia': ['Quelimane', 'Mocuba', 'Gurúè', 'Milange', 'Nicoadala'],
};

export const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e2e8f0/64748b?text=Sem+imagem';
