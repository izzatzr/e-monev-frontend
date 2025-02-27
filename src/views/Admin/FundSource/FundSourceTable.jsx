import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthHeader } from 'react-auth-kit';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';

import { useToastContext } from '@/context/ToastContext';
import getFundSource from '@/api/user/triwulan/getFundSource';
import deleteFundSource from '@/api/admin/fundSource/deleteFundSource';
import ErrorPage from '@/views/ErrorPage';
import Button from '@/components/Button';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from '@/components/DropdownSelectV2';
import { pageSizes, sorting } from '@/utils/constants';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';

import columns from './components/columns';

const initialParams = {
  limit: '10',
  page: 1,
  search: '',
  sort: 'terbaru',
};

const FundSourceTable = () => {
  const authHeader = useAuthHeader();
  const { showToastMessage } = useToastContext();
  const queryClient = useQueryClient();

  const [filterParams, setFilterParams] = useState(initialParams);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['get_fund_sources', filterParams],
    queryFn: () => getFundSource(filterParams, authHeader()),
    enabled: authHeader() !== null,
  });

  useEffect(() => {
    setFilterParams({
      ...filterParams,
      search: debouncedSearchTerm,
    });
  }, [debouncedSearchTerm]);

  const deleteMutation = useMutation(deleteFundSource);

  const deleteFundSourceData = async (id) => {
    deleteMutation.mutate(
      {
        id,
        token: authHeader(),
      },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries('get_fund_sources');
          showToastMessage(result.message);
        },
        onError: (err) => {
          showToastMessage(err.message, 'error');
        },
      }
    );
  };

  const handleSelectFilter = (key, value) => {
    setFilterParams({
      ...filterParams,
      [key]: value,
    });
  };

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onPaginationChange = (currentPage) => {
    setFilterParams({
      ...filterParams,
      page: currentPage,
    });
  };

  if (isError) {
    return <ErrorPage errorMessage={error.message} />;
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Sumber Dana</h1>
        <Link to="create">
          <Button
            background="bg-primary"
            textColor="text-white"
            icon={<PlusIcon className="w-4 h-4" />}
          >
            Tambah Sumber Dana
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:justify-between lg:space-x-3">
        <div className="space-y-3 flex flex-col lg:flex-row lg:space-y-0 lg:space-x-3">
          {/* Sorting Dropdown */}
          <Dropdown
            value={filterParams.sort}
            onValueChange={(value) => handleSelectFilter('sort', value)}
          >
            <DropdownTrigger>
              <div className="flex space-x-2">
                <p>Urutkan :</p>
                <DropdownValue />
              </div>
            </DropdownTrigger>
            <DropdownContent>
              {sorting.map((sort) => (
                <DropdownItem key={sort.id} value={sort.id}>
                  {sort.name}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>

          {/* Page Size Dropdown */}
          <Dropdown
            value={filterParams.limit}
            onValueChange={(value) => handleSelectFilter('limit', value)}
          >
            <DropdownTrigger>
              <div className="flex space-x-2">
                <p>Tampilkan :</p>
                <DropdownValue />
                <p>entri</p>
              </div>
            </DropdownTrigger>
            <DropdownContent>
              {pageSizes.map((pageSize) => (
                <DropdownItem key={pageSize.id} value={pageSize.name}>
                  {pageSize.name}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={onSearchChange}
            className="bg-gray-50 text-light-gray border-none text-sm rounded-lg focus:ring-0 block w-full pl-10 p-2.5 shadow"
            placeholder="Pencarian"
          />
        </div>
      </div>

      <div className="w-full h-full mt-6 bg-white rounded-lg">
        <Table
          columns={columns.map((column) =>
            column.cell
              ? {
                  ...column,
                  cell: (props) => column.cell(props, deleteFundSourceData),
                }
              : column
          )}
          rows={data}
          isLoading={isLoading}
        />

        <Pagination
          totalRows={data?.data.total || 0}
          pageChangeHandler={onPaginationChange}
          rowsPerPage={filterParams.limit}
        />
      </div>
    </>
  );
};

export default FundSourceTable;
