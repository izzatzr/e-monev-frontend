import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import { useQuery } from 'react-query';
import { useAuthHeader } from 'react-auth-kit';
import DropdownSelect from '../../../components/DropdownSelect';
import useSearchParamsState from '../../../hooks/useSearchParamsState';
import getTriwulan from '../../../api/static/getTriwulan';
import getFundSource from '../../../api/user/triwulan/getFundSource';
import Button from '../../../components/Button';
import useDebounce from '../../../hooks/useDebounce';
import objectToQueryString from '../../../utils/objectToQueryString';
import downloadTriwulanExcel from '../../../api/admin/report/downloadTriwulanExcel';
import { useToastContext } from '../../../context/ToastContext';
import downloadMasterExcel from '../../../api/admin/report/downloadMasterExcel';
import downloadMasterPdf from '../../../api/admin/report/downloadMasterPdf';
import downloadTriwulanPdf from '../../../api/admin/report/downloadTriwulanPdf';

// const type = [
//   {
//     label: 'Data Laporan Master',
//     value: 'data-master',
//   },
//   {
//     label: 'Data Laporan Kegiatan',
//     value: 'data-triwulan',
//   },
// ];

const months = [
  { label: 'Januari', value: 1 },
  { label: 'Februari', value: 2 },
  { label: 'Maret', value: 3 },
  { label: 'April', value: 4 },
  { label: 'Mei', value: 5 },
  { label: 'Juni', value: 6 },
  { label: 'Juli', value: 7 },
  { label: 'Agustus', value: 8 },
  { label: 'September', value: 9 },
  { label: 'Oktober', value: 10 },
  { label: 'November', value: 11 },
  { label: 'Desember', value: 12 },
];

const years = Array.from({ length: 38 }, (_, i) => ({
  label: (2023 + i).toString(),
  value: (2023 + i).toString(),
}));

const initialFundSourceParams = {
  limit: 10,
  page: 1,
  sort: 'terbaru',
};

const initialFilterParams = {
  limit: 10,
  page: 1,
  sort: 'terbaru',
};

