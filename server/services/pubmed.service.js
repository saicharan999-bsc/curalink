import { http } from "./http.service.js";

const decodeXml = (value = "") =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const getFirstMatch = (pattern, value = "") =>
  value.match(pattern)?.[1]?.trim() || "";

const parseAuthors = (articleXml = "") =>
  Array.from(articleXml.matchAll(/<Author[\s\S]*?<\/Author>/g))
    .map((match) => {
      const authorXml = match[0];
      const collectiveName = decodeXml(
        getFirstMatch(/<CollectiveName>([\s\S]*?)<\/CollectiveName>/, authorXml),
      );

      if (collectiveName) {
        return collectiveName;
      }

      const lastName = decodeXml(
        getFirstMatch(/<LastName>([\s\S]*?)<\/LastName>/, authorXml),
      );
      const foreName = decodeXml(
        getFirstMatch(/<ForeName>([\s\S]*?)<\/ForeName>/, authorXml),
      );

      return [foreName, lastName].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join(", ");

const parseAbstract = (articleXml = "") => {
  const abstractParts = Array.from(
    articleXml.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g),
  ).map((match) => decodeXml(match[1]));

  return abstractParts.join(" ").trim();
};

const parsePubMedXml = (xml = "") =>
  Array.from(xml.matchAll(/<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g)).map(
    (match) => {
      const articleXml = match[1];
      const id = decodeXml(getFirstMatch(/<PMID[^>]*>([\s\S]*?)<\/PMID>/, articleXml));
      const title = decodeXml(
        getFirstMatch(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/, articleXml),
      );
      const summary = parseAbstract(articleXml);
      const journal = decodeXml(
        getFirstMatch(/<Title>([\s\S]*?)<\/Title>/, articleXml),
      );
      const year =
        decodeXml(getFirstMatch(/<PubDate>[\s\S]*?<Year>([\s\S]*?)<\/Year>/, articleXml)) ||
        decodeXml(
          getFirstMatch(/<PubDate>[\s\S]*?<MedlineDate>(\d{4})[\s\S]*?<\/MedlineDate>/, articleXml),
        );
      const doi = decodeXml(
        getFirstMatch(
          /<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/,
          articleXml,
        ),
      );

      return {
        id,
        title: title || "Untitled publication",
        abstract: summary,
        year,
        authors: parseAuthors(articleXml),
        journal,
        source: "PubMed",
        url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      };
    },
  );

export const fetchPubMed = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodedQuery}&retmax=60&sort=relevance&retmode=json`;
    const searchRes = await http.get(searchUrl);
    const ids = searchRes.data.esearchresult.idlist || [];

    if (!ids.length) {
      return { items: [], totalFetched: 0 };
    }

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`;
    const fetchRes = await http.get(fetchUrl);
    const items = parsePubMedXml(fetchRes.data);

    return {
      items,
      totalFetched: ids.length,
    };
  } catch (err) {
    console.error(err);
    return { items: [], totalFetched: 0 };
  }
};
