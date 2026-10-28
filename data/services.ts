export type Service = {
  id: string;
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  tags: { pt: string; en: string }[];
  image: string;
};

export const services: Service[] = [
  {
    id: "sites-negocios-locais",
    title: { pt: "sites para negócios locais", en: "websites for local businesses" },
    description: {
      pt: "site rápido, bonito no celular, com endereço, horário e botão de whatsapp, pronto para aparecer quando alguém busca o seu tipo de negócio na sua região.",
      en: "a fast, mobile-friendly website with your address, opening hours, and a whatsapp button, ready to appear when people search for your type of business in your area.",
    },
    tags: [
      { pt: "criação de sites", en: "website development" },
      { pt: "site para restaurante", en: "restaurant website" },
      { pt: "site para clínica", en: "clinic website" },
      { pt: "site para loja", en: "store website" },
      { pt: "seo local", en: "local seo" },
      { pt: "google meu negócio", en: "google business profile" },
    ],
    image: "/images/portfolio/delta-solucoes-desktop.png",
  },
  {
    id: "sistema-gestao-sob-medida",
    title: { pt: "software sob medida", en: "custom software" },
    description: {
      pt: "se as planilhas, os cadernos e os programas que você usa não dão mais conta, eu crio um software do jeito que o seu negócio funciona. organizo seus dados, entrego um sistema pronto, com estoque, vendas e clientes em um só lugar e um painel simples para acompanhar tudo.",
      en: "when spreadsheets, notebooks, and the tools you use are no longer enough, i build software around the way your business works. your data, inventory, sales, and customers stay organized in one place, with a simple dashboard to track everything.",
    },
    tags: [
      { pt: "software sob medida", en: "custom software" },
      { pt: "desenvolvimento de sistemas", en: "system development" },
      { pt: "sistema de gestão", en: "management system" },
      { pt: "migração de planilhas", en: "spreadsheet migration" },
      { pt: "substituir excel", en: "excel replacement" },
      { pt: "painel administrativo", en: "admin panel" },
      { pt: "dashboard", en: "dashboard" },
    ],
    image: "/images/portfolio/delta-solucoes-desktop.png",
  },
  {
    id: "cardapio-digital-pedidos-online",
    title: { pt: "cardápio digital e pedidos online", en: "digital menu and online orders" },
    description: {
      pt: "o cliente escolhe pelo celular e o pedido chega organizado para você, sem depender de marketplace nem pagar comissão em cada venda.",
      en: "customers choose from their phones and orders arrive organized, without depending on a marketplace or paying a commission on every sale.",
    },
    tags: [
      { pt: "cardápio digital", en: "digital menu" },
      { pt: "pedidos online", en: "online orders" },
      { pt: "delivery próprio", en: "direct delivery" },
      { pt: "qr code", en: "qr code" },
      { pt: "pix", en: "pix" },
    ],
    image: "/images/portfolio/genoma-covid-sc-desktop.png",
  },
  {
    id: "loja-virtual",
    title: { pt: "loja virtual", en: "online store" },
    description: {
      pt: "e-commerce com catálogo, pagamento e estoque integrados, para a loja física vender também pela internet.",
      en: "an e-commerce store with integrated catalog, payments, and inventory, so your physical store can sell online too.",
    },
    tags: [
      { pt: "loja virtual", en: "online store" },
      { pt: "e-commerce", en: "e-commerce" },
      { pt: "integração com estoque", en: "inventory integration" },
      { pt: "pix e cartão", en: "pix and cards" },
      { pt: "frete", en: "shipping" },
    ],
    image: "/images/brand.webp",
  },
  {
    id: "agendamento-automacao-whatsapp",
    title: { pt: "agendamento e automação no whatsapp", en: "whatsapp scheduling and automation" },
    description: {
      pt: "o cliente ou paciente marca o horário sozinho, recebe confirmação e lembrete pelo whatsapp, e as tarefas repetitivas (avisos de pedido, respostas, relatórios) passam a rodar sem ninguém digitar. você recebe tudo funcionando, pronto para usar.",
      en: "customers or patients book appointments on their own and receive whatsapp confirmations and reminders. repetitive tasks like order updates, replies, and reports run automatically, ready to use.",
    },
    tags: [
      { pt: "sistema de agendamento", en: "scheduling system" },
      { pt: "agenda online", en: "online calendar" },
      { pt: "chatbot whatsapp", en: "whatsapp chatbot" },
      { pt: "automação de processos", en: "process automation" },
      { pt: "confirmação automática", en: "automatic confirmation" },
      { pt: "n8n", en: "n8n" },
    ],
    image: "/images/felipe.webp",
  },
];
