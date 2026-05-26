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
                        O portal <strong>Sem Filtros</strong> pauta a sua atuação pelo rigor, isenção e objetividade,
                        garantindo aos seus leitores uma informação livre de censura e compromissos que não sejam com a verdade.
                    </p>
                    <h3>Nossos Princípios</h3>
                    <ul>
                        <li><strong>Independência:</strong> Não estamos ligados a grupos políticos ou económicos.</li>
                        <li><strong>Veracidade:</strong> Verificamos todos os factos antes da publicação.</li>
                        <li><strong>Respeito:</strong> Valorizamos a dignidade humana e o contraditório.</li>
                        <li><strong>Transparência:</strong> Identificamos claramente fontes e opiniões.</li>
                    </ul>
                    <p>
                        A nossa missão é contribuir para uma sociedade mais informada e consciente,
                        promovendo o debate saudável e a fiscalização dos poderes públicos.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditorialLinePage;
