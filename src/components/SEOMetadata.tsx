import { useEffect } from "react";

interface SEOMetadataProps {
    title?: string;
    description?: string;
    author?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    publishedDate?: string;
    modifiedDate?: string;
    category?: string;
    keywords?: string[];
    faqs?: { question: string; answer: string }[];
    wordCount?: number;
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

const SITE_URL = "https://www.semfiltros.com";
const SITE_NAME = "Sem Filtros";
const DEFAULT_LOGO = `${SITE_URL}/logo.png`;

export const SEOMetadata = ({
    title = "Sem Filtros | Notícias Sem Censura",
    description = "Sem Filtros - Portal de Notícias Sem Censura e Investigação em Angola",
    author = "Sem Filtros",
    image = DEFAULT_LOGO,
    url = (typeof window !== "undefined" ? window.location.href : SITE_URL),
    type = "website",
    publishedDate,
    modifiedDate,
    category,
    keywords = [],
    faqs,
    wordCount,
}: SEOMetadataProps) => {
    useEffect(() => {
        const allKeywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...keywords]));

        // Title
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

        // Basic SEO
        updateMeta("description", description);
        updateMeta("author", author);
        updateMeta("keywords", allKeywords.join(", "));
        updateMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
        updateMeta("language", "pt-AO");

        // Open Graph
        updateMeta("og:title", title, "property");
        updateMeta("og:description", description, "property");
        updateMeta("og:image", image || DEFAULT_LOGO, "property");
        updateMeta("og:url", url, "property");
        updateMeta("og:type", type, "property");
        updateMeta("og:site_name", SITE_NAME, "property");
        updateMeta("og:locale", "pt_AO", "property");

        // Article-specific OG
        if (type === "article") {
            if (publishedDate) updateMeta("article:published_time", publishedDate, "property");
            if (modifiedDate) updateMeta("article:modified_time", modifiedDate, "property");
            if (category) updateMeta("article:section", category, "property");
        }

        // Twitter
        updateMeta("twitter:title", title);
        updateMeta("twitter:description", description);
        updateMeta("twitter:image", image || DEFAULT_LOGO);
        updateMeta("twitter:card", "summary_large_image");
        updateMeta("twitter:site", "@SemFiltros");

        // Canonical Link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", url);

        // ─── JSON-LD Structured Data ───────────────────────────────────
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
                    "@id": `${SITE_URL}/#organization`,
                    "name": SITE_NAME,
                    "url": `${SITE_URL}/`,
                    "logo": {
                        "@type": "ImageObject",
                        "url": DEFAULT_LOGO,
                        "width": 512,
                        "height": 512
                    },
                    "sameAs": [
                        "https://twitter.com/SemFiltros",
                        "https://www.youtube.com/@semfiltrostv"
                    ]
                },
                {
                    "@type": "WebSite",
                    "@id": `${SITE_URL}/#website`,
                    "url": `${SITE_URL}/`,
                    "name": SITE_NAME,
                    "description": "Portal de Notícias Sem Censura e Investigação em Angola",
                    "inLanguage": "pt-AO",
                    "publisher": { "@id": `${SITE_URL}/#organization` },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${SITE_URL}/?q={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                }
            ]
        };

        if (type === "article") {
            const articleSchema: any = {
                "@type": "NewsArticle",
                "@id": `${url}#article`,
                "isPartOf": { "@id": `${SITE_URL}/#website` },
                "author": {
                    "@type": "Person",
                    "name": author,
                    "worksFor": { "@id": `${SITE_URL}/#organization` }
                },
                "headline": title,
                "description": description,
                "image": [image || DEFAULT_LOGO],
                "datePublished": publishedDate || new Date().toISOString(),
                "dateModified": modifiedDate || publishedDate || new Date().toISOString(),
                "publisher": { "@id": `${SITE_URL}/#organization` },
                "articleSection": category || "Notícias",
                "keywords": allKeywords.join(", "),
                "inLanguage": "pt-AO",
                "isAccessibleForFree": true,
                "url": url,
            };

            if (wordCount && wordCount > 0) {
                articleSchema["wordCount"] = wordCount;
            }

            baseSchema["@graph"].push(articleSchema);

            // Breadcrumbs
            const breadcrumbSchema: any = {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Início",
                        "item": `${SITE_URL}/`
                    }
                ]
            };

            if (category) {
                const catSlug = category
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-");
                breadcrumbSchema["itemListElement"].push({
                    "@type": "ListItem",
                    "position": 2,
                    "name": category,
                    "item": `${SITE_URL}/${catSlug}`
                });
                breadcrumbSchema["itemListElement"].push({
                    "@type": "ListItem",
                    "position": 3,
                    "name": title,
                    "item": url
                });
            } else {
                breadcrumbSchema["itemListElement"].push({
                    "@type": "ListItem",
                    "position": 2,
                    "name": title,
                    "item": url
                });
            }

            baseSchema["@graph"].push(breadcrumbSchema);
        }

        // FAQ Schema (when applicable)
        if (faqs && faqs.length > 0) {
            const faqSchema = {
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            };
            baseSchema["@graph"].push(faqSchema);
        }

        script.text = JSON.stringify(baseSchema);
    }, [title, description, author, image, url, type, publishedDate, modifiedDate, category, wordCount]);

    return null;
};
