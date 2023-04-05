import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import { Link, useParams } from 'react-router-dom';
import { getActivity } from '../../../api/admin/activity';
import ReactLoading from '../../../components/Loading';
import ErrorPage from '../../ErrorPage';

export default function ActivityDetail() {
  const [activity, setActivity] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const authHeader = useAuthHeader();

  const fetchActivity = async () => {
    setIsLoading(true);

    try {
      const occasionResponse = await getActivity(authHeader, id);

      setActivity(occasionResponse);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  if (error) {
    return <ErrorPage errorMessage={error} showBackButton />;
  }

  if (isLoading) {
    return <ReactLoading />;
  }

  return (
    <div className="w-full h-full mt-6 bg-white rounded-lg p-9">
      <Link to="../" className="flex space-x-3 items-center mb-8">
        <ArrowLeftIcon className="w-6 h-6" />
        <h1 className="font-semibold text-lg text-dark-gray leading-7">
          Detail Kegiatan
        </h1>
      </Link>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-dark-gray">
          <tbody>
            <tr className="bg-light-blue">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Kode
              </th>
              <td className="px-6 py-4">{activity.code}</td>
            </tr>
            <tr className="bg-white">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                ID Program
              </th>
              <td className="px-6 py-4">{activity.program_id}</td>
            </tr>
            <tr className="bg-light-blue">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Nama Program
              </th>
              <td className="px-6 py-4">Coming Soon</td>
            </tr>
            <tr className="bg-white">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Kegiatan
              </th>
              <td className="px-6 py-4">{activity.title}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
