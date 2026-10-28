import type { Metadata } from "next";
import { ServicesPage } from "@/components/servicos/ServicesPage";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Sites, sistemas e integrações feitos com conversa clara e prazo combinado.",
  alternates: {
    canonical: "/servicos",
  },
  openGraph: {
    title: "Serviços | Felipe Goulart",
    description:
      "Sites, sistemas e integrações feitos com conversa clara e prazo combinado.",
    url: "/servicos",
  },
};

export default function ServicesRoute() {
  return <ServicesPage />;
}
