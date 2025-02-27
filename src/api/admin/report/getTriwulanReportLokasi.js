import axiosClient from '../../../config/axios';

async function getTriwulanReportLocation(params, token) {
    try {
        const response = await axiosClient.get(`/data-report/user/data-triwulan-lokasi`, {
            params,
            headers: {
                Authorization: token,
            },
        });

        const responseData = response.data;

        if (responseData.statusCode !== 200) {
            throw new Error(responseData.message);
        }

        return responseData;
    } catch (err) {
        throw new Error(err);
    }
}

export default getTriwulanReportLocation