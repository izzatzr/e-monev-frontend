/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from 'react';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { useQuery } from 'react-query';

import { useLocation } from 'react-router-dom';
import getTriwulan from '@/api/static/getTriwulan';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactECharts from 'echarts-for-react'; // import reactecharts
import _ from 'lodash';
import ErrorPage from '../../ErrorPage';
import CountBox from './components/CountBox';
import FundTotal from './components/FundTotal';
import ReportTable from './ReportTable';
import FilterPanel from './components/FilterPanel';
import ProgressBar from '../../../components/ProgressBar';

import { getOrganizations } from '../../../api/admin/organization';
import { getUsers } from '../../../api/admin/user';
import { getOccasions } from '../../../api/admin/occasion';
import { getPrograms } from '../../../api/admin/program';
import { getActivities } from '../../../api/admin/activity';
import { getPurposes } from '../../../api/admin/purpose';
import getExcel from '../../../api/admin/dashboard/getExcel';
import getFundSourceChart from '../../../api/admin/dashboard/getFundSourceChart';
import formatRupiah from '../../../utils/formatRupiah';

const initialParams = {
  limit: 0,
  page: 0,
};

const initialFundSourceChart = {
  pagu_dana_id: null,
  tipe_pengadaan: null,
  bentuk_pengadaan: null,
  cara_pengadaan: null,
  program_prio: null,
  triwulan_id: null
};

