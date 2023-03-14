import { baseUrl } from "../../../utils/constants";

export default async function getOccasionDetail(authHeader, occasionId) {
  try {
    const occasionResponse = await fetch(
      `${baseUrl}/occassion/detail/${occasionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      }
    );

    if (!occasionResponse.ok) {
      throw new Error("Gagal mendapatkan data dari server");
    }

    const occasionData = await occasionResponse.json();

    return occasionData.data.result;
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mendapatkan data dari server");
  }
}
