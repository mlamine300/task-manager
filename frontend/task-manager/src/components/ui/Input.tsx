import { useState, type ChangeEventHandler } from "react";
import { FaEye } from "react-icons/fa6";
import { FaEyeLowVision } from "react-icons/fa6";
type inputProps = {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: string;
  placeHolder: string;
  key: string;
  error?: string;
};
const Input = ({
  label,
  value,
  onChange,
  type,
  placeHolder,
  key,
  error,
}: inputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={key}>{label} </label>

      <div className="flex flex-row justify-between items-center rounded bg-gray-hot/50 p-2 px-4 border border-gray-hot  has-focus:outline outline-primary peer">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={onChange}
          placeholder={placeHolder}
          id={key}
          className="w-full h-full focus:border-none focus:outline-none group"
        />
        {type === "password" &&
          (showPassword ? (
            <FaEyeLowVision
              className="text-gray-cold cursor-pointer"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <FaEye
              className="text-primary cursor-pointer"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          ))}
      </div>
      {error && <p className="text-red-600 text-sm ">{error}</p>}
    </div>
  );
};

export default Input;
