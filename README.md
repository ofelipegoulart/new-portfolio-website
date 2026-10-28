# Portfólio do Felipe

Portfólio responsivo em Next.js App Router, TypeScript, Tailwind CSS e Framer Motion. O conteúdo em português e inglês fica em `data/translations.ts`; tecnologias e projetos têm seus próprios arquivos de dados.

## Rodar localmente

Requer Node.js 18.17 ou mais recente.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Para gerar a versão de produção, rode `npm run build` e depois `npm start`.

## Estrutura

- `app/`: rotas, metadata, Tailwind e estilos globais.
- `components/`: navegação, cursor, textura, fundo e componentes das seções.
- `components/sections/Sections.tsx`: Hero/Sobre, processo, tecnologias, projetos, serviços e contato.
- `data/`: dicionários PT/EN e dados tipados das tecnologias e projetos.
- `public/images/felipe.webp`: retrato otimizado do portfólio.
- `app/sitemap.ts` e `app/robots.ts`: sitemap e regras para mecanismos de busca.

Os links e endereços dos projetos são exemplos e podem ser atualizados em `data/projects.ts`. Os perfis e o e-mail de contato também são placeholders no componente de contato.

## SEO

O domínio usado nas URLs canônicas, no sitemap e no `robots.txt` é `https://felipegoulart.dev` por padrão. Para outro domínio em deploy, defina `NEXT_PUBLIC_SITE_URL`, por exemplo:

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```
