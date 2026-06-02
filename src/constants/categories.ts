export const categories = [
    "Destaque", "Sociedade", "Crimes", "Política", "Economia", "Internacional", "Desporto", "Cultura", "Tecnologia", "Opinião", "Saúde"
];

export const getCategorySlug = (category: string) => {
    return category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
