import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOMetadata } from "@/components/SEOMetadata";

const EditorialLinePage = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title="Linha Editorial | Sem Filtros"
                description="Conheça os princípios e a ética jornalística do portal Sem Filtros."
            />
            <Header />
            <main className="container py-12 max-w-4xl">
                <h1 className="text-3xl font-heading font-black uppercase tracking-tighter border-b-4 border-primary pb-2 mb-8">
                    Linha Editorial
                </h1>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mt-8">
                    <p className="text-lg leading-relaxed text-foreground/90">
                        O portal <strong>Sem Filtros</strong> pauta a sua atuação pelo jornalismo independente, incisivo e sem amarras.
                        A nossa prioridade absoluta é <strong>salvaguardar o bem-estar, a dignidade e os direitos do povo angolano em primeiro lugar</strong>, 
                        através de uma informação rigorosa, transparente e profundamente crítica em relação aos actos de governação e à gestão da causa pública.
                    </p>
                    <h3 className="text-xl font-heading font-bold mt-8 mb-4">Os Nossos Princípios Fundamentais</h3>
                    <ul className="space-y-4">
                        <li className="p-4 bg-secondary/60 border border-border rounded-lg">
                            <strong className="text-primary block text-base mb-1">1. O Bem-Estar do Povo em Primeiro Lugar:</strong>
                            Toda a análise e cobertura jornalística é feita com foco nas consequências reais para a vida das populações angolanas, denunciando atropelos aos seus direitos e exigindo justiça social.
                        </li>
                        <li className="p-4 bg-secondary/60 border border-border rounded-lg">
                            <strong className="text-primary block text-base mb-1">2. Análise Sem Filtros:</strong>
                            Rejeitamos discursos oficiais higienizados, propaganda ou parcialidades partidárias. Oferecemos uma leitura desassombrada, objetiva e transparente da realidade política, económica e social de Angola.
                        </li>
                        <li className="p-4 bg-secondary/60 border border-border rounded-lg">
                            <strong className="text-primary block text-base mb-1">3. Escrutínio e Prestação de Contas:</strong>
                            Fiscalizamos com rigor e isenção a atuação dos órgãos de soberania, governantes e instituições públicas, apontando contradições, falhas de gestão e promovendo a transparência.
                        </li>
                        <li className="p-4 bg-secondary/60 border border-border rounded-lg">
                            <strong className="text-primary block text-base mb-1">4. Veracidade e Independência Absoluta:</strong>
                            Apuramos os factos junto de fontes fidedignas e recusamos qualquer interferência financeira, governamental ou partidária na orientação da nossa redacção.
                        </li>
                    </ul>
                    <p className="mt-8 text-base text-muted-foreground">
                        A nossa missão é servir de farol de verdade para a sociedade angolana, expondo a realidade tal como ela é, sem filtros e sem preconceitos.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditorialLinePage;
