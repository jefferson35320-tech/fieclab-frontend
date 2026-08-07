// nomes dos produtos mantidos exatamente como definidos originalmente
const products = [
  {
    id: 1,
    name: "Creme de Mãos",
    category: "Higiene",
    rating: 4.6,
    ratingCount: 132,
    stock: 24,
    icon: "🧴",
    aromas: ["Neutro", "Lavanda", "Coco"],
    sizes: [
      { id: "60g", label: "60g", price: 9.9 },
      { id: "120g", label: "120g", price: 16.9 },
      { id: "250g", label: "250g", price: 27.9 },
    ],
    howToUse:
      "Aplique uma pequena quantidade sobre as mãos limpas e massageie até completa absorção. Use quantas vezes forem necessárias ao longo do dia.",
    storage:
      "Conserve em local fresco e seco, ao abrigo da luz solar direta. Mantenha o frasco bem fechado após o uso.",
    precautions:
      "Uso externo. Evite contato com os olhos e mucosas; em caso de contato, enxágue com água em abundância. Suspenda o uso em caso de irritação e consulte um médico se persistir.",
    ingredients:
      "Aqua, Glycerin, Cetyl Alcohol, Manteiga de Karité, Óleo de Amêndoas, Dimethicone, Fenoxietanol, Fragrância, Tocoferol (Vitamina E).",
  },
  {
    id: 2,
    name: "Álcool em Gel",
    category: "Higiene",
    rating: 4.8,
    ratingCount: 210,
    stock: 40,
    icon: "🧴",
    aromas: ["Neutro", "Erva-doce"],
    sizes: [
      { id: "250ml", label: "250ml", price: 7.9 },
      { id: "500ml", label: "500ml", price: 12.9 },
      { id: "1L", label: "1L", price: 21.9 },
    ],
    howToUse:
      "Aplique uma quantidade suficiente para cobrir as mãos e friccione até secar completamente, sem enxaguar.",
    storage:
      "Mantenha em local fresco, longe de fontes de calor e chama. Produto inflamável: armazene afastado de tomadas e equipamentos elétricos.",
    precautions:
      "Inflamável. Não ingerir. Evite contato com os olhos. Mantenha fora do alcance de crianças. Não utilize próximo a chamas ou fontes de calor.",
    ingredients:
      "Álcool Etílico 70° INPM, Água, Carbômero, Trietanolamina, Glicerina, Fragrância.",
  },
  {
    id: 3,
    name: "Sabonete Líquido",
    category: "Higiene",
    rating: 4.4,
    ratingCount: 98,
    stock: 15,
    icon: "🧼",
    aromas: ["Neutro", "Lavanda", "Erva-doce"],
    sizes: [
      { id: "250ml", label: "250ml", price: 9.9 },
      { id: "500ml", label: "500ml", price: 14.9 },
      { id: "1L", label: "1L (refil)", price: 24.9 },
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
    id: 4,
    name: "Shampoo",
    category: "Higiene",
    rating: 4.7,
    ratingCount: 156,
    stock: 0,
    icon: "🧴",
    aromas: ["Neutro", "Coco", "Camomila"],
    sizes: [
      { id: "350ml", label: "350ml", price: 19.9 },
      { id: "500ml", label: "500ml", price: 24.9 },
    ],
    howToUse:
      "Aplique sobre os cabelos molhados, massageie o couro cabeludo até formar espuma e enxágue bem. Se necessário, repita a aplicação.",
    storage:
      "Mantenha em local fresco e seco, ao abrigo da luz solar. Feche bem a tampa após cada uso.",
    precautions:
      "Uso externo. Evite contato com os olhos; em caso de contato, enxágue com água em abundância. Não recomendado para peles ou couro cabeludo com lesões.",
    ingredients:
      "Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Dimethicone, Panthenol, Fragrância, Conservante, Ácido Cítrico.",
  },
  {
    id: 5,
    name: "Condicionador",
    category: "Higiene",
    rating: 4.5,
    ratingCount: 140,
    stock: 18,
    icon: "🧴",
    aromas: ["Neutro", "Coco", "Camomila"],
    sizes: [
      { id: "350ml", label: "350ml", price: 19.9 },
      { id: "500ml", label: "500ml", price: 24.9 },
    ],
    howToUse:
      "Após lavar os cabelos, aplique nas pontas, deixe agir por 2 a 3 minutos e enxágue com água em abundância.",
    storage:
      "Conserve em local fresco e seco, ao abrigo da luz solar direta. Mantenha a embalagem bem fechada.",
    precautions:
      "Uso externo. Evite contato com os olhos; em caso de contato, enxágue com água em abundância. Suspenda o uso em caso de reação alérgica.",
    ingredients:
      "Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Dimethicone, Panthenol, Óleo de Coco, Fragrância, Conservante.",
  },
  {
    id: 6,
    name: "Desinfetante Multiuso",
    category: "Limpeza",
    rating: 4.2,
    ratingCount: 64,
    stock: 0,
    icon: "🧽",
    aromas: ["Lavanda", "Eucalipto", "Cítrico"],
    sizes: [
      { id: "500ml", label: "500ml", price: 8.9 },
      { id: "1L", label: "1L", price: 16.9 },
      { id: "2L", label: "2L", price: 29.9 },
    ],
    howToUse:
      "Diluir conforme indicação no rótulo e aplicar sobre a superfície a ser higienizada com um pano ou borrifador. Não é necessário enxaguar em superfícies não porosas.",
    storage:
      "Armazene em local fresco, seco e ventilado, longe do alcance de crianças e animais domésticos, e afastado de alimentos.",
    precautions:
      "Não ingerir. Não misture com outros produtos de limpeza, especialmente à base de cloro. Use luvas em caso de pele sensível. Mantenha fora do alcance de crianças.",
    ingredients:
      "Água, Tensoativo Aniônico, Cloreto de Alquil Dimetil Benzil Amônio, Fragrância, Corante, Conservante.",
  },
  {
    id: 7,
    name: "Detergente",
    category: "Limpeza",
    rating: 4.3,
    ratingCount: 88,
    stock: 60,
    icon: "🧴",
    aromas: ["Neutro", "Limão"],
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
    id: 8,
    name: "Papel Higiênico",
    category: "Higiene",
    rating: 4.9,
    ratingCount: 302,
    stock: 12,
    icon: "🧻",
    aromas: [],
    sizes: [
      { id: "4un", label: "4 rolos", price: 12.9 },
      { id: "12un", label: "12 rolos", price: 34.9 },
      { id: "16un", label: "16 rolos", price: 44.9 },
    ],
    howToUse:
      "Produto de uso pessoal para higiene. Utilize conforme a necessidade.",
    storage:
      "Armazene em local seco, protegido da umidade, para preservar a qualidade do papel.",
    precautions: "Não utilizar para outros fins que não a higiene pessoal.",
    ingredients: "Fibras celulósicas 100% biodegradáveis.",
  },
];

export default products;
