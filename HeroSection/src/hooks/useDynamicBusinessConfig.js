export function useDynamicBusinessConfig() {
  return {
    loading: false,
    error: null,
    name: 'Urban Style',
    description: 'Tu rincón de verduras frescas y saludables',
    banner: {
      url: 'https://yxrkezxytovaxlpjnbda.supabase.co/storage/v1/object/public/infonegocio/Banner/b73218d6-186e-4bc0-8956-4b3db300abb4/1748140454942.png',
      alt: 'Banner del negocio',
    },
    logo: {
      url: 'https://yxrkezxytovaxlpjnbda.supabase.co/storage/v1/object/public/infonegocio/Logo/b73218d6-186e-4bc0-8956-4b3db300abb4/1748140857465.png',
      alt: 'Logo del negocio',
    },
  };
}
