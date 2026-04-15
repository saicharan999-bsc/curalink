import axios from "axios";

export const fetchOpenAlex = async (query) => {
  try {
    const url = `https://api.openalex.org/works?search=${query}&per-page=20`;

    const res = await axios.get(url);

    return res.data.results;

  } catch (err) {
    console.error(err);
    return [];
  }
};