const Dashboard = () => {
  const authHeader = useAuthHeader();
  const authUser = useAuthUser();

  const token = useMemo(() => authHeader(), [authHeader]);

  const [filterFundSourceChart, setFilterFundSourceChart] = useState(
    initialFundSourceChart
  );
  const [filters, setFilters] = useState({
    fundSource: null,
    jenisPengadaan: null,
    caraPengadaan: null,
    bentukKegiatan: null,
    programPrioritas: null,
    tahun: null,
    triwulan_id: null
  });

  const location = useLocation();

  const occassionsQuery = useQuery({
    queryKey: ['get_occassions', initialParams],
    queryFn: () => getOccasions(initialParams, authHeader()),
    enabled: token !== null,
  });

  const organizationsQuery = useQuery({
    queryKey: ['get_organizations', initialParams],
    queryFn: () => getOrganizations(initialParams, authHeader()),
    enabled: token !== null,
  });

  const programsQuery = useQuery({
    queryKey: ['get_programs', initialParams],
    queryFn: () => getPrograms(initialParams, authHeader()),
    enabled: token !== null,
  });

  const activitiesQuery = useQuery({
    queryKey: ['get_activities', initialParams],
    queryFn: () => getActivities(initialParams, authHeader()),
    enabled: token !== null,
  });

  const purposesQuery = useQuery({
    queryKey: ['get_purposes', initialParams],
    queryFn: () => getPurposes(initialParams, authHeader()),
    enabled: token !== null,
  });

  const usersQuery = useQuery({
    queryKey: ['get_users', initialParams],
    queryFn: () => getUsers(initialParams, authHeader()),
    enabled: token !== null,
  });

  const excelQuery = useQuery({
    queryKey: ['get_excel'],
    queryFn: () => getExcel(authHeader()),
    enabled: false,
  });

  const fundSourceChartQuery = useQuery({
    queryKey: ['get_fund_source_chart', filterFundSourceChart],
    queryFn: () => getFundSourceChart(filterFundSourceChart, authHeader()),
    enabled: filters.fundSource !== null,
  });

  // const triwulanQuery = useQuery({
  //   queryKey: ['get_triwulan'],
  //   queryFn: () => getTriwulan(authHeader()),
  //   enabled: filters.fundSource !== null,
  // });

  useEffect(() => {
    if (filters.fundSource?.id) {
      setFilterFundSourceChart({
        pagu_dana_id: filters.fundSource.id,
        tipe_pengadaan: filters.jenisPengadaan?.name,
        bentuk_pengadaan: filters.bentukKegiatan?.name,
        cara_pengadaan: filters.caraPengadaan?.name,
        program_prio: filters.programPrioritas?.name,
        tahun: filters.tahun?.name,
        triwulan_id: filters.triwulan_id?.id
      });
    }
  }, [filters]);

  // useEffect(() => {
  //   if (filters.fundSource?.id) {
  //     setFilterFundSourceChart({
  //       pagu_dana_id: filters.fundSource.id,
  //       tipe_pengadaan: filters.jenisPengadaan?.name,
  //       bentuk_pengadaan: filters.bentukKegiatan?.name,
  //       cara_pengadaan: filters.caraPengadaan?.name,
  //       program_prio: filters.programPrioritas?.name,
  //       tahun: filters.tahun?.name,
  //       triwulan_id: filters.triwulan_id?.name
  //     });
  //   }
  // }, [filters]);

  // const handleDownloadExcel = async () => {
  //   await excelQuery.refetch();
  // };

  const handleSelectFilter = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  if (usersQuery.isError) {
    return <ErrorPage errorMessage={usersQuery.error} />;
  }

  const totalPaguDana = useMemo(
    () => fundSourceChartQuery?.data?.data?.pagu_dana.total_pagu_dana,
    [fundSourceChartQuery?.data?.data?.pagu_dana.total_pagu_dana]
  );
  const totalPaguDanaDigunakan = useMemo(
    () => fundSourceChartQuery?.data?.data?.pagu_dana.total_pagu_dana_digunakan,
    [fundSourceChartQuery?.data?.data?.pagu_dana.total_pagu_dana_digunakan]
  );
  const showCountBox = (roles) => roles.includes(authUser().role.name);

  const progressBarData = useMemo(
    () =>
      fundSourceChartQuery?.data?.data?.triwulan.map((triwulan) => ({
        label: triwulan.nama_aktifitas,
        completed: triwulan.realisasi_fisik,
        total: triwulan.pagu_dana,
      })),
    [fundSourceChartQuery?.data?.data?.triwulan]
  );

  // Specify the configuration items and data for the chart

  const calculateBarData = () => {
    const x = _(fundSourceChartQuery?.data?.data?.triwulan ?? []).groupBy((e) => e.nama_opd)
      .map((value, key) => ([
        // nama_opd
        key,
        // realisasi_fisik
        value.reduce((prev, curr) => prev + curr.realisasi_fisik, 0),
        // realisasi_fisik_persentase
        value.reduce((prev, curr) => prev + curr.realisasi_fisik_persentase, 0) / value.length
      ]))
      .value()

    return x

  }
  var option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ['Nama OPD', 'Realisasi Fisik angka', 'Realisasi Fisik Persentase'],
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...calculateBarData()
        // ...(fundSourceChartQuery?.data?.data?.triwulan.map((e) => ([e?.nama_opd ?? 0,
        // e?.realisasi_fisik ?? 0,
        // e?.realisasi_fisik_persentase ?? 0]))) ?? []
      ]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar', barMinHeight: 15, barWidth: '30%' }, { type: 'bar', barMinHeight: 15, barWidth: '30%' }]
  };


  return (
    <>
      <h1 className="font-semibold text-2xl mb-4">
        Halo {authUser().role.name}, Selamat Datang di halaman elektronik
        aplikasi&nbsp;
        <span className="italic">e-Montir</span>
      </h1>

      <a
        className="text-lg lg:text-2xl underline"
        href="https://sipd.kemendagri.go.id/landing"
      >
        https://sipd.kemendagri.go.id/landing
      </a>

      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-center lg:justify-between my-8 lg:items-end">
        {authUser().role.id === 1 && (
          <FilterPanel all filters={filters} onChange={handleSelectFilter} />
        )}

        {authUser().role.name !== 'OPD' && (
          <div className="flex space-x-2 flex-3">
            {/* <Button
              className="w-28 lg:w-auto"
              type="submit"
              background="bg-primary"
              textColor="text-white"
              icon={<ArrowDownTrayIcon className="w-6 h-6" />}
            >
              Unduh Data (PDF)
            </Button>
            <Button
              onClick={handleDownloadExcel}
              className="w-28 lg:w-auto"
              type="submit"
              background="bg-primary"
              textColor="text-white"
              icon={<ArrowDownTrayIcon className="w-6 h-6" />}
              loading={excelQuery.isLoading}
            >
              Unduh Data (XLS)
            </Button> */}
          </div>
        )}
      </div>

      {
        authUser().role.name !== 'OPD' && (
          <div className="mb-8 bg-white rounded-lg shadow-2xl shadow-[#F3F6FF] p-8">
            <h1 className="text-2xl font-semibold text-center space-x-3">
              <span>Sumber Dana:</span>
              <span className="uppercase">
                {fundSourceChartQuery?.data?.data?.pagu_dana.name}
              </span>
            </h1>
            <div className="mt-6 flex flex-col space-y-12 lg:flex-row lg:space-y-0 lg:space-x-12 lg:justify-center items-center">
              <FundTotal
                title="Total Sumber Dana"
                className="bg-[#56CCF2]"
                total={formatRupiah(totalPaguDana)}
              />
              <FundTotal
                title="Total Pagu Dana"
                className="bg-[#BB6BD9]"
                total={formatRupiah(totalPaguDanaDigunakan)}
              />
            </div>

            {progressBarData && (
              <div className="mt-20">
                <ProgressBar data={progressBarData} />
              </div>
            )}

            {progressBarData && (
              <ReactECharts className='mt-20' option={option} />
            )}

          </div>
        )
      }

      {/* {authUser().role.name !== 'OPD' && (
        <div className="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 p-8 shadow-2xl shadow-[#F3F6FF]">
          {showCountBox(['Superadmin', 'Admin Bidang']) && (
            <CountBox
              linkTo="urusan"
              title="urusan"
              count={occassionsQuery.data?.data.total || 0}
              color="#56CCF2"
              className="hover:solid-shadow-blue"
            />
          )}
          {showCountBox(['Superadmin']) && (
            <CountBox
              linkTo="organisasi"
              title="organisasi"
              count={organizationsQuery.data?.data.total || 0}
              color="#BB6BD9"
              className="hover:solid-shadow-purple"
            />
          )}
          {showCountBox(['Superadmin', 'Admin Bidang']) && (
            <CountBox
              linkTo="program"
              title="program"
              count={programsQuery.data?.data.total || 0}
              color="#6FCF97"
              className="hover:solid-shadow-green"
            />
          )}
          {showCountBox(['Superadmin', 'Admin Bidang']) && (
            <CountBox
              linkTo="kegiatan"
              title="kegiatan"
              count={activitiesQuery.data?.data.total || 0}
              color="#F2C94C"
              className="hover:solid-shadow-yellow"
            />
          )}
          {showCountBox(['Superadmin', 'Admin Bidang']) && (
            <CountBox
              linkTo="sasaran"
              title="sasaran"
              count={purposesQuery.data?.data.total || 0}
              color="#F2994A"
              className="hover:solid-shadow-orange"
            />
          )}
          {showCountBox(['Superadmin']) && (
            <CountBox
              linkTo="login-akses-user"
              title="user"
              count={usersQuery.data?.data.total || 0}
              color="#BDBDBD"
              className="hover:solid-shadow-gray"
            />
          )}
        </div>
      )} */}

      {authUser().role.name === 'OPD' && <ReportTable />}
    </>
  );
};

export default Dashboard;
