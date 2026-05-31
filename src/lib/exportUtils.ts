/**
 * Utility functions to export site data to various formats.
 */

export interface ExportData {
  news: any[];
  videos: any[];
  opinions: any[];
  settings: any[];
}

/**
 * Downloads a string as a file.
 */
export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports data as JSON.
 */
export const exportToJSON = (data: ExportData) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `backup_sem_filtros_${new Date().toISOString().split('T')[0]}.json`, "application/json");
};

/**
 * Exports data as SQL INSERT statements (PostgreSQL compatible).
 */
export const exportToSQL = (data: ExportData) => {
  let sql = `-- Backup do Portal Sem Filtros\n`;
  sql += `-- Data: ${new Date().toLocaleString()}\n\n`;

  const generateInserts = (tableName: string, rows: any[]) => {
    if (rows.length === 0) return `-- No data for ${tableName}\n\n`;

    let tableSql = `-- Data for table: ${tableName}\n`;
    const columns = Object.keys(rows[0]);
    const colString = columns.join(", ");

    rows.forEach(row => {
      const values = columns.map(col => {
        const val = row[col];
        if (val === null) return "NULL";
        if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return val;
      });
      tableSql += `INSERT INTO ${tableName} (${colString}) VALUES (${values.join(", ")});\n`;
    });
    return tableSql + "\n";
  };

  sql += generateInserts("news_articles", data.news);
  sql += generateInserts("video_news", data.videos);
  sql += generateInserts("opinion_articles", data.opinions);
  sql += generateInserts("system_settings", data.settings);

  downloadFile(sql, `backup_sql_sem_filtros_${new Date().toISOString().split('T')[0]}.sql`, "application/sql");
};

/**
 * Exports news articles to WordPress XML (WXR format).
...
 */
export const exportToWordPressXML = (data: ExportData) => {
  const date = new Date().toUTCString();

  let items = "";

  // Convert News Articles
  data.news.forEach(article => {
    const pubDate = new Date(article.created_at).toUTCString();
    items += `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>https://angolasemfiltros.com/noticia/${article.id}</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${article.author || "Redacção"}]]></dc:creator>
      <category domain="category" nicename="${article.category.toLowerCase()}"><![CDATA[${article.category}]]></category>
      <guid isPermaLink="false">https://angolasemfiltros.com/?p=${article.id}</guid>
      <description></description>
      <content:encoded><![CDATA[${article.content || article.summary || ""}]]></content:encoded>
      <excerpt:encoded><![CDATA[${article.summary || ""}]]></excerpt:encoded>
      <wp:post_id>${article.id}</wp:post_id>
      <wp:post_date><![CDATA[${article.created_at}]]></wp:post_date>
      <wp:comment_status><![CDATA[open]]></wp:comment_status>
      <wp:ping_status><![CDATA[open]]></wp:ping_status>
      <wp:post_name><![CDATA[${article.title.toLowerCase().replace(/\s+/g, '-')}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type><![CDATA[post]]></wp:post_type>
      <wp:post_password><![CDATA[]]></wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
    </item>`;
  });

  // Convert Opinions
  data.opinions.forEach(opinion => {
    const pubDate = new Date(opinion.created_at).toUTCString();
    items += `
    <item>
      <title><![CDATA[${opinion.title}]]></title>
      <link>https://angolasemfiltros.com/opiniao/${opinion.id}</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${opinion.author}]]></dc:creator>
      <category domain="category" nicename="opiniao"><![CDATA[Opinião]]></category>
      <guid isPermaLink="false">https://angolasemfiltros.com/?p=${opinion.id}</guid>
      <description></description>
      <content:encoded><![CDATA[${opinion.content || ""}]]></content:encoded>
      <excerpt:encoded><![CDATA[${opinion.excerpt || ""}]]></excerpt:encoded>
      <wp:post_id>${opinion.id}</wp:post_id>
      <wp:post_date><![CDATA[${opinion.created_at}]]></wp:post_date>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_type><![CDATA[post]]></wp:post_type>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <title>Sem Filtros - Backup</title>
  <link>https://angolasemfiltros.com</link>
  <description>Backup do Portal Sem Filtros</description>
  <pubDate>${date}</pubDate>
  <language>pt-PT</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>https://angolasemfiltros.com</wp:base_site_url>
  <wp:base_blog_url>https://angolasemfiltros.com</wp:base_blog_url>
  ${items}
</channel>
</rss>`;

  downloadFile(xml, `backup_wordpress_sem_filtros_${new Date().toISOString().split('T')[0]}.xml`, "application/xml");
};
