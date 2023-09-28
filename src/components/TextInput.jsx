import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

export default function TextInput({
  className,
  type,
  placeholder,
  disabled,
  leadingIcon,
  trailingIcon,
  error,
  register,
  width = 'max-w-md',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const disabledClass = disabled
    ? 'bg-[#F2F2F2] border border-[#BDBDBD]'
    : 'bg-white border border-dark-gray';
  const errorClass = error ? 'border-red-600' : '';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between rounded-lg px-4 py-2.5 my-2 ${width} ${disabledClass} ${errorClass} ${className}`}
      >
        <div className="flex items-center w-full">
          {leadingIcon && <p className="text-sm ml-3">Rp</p>}
          <input
            type={showPassword ? 'text' : type}
            placeholder={placeholder}
            disabled={disabled}
            className={` p-0 text-gray-900 bg-transparent text-sm focus:ring-0 border-0 w-full focus:outline-none`}
            {...register}
          />
        </div>
        {type === 'password' && !trailingIcon && (
          <button
            type="button"
            className="flex items-center focus:border-none focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeIcon className="w-4 h-4 text-dark-gray" />
            ) : (
              <EyeSlashIcon className="w-4 h-4 text-dark-gray" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </>
  );
}
