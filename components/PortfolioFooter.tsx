import Image from "next/image";

export function PortfolioFooter({ backTo = "#sobre" }: { backTo?: string }) {
  return (
    <footer>
      <a href="#sobre" className="brand">
        <Image
          src="/images/brand.webp"
          alt="Felipe Goulart"
          width={40}
          height={40}
        />
      </a>
      <span className="text-xs">© {new Date().getFullYear()} felipegoulart.dev</span>
      <a href={backTo}>
        <span className="text-xs">
          voltar ao topo <span className="arrow-character" aria-hidden="true">↑︎</span>
        </span>
      </a>
    </footer>
  );
}
