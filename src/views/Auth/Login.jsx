import { useIsAuthenticated, useSignIn } from 'react-auth-kit';
import { Link, Navigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import Slider from 'react-slick';

import Logo from '@/assets/images/big_logo.png';
import Img1 from '@/assets/images/img1.jpg';
import Img2 from '@/assets/images/img2.jpg';
import Img3 from '@/assets/images/img3.jpeg';
import Img4 from '@/assets/images/img4.jpeg';
import Img5 from '@/assets/images/img5.jpg';

import login from '@/api/auth/login';
import { useToastContext } from '@/context/ToastContext';

import Label from '@/components/Label';
import Loading from '@/components/Loading';
import TextInputV2 from '@/components/TextInputV2';
import ButtonV2 from '@/components/ButtonV2';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Login = () => {
  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();
  const { showToastMessage } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation(login);

  const onSubmit = (data) => {
    const { username, password } = data;

    loginMutation.mutate(
      {
        username,
        password,
      },
      {
        onSuccess: (res) => {
          if (res.statusCode === 200) {
            signIn({
              token: res.access_token,
              tokenType: 'Bearer',
              authState: res.payloadClient,
              expiresIn: 2880,
            });
          }
        },
        onError: (error) => {
          showToastMessage(
            `Terjadi kesalahan saat login: ${error.message}`,
            'error'
          );
        },
      }
    );
  };

  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="h-screen flex px-4 py-4 space-x-6"
      style={{ backgroundColor: '#063a69' }}
    >
      <div className="w-full lg:w-1/2 p-8 rounded-xl flex flex-col items-center">
        <div className="flex flex-col space-y-6 items-center lg:flex-row lg:space-y-0 lg:space-x-6">
          <img src={Logo} className="object-cover w-24 h-24" alt="Logo" />
          <div className="text-white text-center lg:text-left">
            <h1 className="text-2xl lg:text-xl">
              SISTEM INFORMASI E-MONTIR
            </h1>
            <h2 className="text-2xl lg:text-xl">KABUPATEN SORONG</h2>
          </div>
        </div>

        <div className="h-full flex justify-center items-center text-white">
          <div className="w-4/51">
            <h3 className="text-2xl font-semibold">Selamat Datang</h3>
            <h4 className="mb-6 text-gray-100">
              Login dibawah untuk akses akun Anda
            </h4>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <Label
                  htmlFor="username"
                  className="mb-2 text-white font-semibold"
                >
                  Username
                </Label>
                <TextInputV2
                  id="username"
                  name="username"
                  className="border-[#D1D5DB]"
                  placeholder="Masukan Username"
                  register={register('username', {
                    required: 'Username wajib diisi!',
                  })}
                  error={errors.username?.message}
                />
              </div>
              <div className="mb-6">
                <Label
                  htmlFor="password"
                  className="mb-2 text-white font-semibold"
                >
                  Password
                </Label>
                <TextInputV2
                  id="password"
                  type="password"
                  name="password"
                  className="border-[#D1D5DB]"
                  placeholder="Masukan Password"
                  register={register('password', {
                    required: 'Password wajib diisi!',
                  })}
                  error={errors.password?.message}
                />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border rounded border-light-gray focus:ring-3 focus:ring-blue-300"
                  />
                  <Label
                    htmlFor="remember"
                    className="ml-2 text-white font-semibold"
                  >
                    Ingatkan Saya
                  </Label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-white underline"
                >
                  Lupa Password
                </Link>
              </div>

              {loginMutation.isLoading ? (
                <Loading />
              ) : (
                <ButtonV2 className="w-full hover:bg-gray-200" type="submit">
                  Masuk
                </ButtonV2>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="w-2/3 bg-white rounded-lg overflow-hidden hidden lg:block">
        <style>{`
           .slick-dots {
             position: absolute;
             bottom: 60px;
             left: 50%;
             transform: translateX(-50%);
             z-index: 5;
           }
         `}</style>
        <div className="">
          <Slider
            dots
            infinite
            slidesToShow={1}
            slidesToScroll={1}
            speed={500}
            arrows={false}
            adaptiveHeight
            autoplay
          >
            {[Img1, Img2, Img3, Img4, Img5].map((img, index) => (
              <div key={img}>
                <img
                  src={img}
                  alt={`Gambar ${index + 1}`}
                  className="h-screen w-full object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Login;
