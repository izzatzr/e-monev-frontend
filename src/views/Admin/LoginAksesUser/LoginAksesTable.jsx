import { useEffect, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Dropdown from "../../../components/Dropdown";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import {
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../../../components/DialogContent";
import TrashImg from "../../../assets/images/trash.png";
import DebouncedInput from "../../../components/DebouncedInput";
import { useAuthHeader } from "react-auth-kit";
import { baseUrl } from "../../../utils/constants";
import { getUsers } from "../../../api/admin/user";
import Pagination from "../../../components/Pagination";

function LoginAksesTable() {
  const columnHelper = createColumnHelper();

  const [sorting, setSorting] = useState([]);
  const [error, setError] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [pageData, setCurrentPageData] = useState({
    rowData: [],
    isLoading: false,
    totalPages: 0,
    totalData: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [resetPage, setResetPage] = useState(false);

  const authHeader = useAuthHeader();

  useEffect(() => {
    setCurrentPageData((prevState) => ({
      ...prevState,
      rowData: [],
      isLoading: true,
    }));

    fetchUsers(0, pageSize, currentPage);
  }, [currentPage, pageSize]);
  async function fetchUsers(offset, limit, pageNumber) {
    try {
      const usersData = await getUsers(
        authHeader,
        offset,
        limit,
        pageNumber,
        search
      );
      setCurrentPageData({
        rowData: usersData.result,
        isLoading: false,
        totalPages: usersData.pages,
        totalData: usersData.total,
      });
    } catch (error) {
      console.error(error);
      setError(error);
      showToast("error", error.message, hideToastMessage);
    }
  }

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.username, {
      id: "username",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Username</span>,
    }),
    columnHelper.accessor("name", {
      header: () => "Nama OPD",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("admin_role_id", {
      header: () => <span>Level User</span>,
      cell: (info) => (info.renderValue() === 1 ? "Super Admin" : "User OPD"),
    }),
    columnHelper.accessor((row) => row.aksi, {
      id: "aksi",
      size: 10,
      cell: (props) => {
        const rowId = props.row.original.id;
        return (
          <div className="flex justify-end">
            <Link to={`edit/${rowId}`}>
              <Button
                className="text-sm font-normal"
                textColor="text-blue-500"
                icon={<PencilIcon className="w-4 h-4" />}>
                Edit
              </Button>
            </Link>
            <Link to={`detail/${rowId}`}>
              <Button
                className="text-sm font-normal"
                textColor="text-blue-500"
                icon={<EyeIcon className="w-4 h-4" />}>
                Lihat
              </Button>
            </Link>

            <Dialog>
              <DialogTrigger>
                <Button
                  className="text-sm font-normal"
                  type="modal"
                  textColor="text-red-500"
                  icon={<TrashIcon className="w-4 h-4" />}>
                  Hapus
                </Button>
              </DialogTrigger>

              <DialogContent className="py-12 w-1/3">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="p-6 bg-[#FFDADA] w-fit rounded-lg">
                    <img src={TrashImg} />
                  </div>

                  <div>
                    <h1 className="mt-6 font-semibold text-lg leading-7 text-dark-gray">
                      Apakah Anda yakin menghapus ini?
                    </h1>
                    <div className="flex space-x-3 justify-center">
                      <DialogClose>
                        <Button
                          className="w-full md:w-28 mt-8 border border-[#EB5757]"
                          type="modal"
                          background="bg-white"
                          textColor="text-[#EB5757]">
                          Ya, hapus
                        </Button>
                      </DialogClose>
                      <DialogClose>
                        <Button
                          className="w-full md:w-28 mt-8"
                          type="modal"
                          background="bg-primary"
                          textColor="text-white">
                          Batal
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      header: () => <div className="text-right">Aksi</div>,
    }),
  ];

  async function onPageSizeChanged({ value, label }) {
    setCurrentPage(1);
    setResetPage((prevState) => !prevState);
    setPageSize(Number(value));
  }

  // function onSorting({ value, label }) {
  //   table
  //     .getHeaderGroups()[0]
  //     .headers[0].column.toggleSorting(value === "desc");
  // }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Login Akses User</h1>
        <Link to="create">
          <Button
            background="bg-primary"
            textColor={"text-white"}
            icon={<PlusIcon className="w-4 h-4" />}>
            Tambah User
          </Button>
        </Link>
      </div>

      <div className="flex justify-between mt-6">
        <div className="flex space-x-3">
          {/* Sorting Dropdown */}
          {/* <div>
            <Dropdown
              onSelect={onSorting}
              defaultValue="A - Z"
              label="Urutkan:">
              <Dropdown.Items>
                <li
                  value="asc"
                  className="block px-4 py-2 font-semibold cursor-pointer hover:bg-gray-100">
                  A - Z
                </li>
                <li
                  value="desc"
                  className="block px-4 py-2 font-semibold cursor-pointer hover:bg-gray-100">
                  Z - A
                </li>
              </Dropdown.Items>
            </Dropdown>
          </div> */}

          {/* Page Size Dropdown */}
          <div>
            <Dropdown
              onSelect={onPageSizeChanged}
              defaultValue="10"
              label="Tampilkan:"
              endLabel="Entri">
              <Dropdown.Items>
                <li
                  value="10"
                  className="block px-4 py-2 font-semibold cursor-pointer hover:bg-gray-100">
                  10
                </li>
                <li
                  value="50"
                  className="block px-4 py-2 font-semibold cursor-pointer hover:bg-gray-100">
                  50
                </li>
                <li
                  value="100"
                  className="block px-4 py-2 font-semibold cursor-pointer hover:bg-gray-100">
                  100
                </li>
              </Dropdown.Items>
            </Dropdown>
          </div>
        </div>

        {/* <div className="relative w-1/3">
          <DebouncedInput
            initialValue={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        </div> */}
      </div>

      <div className="w-full h-full mt-6 bg-white rounded-lg">
        <Table
          columns={columns}
          data={pageData.rowData}
          isLoading={pageData.isLoading}
        />

        <Pagination
          totalRows={pageData.totalData}
          pageChangeHandler={setCurrentPage}
          rowsPerPage={pageSize}
          resetPage={resetPage}
        />
      </div>
    </>
  );
}

export default LoginAksesTable;
