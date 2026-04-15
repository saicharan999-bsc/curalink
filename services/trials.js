import axios from "axios";

export const fetchTrials = async (disease) => {
  try {
    const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${disease}&pageSize=20&format=json`;

    const res = await axios.get(url);

    return res.data.studies;

  } catch (err) {
    console.error(err);
    return [];
  }
};