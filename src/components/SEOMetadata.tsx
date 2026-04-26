import { useEffect } from "react";

interface SEOMetadataProps {
    title?: string;
    description?: string;
    author?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    publishedDate?: string;
    category?: string;
    keywords?: string[];
}

const DEFAULT_KEYWORDS = [
    "notícias de angola hoje",
    "últimas notícias angola",
    "atualidade angolana",
    "política angola atual",
    "economia angola notícias",
    "notícias em tempo real angola",
    "Sem Filtros",
    "investigação angola"
];

export const SEOMetadata = ({
    title = "Sem Filtros | Notícias Sem Censura",
    description = "Sem Filtros - Portal de Notícias Sem Censura e Investigação em Angola",
    author = "Sem Filtros",
    image = "https://www.semfiltros.com/logo.png",
    url = window.location.href,
    type = "website",
    publishedDate,
    category,
    keywords = []
}: SEOMetadataProps) => {
    useEffect(() => {
        const allKeywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...keywords]));
        // Atualizar meta tags básicas
        document.title = title;

        const updateMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
            let element = document.querySelector(`meta[${attr}="${name}"]`);
            if (!element) {
                element = document.createElement("meta");
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute("content", content);
        };

        updateMeta("description", description);
        updateMeta("author", author);
        updateMeta("og:title", title, "property");
        updateMeta("og:description", description, "property");
        updateMeta("og:image", image, "property");
        updateMeta("og:url", url, "property");
        updateMeta("og:type", type, "property");
        updateMeta("twitter:title", title);
        updateMeta("twitter:description", description);
        updateMeta("twitter:image", image);
        updateMeta("twitter:card", "summary_large_image");
        updateMeta("keywords", allKeywords.join(", "));

        // Canonical Link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", url);

        // JSON-LD Structured Data
        const schemaId = "seo-schema-markup";
        let script = document.getElementById(schemaId) as HTMLScriptElement;
        if (!script) {
            script = document.createElement("script");
            script.id = schemaId;
            script.type = "application/ld+json";
            document.head.appendChild(script);
        }

        const baseSchema: any = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": "https://www.semfiltros.com/#organization",
                    "name": "Sem Filtros",
                    "url": "https://www.semfiltros.com/",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.semfiltros.com/logo.png"
                    },
                    "sameAs": [
                        "https://twitter.com/SemFiltros"
                    ]
                },
                {
                    "@type": "WebSite",
                    "@id": "https://www.semfiltros.com/#website",
                    "url": "https://www.semfiltros.com/",
                    "name": "Sem Filtros",
                    "publisher": { "@id": "https://www.semfiltros.com/#organization" }
                }
            ]
        };

        if (type === "article") {
            const articleSchema = {
                "@type": "NewsArticle",
                "@id": `${url}#article`,
                "isPartOf": { "@id": "https://www.semfiltros.com/#website" },
                "author": {
                    "@type": "Person",
                    "name": author
                },
                "headline": title,
                "description": description,
                "image": [image],
                "datePublished": publishedDate || new Date().toISOString(),
                "publisher": { "@id": "https://www.semfiltros.com/#organization" },
                "articleSection": category || "Notícias",
                "keywords": allKeywords.join(", ")
            };
            baseSchema["@graph"].push(articleSchema);

            // Breadcrumbs
            const breadcrumbSchema = {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.semfiltros.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": category || "Artigo",
                        "item": url
                    }
                ]
            };
            baseSchema["@graph"].push(breadcrumbSchema);
        }

        script.text = JSON.stringify(baseSchema);

        return () => {
            // Limpeza opcional, mas para SPA é melhor manter o global ou limpar apenas o artigo
            if (type === "article") {
                // script.text = ""; 
            }
        };
    }, [title, description, author, image, url, type, publishedDate, category]);

    return null;
};
