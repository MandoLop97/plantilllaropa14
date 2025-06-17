
import { Product } from '../types';

export const products: Product[] = [
  // Camisetas
  {
    id: '1',
    name: 'Camiseta Oversize Negra',
    price: 550,
    originalPrice: 700,
    image: 'https://sdmntprcentralus.oaiusercontent.com/files/00000000-04ec-61f5-b5d1-a6d4807931ab/raw?se=2025-05-26T06%3A37%3A24Z&sp=r&sv=2024-08-04&sr=b&scid=5d0ea780-6d57-5d4e-8430-e3cdac17684d&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-25T23%3A21%3A24Z&ske=2025-05-26T23%3A21%3A24Z&sks=b&skv=2024-08-04&sig=Ia2vAxXmF0dGggpJntloSxhkRqiLfz6czB7qclMQE0s%3D',
    description: 'Camiseta oversize de algodón premium, perfecta para un look urbano relajado. Tela suave y cómoda.',
    categoryId: '1',
    category: 'camisetas',
    sku: 'cam-over-001',
    discount: 21
  },
  {
    id: '2',
    name: 'Camiseta Básica Blanca',
    price: 350,
    image: 'https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-4eb0-622f-98a0-a0359ad44fbf/raw?se=2025-05-26T06%3A39%3A36Z&sp=r&sv=2024-08-04&sr=b&scid=ee126255-8c53-5f65-87e0-60348e12923a&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-25T23%3A22%3A48Z&ske=2025-05-26T23%3A22%3A48Z&sks=b&skv=2024-08-04&sig=bMld4ovxwoRy540qErLe1jnYxgLKJwGBcD4PI9CHLE4%3D',
    description: 'Camiseta básica de corte clásico en algodón 100%. Esencial para cualquier guardarropa urbano.',
    categoryId: '1',
    category: 'camisetas',
    sku: 'cam-bas-002'
  },
  {
    id: '3',
    name: 'Camiseta Gráfica Limited',
    price: 650,
    originalPrice: 800,
    image: 'https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-5cfc-622f-b804-38cd58e25c33/raw?se=2025-05-26T06%3A34%3A25Z&sp=r&sv=2024-08-04&sr=b&scid=5775d85f-c40b-55fa-b46e-436fecc6250f&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-25T23%3A15%3A49Z&ske=2025-05-26T23%3A15%3A49Z&sks=b&skv=2024-08-04&sig=sfChoh%2Bn5yUNylQVIVLgggX7PKb5m1s3/qIXSvM74co%3D',
    description: 'Edición limitada con diseño exclusivo. Perfecta para destacar con estilo único.',
    categoryId: '1',
    category: 'camisetas',
    sku: 'cam-graf-003',
    discount: 19
  },
  
  // Gorras
  {
    id: '4',
    name: 'Gorra Snapback Negra',
    price: 200,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop',
    description: 'Gorra snapback clásica con bordado frontal. Ajuste perfecto para todos los estilos.',
    categoryId: '2',
    category: 'gorras',
    sku: 'gor-snap-004'
  },
  {
    id: '5',
    name: 'Gorra Dad Hat Beige',
    price: 180,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop',
    description: 'Gorra dad hat en tono beige, perfecta para looks casuales y relajados.',
    categoryId: '2',
    category: 'gorras',
    sku: 'gor-dad-005',
    discount: 18
  },
  
  // Accesorios
  {
    id: '6',
    name: 'Bandolera Urban',
    price: 450,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    description: 'Bandolera práctica y con estilo urbano. Perfecta para llevar lo esencial con comodidad.',
    categoryId: '3',
    category: 'accesorios',
    sku: 'acc-band-006'
  },
  {
    id: '7',
    name: 'Cadena Plata 925',
    price: 890,
    originalPrice: 1100,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',
    description: 'Cadena de plata 925 con diseño moderno. Complemento perfecto para cualquier outfit.',
    categoryId: '3',
    category: 'accesorios',
    sku: 'acc-cad-007',
    discount: 19
  },
  
  // Promociones
  {
    id: '8',
    name: 'Pack Verano 2024',
    price: 800,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    description: 'Pack especial: 2 camisetas + 1 gorra. Oferta limitada por tiempo limitado.',
    categoryId: '4',
    category: 'promociones',
    sku: 'pack-ver-008',
    discount: 33
  },
  {
    id: '9',
    name: 'Pack Verano 2025',
    price: 800,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    description: 'Pack especial: 2 camisetas + 1 gorra. Oferta limitada por tiempo limitado.',
    categoryId: '4',
    category: 'promociones',
    sku: 'pack-ver-009',
    discount: 33
  },
  {
    id: '10',
    name: 'Pack Invierno 2025',
    price: 800,
    originalPrice: 1200,
    image: 'https://sdmntprwestcentralus.oaiusercontent.com/files/00000000-92c8-61fb-a21e-1960582a34f6/raw?se=2025-05-26T06%3A21%3A57Z&sp=r&sv=2024-08-04&sr=b&scid=effc6b7a-9755-5e8f-afb1-7b80ff2d5fd0&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-25T23%3A21%3A23Z&ske=2025-05-26T23%3A21%3A23Z&sks=b&skv=2024-08-04&sig=1ws5m8G6K%2BD3jXGcTghqwgMptbbvzSTUAqZxVahUynE%3D',
    description: 'Pack especial: 2 camisetas + 1 gorra. Oferta limitada por tiempo limitado.',
    categoryId: '4',
    category: 'promociones',
    sku: 'pack-inv-008',
    discount: 33
  },
  {
    id: '11',
    name: 'Pack Otoño 2024',
    price: 800,
    originalPrice: 1200,
    image: 'https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-4c7c-622f-9bfd-d533f9773e73/raw?se=2025-05-26T06%3A26%3A51Z&sp=r&sv=2024-08-04&sr=b&scid=f531c9f9-2461-5157-ba7d-524f812b2dc0&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-25T10%3A09%3A17Z&ske=2025-05-26T10%3A09%3A17Z&sks=b&skv=2024-08-04&sig=B8zArTX2TUptQX3Jyw7uVWLClWDgiINTrqOHfA1Kyfw%3D',
    description: 'Pack especial: 2 camisetas + 1 gorra. Oferta limitada por tiempo limitado.',
    categoryId: '4',
    category: 'promociones',
    sku: 'pack-oto-008',
    discount: 33
  }
];

// Re-exportar categorías para compatibilidad
export { categories } from './categories';
