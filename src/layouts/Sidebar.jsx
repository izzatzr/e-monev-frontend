/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import {
  //   HiOutlineDocumentReport,
  //   HiOutlineHome,
  HiOutlineLocationMarker,
  //   HiOutlineUser,
} from 'react-icons/hi';
import { LiaMoneyCheckAltSolid, LiaUserLockSolid } from 'react-icons/lia';
import { SlOrganization } from 'react-icons/sl';
// import { RiGroup2Line } from 'react-icons/ri';
import {
  // MdOutlineHistory,
  MdOutlineSettings,
} from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';
import {
  // ClipboardDocumentListIcon,
  DocumentIcon,
  HomeIcon,
  // ListBulletIcon,
  // QueueListIcon,
  TableCellsIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import Logo from '../assets/images/big_logo.png';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../components/DialogContent';
import LogoutImg from '../assets/images/logout.png';
import Button from '../components/Button';

const Sidebar = ({ isOpen }) => {
  const signOut = useSignOut();
  const authUser = useAuthUser();

  const sidebarList = [
    {
      path: '/',
      label: 'Beranda',
      icon: <HomeIcon width={21} height={22} />,
      // label: 'Dashboard',
      // icon: <HiOutlineHome size={24} />,
      roles: ['superadmin', 'opd', 'admin bidang'],
    },
    {
      path: '/akun-saya',
      label: 'Akun Saya',
      icon: <UserIcon width={21} height={22} />,
      // icon: <HiOutlineUser size={24} />,
      roles: ['superadmin', 'opd', 'admin bidang'],
    },
    {
      path: '/login-akses-user',
      label: 'Login Akses User',
      icon: <LiaUserLockSolid size={24} />,
      roles: ['superadmin'],
    },
    {
      path: '/sumber-dana',
      label: 'Sumber Dana',
      icon: <LiaMoneyCheckAltSolid size={24} />,
      roles: ['superadmin'],
    },
    {
      path: '/organisasi',
      label: 'Organisasi',
      icon: <SlOrganization size={24} />,
      roles: ['superadmin'],
    },
    // {
    //   path: '/urusan',
    //   label: 'Urusan',
    //   icon: <QueueListIcon width={21} height={22} />,
    //   roles: ['superadmin', 'admin bidang'],
    // },
    // {
    //   path: '/program',
    //   label: 'Program',
    //   icon: <ClipboardDocumentListIcon width={21} height={22} />,
    //   roles: ['superadmin', 'admin bidang'],
    // },
    // {
    //   path: '/kegiatan',
    //   label: 'Sub-kegiatan',
    //   icon: <ListBulletIcon width={21} height={22} />,
    //   roles: ['superadmin', 'admin bidang'],
    // },
    // {
    //   path: '/sasaran',
    //   label: 'Sasaran',
    //   icon: <TargetIcon />,
    //   roles: ['superadmin', 'admin bidang'],
    // },
    {
      path: '/data-triwulan',
      label: 'Data Kegiatan Baru',
      icon: <DocumentIcon width={21} height={22} />,
      // label: 'Data Kegiatan',
      // icon: <RiGroup2Line size={24} />,
      roles: ['superadmin', 'opd'],
    },
    {
      path: '/lokasi',
      label: 'Lokasi',
      icon: <HiOutlineLocationMarker size={24} />,
      roles: ['superadmin'],
    },
    // {
    //   path: '/data-master',
    //   label: 'Data Master',
    //   icon: <AddIcon />,
    //   roles: ['opd'],
    // },
    {
      path: '/laporan',
      label: 'Laporan',
      icon: <TableCellsIcon width={21} height={22} />,
      // icon: <HiOutlineDocumentReport size={24} />,
      roles: ['superadmin', 'opd', 'admin bidang', 'atasan daerah'],
    },
    // {
    //   path: '/riwayat',
    //   label: 'Riwayat',
    //   icon: <MdOutlineHistory size={24} />,
    //   roles: ['superadmin'],
    // },
    {
      path: '/konfigurasi',
      label: 'Konfigurasi',
      icon: <MdOutlineSettings size={24} />,
      roles: ['superadmin'],
    },
  ];

  return (
    <aside
      className={`shadow-xl fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div
        className="h-full overflow-y-auto flex flex-col"
        style={{ backgroundColor: '#063a69' }}
      >
        <a
          href="/"
          className="flex items-center pl-4 py-5 border-b border-gray-20"
        >
          <img src={Logo} className="h-12 mr-4 sm:h-9" alt="E-Monev Logo" />
          <div className="flex flex-col">
            <span className="font-semibold whitespace-nowrap text-white">
              E-MONTIR
            </span>
            <span className="text-xs text-white">KABUPATEN SORONG</span>
          </div>
        </a>
        <div className="flex items-center pl-4 py-5">
          <UserIcon color='white' className="object-cover mr-4 rounded-full h-9 w-9"
            alt="Profil" />
          <div className="flex flex-col">
            <span className="font-semibold whitespace-nowrap text-white">
              {authUser()?.role?.name}
            </span>
            <span className="text-xs text-white">{authUser()?.username}</span>
          </div>
        </div>
        <ul className="space-y-2 px-6 font-medium leading-5">
          {sidebarList.map((sidebar) => {
            if (sidebar.roles.includes(authUser()?.role?.name.toLowerCase())) {
              return (
                <NavLink
                  end={sidebar.label === 'Dashboard'}
                  key={sidebar.label}
                  to={sidebar.path}
                  className={({ isActive }) =>
                    [
                      'flex items-center p-2',
                      isActive ? 'text-blue-600' : 'text-white',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  {sidebar.icon}
                  <span className="ml-3">{sidebar.label}</span>
                </NavLink>
              );
            }
            return null;
          })}
        </ul>
        <Dialog>
          <DialogContent className="py-12 w-[80%] md:max-w-sm">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-6 bg-[#FFDADA] w-fit rounded-lg">
                <img src={LogoutImg} alt="Logout" />
              </div>

              <div>
                <h1 className="mt-6 font-semibold text-lg leading-7 text-dark-gray">
                  Apakah Anda yakin keluar Dashboard ini?
                </h1>
                <div className="flex space-x-3 justify-center">
                  <DialogClose>
                    <Button
                      onClick={() => signOut()}
                      className="w-full md:w-28 mt-8 border border-[#EB5757]"
                      type="modal"
                      background="bg-white"
                      textColor="text-[#EB5757]"
                    >
                      Ya, keluar
                    </Button>
                  </DialogClose>
                  <DialogClose>
                    <Button
                      className="w-full md:w-28 mt-8"
                      type="modal"
                      background="bg-primary"
                      textColor="text-white"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogTrigger>
            {/* <div className="flex items-center px-5 py-5 border-t border-gray-20 mt-3 text-white">
              <LogoutIcon /> */}
            <div className="flex items-center px-5 py-5 border-t border-gray-20 mt-3 text-white">
              <IoMdLogOut size={24} />

              <span className="ml-3">Keluar</span>
            </div>
          </DialogTrigger>
        </Dialog>
        <div className="text-center border-t py-5 border-gray-200 mt-auto text-white text-sm">
          <div className="font-semibold">
            &#169;{new Date().getFullYear()} Baperlitbang
          </div>
          <div>Kab. Sorong</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
