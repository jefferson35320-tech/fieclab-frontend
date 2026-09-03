// Catálogo real de produtos FIEC - Fábrica Escola de Química
// OBS: preços marcados como "editar" são placeholders - ajuste os valores reais antes de publicar.
const products = [
  {
    id: 1,
    name: "Sabonete Líquido",
    category: "Higiene",
    rating: 4.7,
    ratingCount: 184,
    stock: 30,
    icon: "🧼",
    image: "/images/products/sabonete-liquido.jpg",
    variantImages: {
      "320ml|Alfazema": [
        "/images/products/variants/sabonete-liquido-320ml-alfazema.jpg",
        "/images/products/variants/sabonete-liquido-320ml-alfazema-verso.jpg",
      ],
      "320ml|Capim-limão": [
        "/images/products/variants/sabonete-liquido-320ml-capim-limao.jpg",
        "/images/products/variants/sabonete-liquido-320ml-capim-limao-verso.jpg",
      ],
      "320ml|Frutas Vermelhas": [
        "/images/products/variants/sabonete-liquido-320ml-frutas-vermelhas.jpg",
        "/images/products/variants/sabonete-liquido-320ml-frutas-vermelhas-verso.jpg",
      ],
      "320ml|Mirra": [
        "/images/products/variants/sabonete-liquido-320ml-mirra.jpg",
        "/images/products/variants/sabonete-liquido-320ml-mirra-verso.jpg",
      ],
      "320ml|Tutti-frutti": [
        "/images/products/variants/sabonete-liquido-320ml-tutti-frutti.jpg",
      ],
      "2L|Alfazema": ["/images/products/variants/sabonete-liquido-2L-alfazema.jpg"],
      "2L|Erva-doce": ["/images/products/variants/sabonete-liquido-2L-erva-doce.jpg"],
      "2L|Mirra": ["/images/products/variants/sabonete-liquido-2L-mirra.jpg"],
    },
    aromas: ["Alfazema", "Erva-doce", "Mirra", "Capim-limão", "Frutas Vermelhas", "Tutti-frutti"],
    sizes: [
      { id: "320ml", label: "320ml", price: 9.9 },
      { id: "2L", label: "2L (refil)", price: 24.9 },
    ],
    howToUse:
      "Aplique sobre a pele úmida, massageie suavemente até formar espuma e enxágue com água em abundância.",
    storage:
      "Conserve em local fresco e arejado. Mantenha o frasco fechado quando não estiver em uso.",
    precautions:
      "Uso externo. Evite contato com os olhos; em caso de contato, enxágue imediatamente com água. Interrompa o uso em caso de sensibilidade ou irritação.",
    ingredients:
      "Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glicerina, Cloreto de Sódio, Fragrância, Conservante, Corante.",
  },
  {
    id: 2,
    name: "Detergente",
    category: "Limpeza",
    rating: 4.5,
    ratingCount: 121,
    stock: 50,
    icon: "🧴",
    image: "/images/products/detergente.jpg",
    variantImages: {
      "500ml|Coco": ["/images/products/variants/detergente-500ml-coco.jpg"],
      "500ml|Laranja": ["/images/products/variants/detergente-500ml-laranja.jpg"],
      "500ml|Limão": ["/images/products/variants/detergente-500ml-limao.jpg"],
      "500ml|Neutro": ["/images/products/variants/detergente-500ml-neutro.jpg"],
      "5L|Laranja": ["/images/products/variants/detergente-5L-laranja.jpg"],
    },
    aromas: ["Neutro", "Coco", "Laranja", "Limão"],
    sizes: [
      { id: "500ml", label: "500ml", price: 3.9 },
      { id: "5L", label: "5L (galão)", price: 32.9 },
    ],
    howToUse:
      "Aplique diretamente na esponja ou dilua em água para lavar louças e utensílios. Enxágue em água corrente após o uso.",
    storage:
      "Mantenha em local fresco e seco, longe do alcance de crianças e animais domésticos.",
    precautions:
      "Não ingerir. Evite contato prolongado com a pele; em caso de irritação, enxágue com água. Mantenha fora do alcance de crianças.",
    ingredients:
      "Água, Tensoativo Aniônico e Não Iônico, Cloreto de Sódio, Fragrância, Corante, Conservante.",
  },
  {
    id: 3,
    name: "Água para Lençóis",
    category: "Casa",
    rating: 4.6,
    ratingCount: 58,
    stock: 20,
    icon: "💦",
    image: "/images/products/agua-para-lencois.jpg",
    variantImages: {
      "500ml|Bambo": [
        "/images/products/variants/agua-para-lencois-500ml-bambo.jpg",
        "/images/products/variants/agua-para-lencois-500ml-bambo-verso.jpg",
      ],
      "500ml|Garden": ["/images/products/variants/agua-para-lencois-500ml-garden.jpg"],
    },
    aromas: ["Bambo", "Garden"],
    sizes: [{ id: "500ml", label: "500ml", price: 12.9 }],
    howToUse:
      "Borrife sobre lençóis, cortinas e tecidos em geral a uma distância de cerca de 20 cm, até leve umedecimento.",
    storage:
      "Conserve em local fresco e ao abrigo da luz solar direta. Mantenha o frasco bem fechado após o uso.",
    precautions:
      "Uso externo em tecidos. Evite contato com os olhos. Não aplique diretamente sobre a pele. Mantenha fora do alcance de crianças.",
    ingredients:
      "Aqua, Álcool, Fragrância, Conservante.",
  },
  {
    id: 4,
    name: "Amaciante de Roupas",
    category: "Limpeza",
    rating: 4.8,
    ratingCount: 96,
    stock: 15,
    icon: "🧺",
    image: "/images/products/amaciante-de-roupas.jpg",
    aromas: [],
    sizes: [{ id: "5L", label: "5L", price: 39.9 }],
    howToUse:
      "Adicione ao ciclo de lavagem manual ou na máquina, no compartimento próprio, seguindo as indicações do rótulo.",
    storage:
      "Armazene em local fresco e seco, longe do alcance de crianças e animais domésticos.",
    precautions:
      "Não ingerir. Não utilize diretamente sobre a pele. Em caso de contato com os olhos, enxágue com água em abundância.",
    ingredients:
      "Água, Tensoativo Catiônico, Cloreto de Diaquil Dimetil Amônio, Corante, Fragrância, Conservante.",
  },
  {
    id: 5,
    name: "Creme para Massagem",
    category: "Higiene",
    rating: 4.7,
    ratingCount: 73,
    stock: 22,
    icon: "🧴",
    image: "/images/products/creme-para-massagem.jpg",
    aromas: ["Arnica"],
    sizes: [{ id: "120g", label: "120g", price: 15.9 }],
    howToUse:
      "Aplique sobre a região desejada e massageie suavemente até completa absorção. Pode ser reaplicado conforme a necessidade.",
    storage:
      "Conserve em local fresco e seco, ao abrigo da luz solar direta. Mantenha bem fechado após o uso.",
    precautions:
      "Uso externo. Hipoalergênico e dermatologicamente testado. Evite contato com os olhos e mucosas. Suspenda o uso em caso de irritação.",
    ingredients:
      "Aqua, Extrato de Arnica, Cetil Álcool, Dimethicone, Fenoxietanol, Fragrância.",
  },
  {
    id: 6,
    name: "Desinfetante e Limpador",
    category: "Limpeza",
    rating: 4.6,
    ratingCount: 110,
    stock: 18,
    icon: "🧽",
    image: "/images/products/desinfetante-e-limpador.jpg",
    aromas: ["Lavanda"],
    sizes: [{ id: "5L", label: "5L", price: 34.9 }],
    howToUse:
      "Para desinfecção de vasos sanitários, ralos e pias, deixe agir por 10 minutos. Para limpeza geral, aplique sobre a superfície com um pano ou borrifador.",
    storage:
      "Armazene em local fresco, seco e ventilado, longe do alcance de crianças e animais domésticos.",
    precautions:
      "Não ingerir. Não misture com outros produtos de limpeza. Evite contato com olhos e pele. Mantenha fora do alcance de crianças.",
    ingredients:
      "Água, Cloreto de Benzalcônio, Tensoativos, Fragrância, Corante.",
  },
  {
    id: 7,
    name: "Loção Repelente Hidratante",
    category: "Higiene",
    rating: 4.5,
    ratingCount: 47,
    stock: 26,
    icon: "🦟",
    image: "/images/products/locao-repelente-hidratante.jpg",
    variantImages: {
      "120g|Icaridina": [
        "/images/products/variants/locao-repelente-hidratante-120g-icaridina-frente.jpg",
        "/images/products/variants/locao-repelente-hidratante-120g-icaridina-verso.jpg",
      ],
    },
    aromas: ["Icaridina"],
    sizes: [{ id: "120g", label: "120g", price: 19.9 }],
    howToUse:
      "Aplique sobre a pele exposta, evitando olhos e mucosas. Reaplique conforme a necessidade, especialmente após contato com água.",
    storage:
      "Conserve em local fresco e seco, ao abrigo da luz solar direta.",
    precautions:
      "Hipoalergênico e dermatologicamente testado. Uso externo. Não aplique sobre pele lesionada. Mantenha fora do alcance de crianças.",
    ingredients:
      "Aqua, Icaridina, Glicerina, Dimethicone, Fenoxietanol, Fragrância.",
  },
  {
    id: 8,
    name: "Loção Repelente Spray",
    category: "Higiene",
    rating: 4.4,
    ratingCount: 39,
    stock: 26,
    icon: "🦟",
    image: "/images/products/locao-repelente-spray.jpg",
    variantImages: {
      "120ml|Citronela": [
        "/images/products/variants/locao-repelente-spray-120ml-citronela-frente.jpg",
        "/images/products/variants/locao-repelente-spray-120ml-citronela-verso.jpg",
      ],
    },
    aromas: ["Citronela"],
    sizes: [{ id: "120ml", label: "120ml", price: 17.9 }],
    howToUse:
      "Borrife sobre a pele exposta, a uma distância de 10 a 15 cm, evitando olhos e mucosas. Reaplique conforme a necessidade.",
    storage:
      "Conserve em local fresco e seco, ao abrigo da luz solar direta.",
    precautions:
      "Uso externo. Não aplique sobre pele lesionada. Evite contato com os olhos. Mantenha fora do alcance de crianças.",
    ingredients:
      "Aqua, Óleo de Citronela, Álcool, Fragrância, Conservante.",
  },
  {
    id: 9,
    name: "Multiuso",
    category: "Limpeza",
    rating: 4.5,
    ratingCount: 82,
    stock: 35,
    icon: "🧽",
    image: "/images/products/multiuso.jpg",
    variantImages: {
      "500ml|Algas": ["/images/products/variants/multiuso-500ml-algas.jpg"],
      "500ml|Maçã Verde": ["/images/products/variants/multiuso-500ml-maca-verde.jpg"],
    },
    aromas: ["Algas", "Maçã Verde"],
    sizes: [{ id: "500ml", label: "500ml", price: 6.9 }],
    howToUse:
      "Aplique diretamente sobre a superfície e limpe com um pano. Para sujeiras mais difíceis, deixe agir por alguns minutos antes de remover.",
    storage:
      "Mantenha em local fresco e seco, longe do alcance de crianças e animais domésticos.",
    precautions:
      "Não ingerir. Evite contato prolongado com a pele. Mantenha fora do alcance de crianças.",
    ingredients:
      "Água, Tensoativo Aniônico, Fragrância, Corante, Conservante.",
  },
  {
    id: 10,
    name: "Gel Antisséptico",
    category: "Higiene",
    rating: 4.8,
    ratingCount: 165,
    stock: 45,
    icon: "🧴",
    image: "/images/products/gel-antisseptico.jpg",
    variantImages: {
      "30ml|Maçã Verde": ["/images/products/variants/gel-antisseptico-30ml-maca-verde.jpg"],
      "30ml|Laranja": ["/images/products/variants/gel-antisseptico-30ml-laranja.jpg"],
      "30ml|Frutas Vermelhas": [
        "/images/products/variants/gel-antisseptico-30ml-frutas-vermelhas.jpg",
      ],
    },
    aromas: ["Maçã Verde", "Laranja", "Frutas Vermelhas"],
    sizes: [{ id: "30ml", label: "30ml", price: 5.9 }],
    howToUse:
      "Aplique uma quantidade suficiente para cobrir as mãos e friccione até secar completamente, sem enxaguar. Com hidratante para mãos protegidas.",
    storage:
      "Mantenha em local fresco, longe de fontes de calor e chama.",
    precautions:
      "Inflamável. Não ingerir. Evite contato com os olhos. Mantenha fora do alcance de crianças. Não utilize próximo a chamas.",
    ingredients:
      "Álcool Etílico, Água, Carbômero, Trietanolamina, Glicerina, Fragrância.",
  },
];

export default products;
