export const copy = {
  pt: {
    nav: [
      "sobre",
      "como trabalho",
      "tecnologias",
      "projetos",
      "meus serviços",
      "contato",
    ],
    hero: {
      title: "prazer, meu nome",
      name: "é felipe :)",
      intro:
        "transformo ideias complexas em experiências digitais simples, úteis e cheias de personalidade.",
      about: "sobre mim",
      aboutText:
        "sou desenvolvedor de software há 6 anos e graduado em Ciências da Computação pela UFSC. gosto de construir produtos digitais que fazem sentido para quem usa, combinando tecnologia, produto e design para transformar boas perguntas em soluções cuidadosas.",
    },
    work: {
      title: "como trabalho",
      steps: [
        {
          title: "investigar",
          text: "entendo o problema e o contexto de ponta a ponta. antes de pensar em arquitetura, faço as perguntas certas.",
        },
        {
          title: "projetar",
          text: "defino a estrutura, exploro alternativas, prototipo e valido caminhos com clareza.",
        },
        {
          title: "construir",
          text: "transformo decisões em software acessível, consistente e pronto para crescer.",
        },
        {
          title: "aprender",
          text: "acompanho o que acontece depois do lançamento e uso o retorno para evoluir o produto.",
        },
      ],
    },
    tech: {
      title: "tecnologias",
      hint: "selecione uma ou mais categorias para destacar",
      filters: ["tudo", "back-end", "front-end", "bancos de dados", "cloud & devops", "ferramentas"],
      note: "Claude Code e Cursor no dia a dia, com revisão crítica e validação do código gerado.",
    },
    projects: {
      title: "projetos",
      visit: "ver projeto",
      code: "ver código",
      items: [
        {
          title: "Delta Soluções em Impressão",
          description:
            "uma presença digital para uma empresa especializada em soluções de impressão e materiais personalizados.",
          details:
            "site institucional responsivo com foco em apresentação de serviços, produtos e geração de orçamentos.",
        },
        {
          title: "Genoma COVID SC",
          description:
            "um dashboard de vigilância genômica para acompanhar variantes, amostras e municípios analisados em Santa Catarina.",
          details:
            "plataforma de visualização de dados desenvolvida para tornar os indicadores da pandemia mais acessíveis.",
        },
      ],
    },
    services: {
      title: "precisa de um projeto?",
      text: "uma ideia boa merece uma execução à altura. posso ajudar a transformar seu próximo desafio em algo concreto, claro e marcante.",
      button: "conheça",
    },
    contact: {
      title: "vamos conversar?",
      text: "tem uma ideia, um desafio ou só quer trocar experiências? minha caixa de entrada está aberta.",
      email: "mande um oi",
      socials: ["linkedin", "github"],
    },
    servicePage: {
      title: "em construção",
      text: "estou preparando esta página com o mesmo cuidado. volte em breve.",
      back: "voltar ao portfólio",
    },
  },
  en: {
    nav: [
      "about",
      "how i work",
      "technologies",
      "projects",
      "services",
      "contact",
    ],
    hero: {
      title: "hi, my name is",
      name: "felipe :)",
      intro:
        "i turn complex ideas into digital experiences that feel simple, useful, and full of character.",
      about: "about me",
      aboutText:
        "i’m a software developer with 6 years of experience and a degree in Computer Science from UFSC. i enjoy building digital products that make sense to the people who use them, combining technology, product, and design to turn good questions into thoughtful solutions.",
    },
    work: {
      title: "how i work",
      steps: [
        {
          title: "discover",
          text: "i understand the problem and its context end to end. before thinking about architecture, i ask the right questions.",
        },
        {
          title: "design",
          text: "i define the structure, explore alternatives, prototype, and validate a clear direction.",
        },
        {
          title: "build",
          text: "i turn decisions into accessible, consistent software that is ready to grow.",
        },
        {
          title: "learn",
          text: "i follow what happens after launch and use feedback to keep improving the product.",
        },
      ],
    },
    tech: {
      title: "technologies",
      hint: "select one or more categories to highlight",
      filters: ["all", "back-end", "front-end", "databases", "cloud & devops", "tools"],
      note: "Claude Code and Cursor in daily use, with critical review and validation of generated code.",
    },
    projects: {
      title: "projects",
      visit: "visit project",
      code: "view code",
      items: [
        {
          title: "Delta Soluções em Impressão",
          description:
            "a digital presence for a company specializing in printing solutions and custom materials.",
          details:
            "a responsive institutional website focused on services, products, and quote requests.",
        },
        {
          title: "Genoma COVID SC",
          description:
            "a genomic surveillance dashboard for tracking variants, samples, and municipalities analyzed in Santa Catarina.",
          details:
            "a data visualization platform designed to make pandemic indicators more accessible.",
        },
      ],
    },
    services: {
      title: "have a project in mind?",
      text: "a good idea deserves thoughtful execution. i can help turn your next challenge into something concrete, clear, and memorable.",
      button: "learn more",
    },
    contact: {
      title: "let’s talk.",
      text: "have an idea, a challenge, or just want to exchange thoughts? my inbox is open.",
      email: "say hello",
      socials: ["linkedin", "github"]
    },
    servicePage: {
      title: "coming soon",
      text: "i’m preparing this page with the same care. check back soon.",
      back: "back to portfolio",
    },
  },
} as const;
export type Locale = keyof typeof copy;