const ReportTableWrapper = () => {
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToastMessage } = useToastContext();

  const [selectedType, setSelectedType] = useState({
    label: 'Data Laporan Kegiatan',
    value: 'data-triwulan',
  });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedTriwulan, setSelectedTriwulan] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFundSource, setSelectedFundSource] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [searchParamsState, setSearchParamsState] =
    useSearchParamsState(initialFilterParams);

  useEffect(() => {
    setSearchParamsState({
      ...searchParamsState,
      search: debouncedSearch,
    });
  }, [debouncedSearch]);

  const triwulanQuery = useQuery({
    queryKey: ['get_triwulan'],
    queryFn: () => getTriwulan(authHeader()),
  });

  const fundSourceQuery = useQuery({
    queryKey: ['get_fund_source'],
    queryFn: () => getFundSource(initialFundSourceParams, authHeader()),
  });

  const handleDownloadPDF = async () => {
    let res;
    let fileName;

    if (selectedType && selectedType.value === 'data-master') {
      fileName = 'Data Master.pdf';
      res = await downloadMasterPdf(searchParamsState, authHeader());
    } else if (selectedType && selectedType.value === 'data-triwulan') {
      fileName = 'Data Kegiatan.pdf';
      res = await downloadTriwulanPdf(searchParamsState, authHeader());
    }

    if (res) {
      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(res);

      // Create a link element
      const link = document.createElement('a');

      // Set the href and download attributes to trigger the download
      link.href = blobUrl;
      link.download = fileName;

      // Programmatically click the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up the URL and remove the link from the DOM
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } else {
      showToastMessage('Terjadi kesalahan saat mengunduh file', 'error');
    }
  };

  const handleDownloadExcel = async () => {
    let res;
    let fileName;

    if (selectedType && selectedType.value === 'data-master') {
      fileName = 'Data Master.xlsx';
      res = await downloadMasterExcel(searchParamsState, authHeader());
    } else if (selectedType && selectedType.value === 'data-triwulan') {
      fileName = 'Data Triwulan.xlsx';
      res = await downloadTriwulanExcel(searchParamsState, authHeader());
    }

    if (res) {
      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(res);

      // Create a link element
      const link = document.createElement('a');

      // Set the href and download attributes to trigger the download
      link.href = blobUrl;
      link.download = fileName;

      // Programmatically click the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up the URL and remove the link from the DOM
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } else {
      showToastMessage('Terjadi kesalahan saat mengunduh file', 'error');
    }
  };

  // const onSelectType = (item) => {
  //   console.log(item);
  //   setSelectedType(item);
  // };

  const onSelectMonth = (item) => {
    setSelectedMonth(item);
    setSearchParamsState({
      ...searchParamsState,
      month: item.value,
    });
  };

  const onSelectTriwulan = (item) => {
    setSelectedTriwulan(item);
    setSearchParamsState({
      ...searchParamsState,
      triwulan_id: item.id,
    });
  };

  const onSelectYear = (item) => {
    setSelectedYear(item);
    setSearchParamsState({
      ...searchParamsState,
      year: item.value,
    });
  };

  const onSelectFundSource = (item) => {
    setSelectedFundSource(item);
    setSearchParamsState({
      ...searchParamsState,
      fund_source_id: item.id,
    });
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const resetFilter = () => {
    setSearchParamsState(initialFilterParams);
    setSelectedType({ label: 'Data Laporan Kegiatan', value: 'data-triwulan' });
    setSelectedMonth(null);
    setSelectedYear(null);
    setSelectedTriwulan(null);
    setSelectedFundSource(null);
    setSearch('');
    const queryString = objectToQueryString(initialFilterParams);
    navigate(`/laporan?${queryString}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedType && selectedType.value === 'data-master') {
      navigate(`data-master?${params.toString()}`);
    } else if (selectedType && selectedType.value === 'data-triwulan') {
      navigate(`data-triwulan?${params.toString()}`);
    }
  }, [selectedType]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Data Laporan</h1>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div style={{ minWidth: "14rem" }} />
        {/* <DropdownSelect
          value={selectedType}
          options={type}
          onChange={onSelectType}
          minWidth="14rem"
        >
          <DropdownSelect.HeaderV2 label="Pilih Data Laporan" />
        </DropdownSelect> */}

        <div className="relative w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={search}
            onChange={onSearchChange}
            className="bg-gray-50 text-light-gray border-none text-sm rounded-lg focus:ring-0 block w-full pl-10 p-2.5 shadow"
            placeholder="Pencarian"
          />
        </div>
      </div>

      <div className="flex justify-between mt-3 space-x-3">
        <div className="flex space-x-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Month Dropdown */}
            <DropdownSelect
              value={selectedMonth}
              options={months}
              onChange={onSelectMonth}
              minWidth="14rem"
            >
              <DropdownSelect.HeaderV2 label="Pilih Bulan" />
            </DropdownSelect>

            {/* Years Dropdown */}
            <DropdownSelect
              value={selectedYear}
              options={years}
              onChange={onSelectYear}
              minWidth="14rem"
            >
              <DropdownSelect.HeaderV2 label="Pilih Tahun" />
            </DropdownSelect>

            {/* Triwulan Dropdown */}
            <DropdownSelect
              value={selectedTriwulan}
              options={triwulanQuery.data?.data || []}
              onChange={onSelectTriwulan}
              minWidth="14rem"
            >
              <DropdownSelect.HeaderV2 label="Pilih Triwulan" />
            </DropdownSelect>

            {/* Sumber Dana Dropdown */}
            <DropdownSelect
              value={selectedFundSource}
              options={fundSourceQuery.data?.data?.result || []}
              onChange={onSelectFundSource}
              minWidth="14rem"
            >
              <DropdownSelect.HeaderV2 label="Pilih Sumber Dana" />
            </DropdownSelect>
          </div>

          <Button
            className="px-3"
            background="bg-primary"
            textColor="text-white"
            onClick={resetFilter}
          >
            Reset
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            className="w-28 lg:w-auto"
            type="submit"
            background="bg-primary"
            textColor="text-white"
            icon={<ArrowDownTrayIcon className="w-6 h-6" />}
            onClick={handleDownloadPDF}
          >
            Unduh Data (PDF)
          </Button>
          <Button
            className="w-28 lg:w-auto"
            type="submit"
            background="bg-primary"
            textColor="text-white"
            icon={<ArrowDownTrayIcon className="w-6 h-6" />}
            onClick={handleDownloadExcel}
          >
            Unduh Data (XLS)
          </Button>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default ReportTableWrapper;