import { baseUrl } from "../../../utils/constants";

export default async function getOrganizations(
  authHeader,
  offset = 0,
  limit = 10,
  pageNumber = 1,
  search = ""
) {
  try {
    const organizationResponse = await fetch(
      `${baseUrl}/org/list?offset=${offset}&limit=${limit}&search=${search}` +
        (pageNumber ? `&page=${pageNumber}` : ""),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      }
    );

    const organizationData = await organizationResponse.json();

    if (!organizationResponse.ok) {
      throw new Error(
        `Gagal mendapatkan data dari server: ${organizationData.message}`
      );
    }

    return organizationData.data;
  } catch (error) {
    throw new Error(error.message);
  }
}