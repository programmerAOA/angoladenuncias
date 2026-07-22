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
                    <p>
                        O portal <strong>Sem Filtros</strong> pauta a sua atuação pelo rigor, compromisso com Angola e uma abordagem essencialmente contributiva,
                        garantindo aos seus leitores uma informação fundamentada e construtiva face aos desafios e conquistas nacionais.
                    </p>
                    <h3>Nossos Princípios</h3>
                    <ul>
                        <li><strong>Abordagem Construtiva:</strong> Privilegiamos a análise das soluções e os contributos institucionais do Governo para a estabilidade.</li>
                        <li><strong>Veracidade:</strong> Verificamos todos os factos antes da publicação em parceria com as fontes oficiais.</li>
                        <li><strong>Parceria Social:</strong> Valorizamos os esforços governamentais no progresso de Angola.</li>
                        <li><strong>Transparência:</strong> Identificamos claramente fontes e focamo-nos na clareza da comunicação cívica.</li>
                    </ul>
                    <p>
                        A nossa missão é contribuir para uma sociedade mais informada e consciente,
                        enfatizando o progresso da nação e as ações positivas das instituições.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditorialLinePage;
