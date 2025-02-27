import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuthHeader } from 'react-auth-kit';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

import Label from '@/components/Label';
import ReactLoading from '@/components/Loading';
import Button from '@/components/Button';
import { useToastContext } from '@/context/ToastContext';

import setTriwulanSetting from '@/api/admin/configuration/setTriwulanSetting';
import getTriwulanSetting from '@/api/admin/configuration/getTriwulanSetting';
import formattedDate from '@/utils/formattedDate';

import './dateRangePicker.css';

const Configuration = () => {
  const [datePicker, setDatePicker] = useState([new Date(), new Date()]);
  const queryClient = useQueryClient();
  const { showToastMessage } = useToastContext();
  const authHeader = useAuthHeader();

  const configurationQuery = useQuery({
    queryKey: ['get_configuration'],
    queryFn: () => getTriwulanSetting(authHeader()),
    onSuccess: (result) => {
      let triwulanEnded;
      let triwulanStarted;

      result.data.forEach(({ TRIWULAN_ENDED, TRIWULAN_STARTED }) => {
        if (TRIWULAN_ENDED) triwulanEnded = TRIWULAN_ENDED;
        if (TRIWULAN_STARTED) triwulanStarted = TRIWULAN_STARTED;
      });

      setDatePicker([new Date(triwulanStarted), new Date(triwulanEnded)]);
    },
  });

  const updateMutation = useMutation(setTriwulanSetting);

  const onSubmit = (e) => {
    e.preventDefault();

    const newData = datePicker.map((date) => formattedDate(date));

    updateMutation.mutate(
      {
        body: [
          {
            key: 'TRIWULAN_STARTED',
            value: newData[0],
          },
          {
            key: 'TRIWULAN_ENDED',
            value: newData[1],
          },
        ],
        token: authHeader(),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('get_configuration');
          showToastMessage('Berhasil mengubah konfigurasi');
        },
        onError: (err) => {
          showToastMessage(err.message, 'error');
        },
      }
    );
  };

  if (configurationQuery.isLoading) {
    return <ReactLoading />;
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Konfigurasi</h1>
      </div>

      <div className="w-full h-full mt-6 bg-white rounded-lg p-9">
        <form className="mt-4" onSubmit={onSubmit}>
          <div className="mb-6">
            <Label>Tanggal OPD (untuk Pengisian Tambah Data Triwulan)</Label>
            <DateRangePicker
              className="mt-2 w-full md:max-w-xs"
              onChange={setDatePicker}
              value={datePicker}
            />
          </div>

          {updateMutation.isLoading ? (
            <ReactLoading />
          ) : (
            <Button
              type="submit"
              className="w-full md:w-28"
              background="bg-primary"
              textColor="text-white"
              icon={<CheckCircleIcon className="w-5 h-5" />}
            >
              Simpan
            </Button>
          )}
        </form>
      </div>
    </>
  );
};

export default Configuration;
