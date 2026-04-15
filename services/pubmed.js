import axios from "axios";

export const fetchPubMed = async (query) => {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmax=20&retmode=json`;

    const searchRes = await axios.get(searchUrl);

    const ids = searchRes.data.esearchresult.idlist.join(",");

    if (!ids) return [];

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids}&retmode=xml`;

    const fetchRes = await axios.get(fetchUrl);

    return fetchRes.data;

  } catch (err) {
    console.error(err);
    return [];
  }
};