import { baseUrl } from "../../../utils/constants";

export default async function getPrograms(
  authHeader,
  offset = 0,
  limit = 10,
  pageNumber = 1,
  search = ""
) {
  try {
    const programResponse = await fetch(
      `${baseUrl}/program/list?offset=${offset}&limit=${limit}&search=${search}` +
        (pageNumber ? `&page=${pageNumber}` : ""),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      }
    );

    const programData = await programResponse.json();

    if (!programResponse.ok) {
      throw new Error(
        `Gagal mendapatkan data dari server: ${programData.message}`
      );
    }

    return programData.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
