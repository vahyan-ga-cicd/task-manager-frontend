import axios from "axios";

export const getalldata = async (limit = 10, lastKey: string | null = null) => {
  try {
    const params: Record<string, string | number> = { limit };

    if (lastKey) {
      params.lastKey = lastKey;
    }

    const res = await axios.get("/api/decentralized", { params });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPublicStats = async () => {
  try {
    const res = await axios.get("/api/decentralized", {
      params: { type: "stats" },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
