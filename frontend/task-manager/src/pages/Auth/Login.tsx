import { useState } from "react";
import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";

import { Link } from "react-router";
import { validateEmail, validatePassword } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState({});

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError((err) => {
        return { ...err, email: "Please enter a valid email address." };
      });
      return;
    }
    if (!validatePassword(password)) {
      setError((err) => {
        return { ...err, password: "Please enter a valid password." };
      });
      return;
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-3 h-[500px] ">
        <h3>Welcome Back</h3>
        <p className="text-secondary">Please enter your details to log in</p>
        <form className="flex flex-col gap-5 max-w-[500px]">
          <Input
            key="email"
            placeHolder="name@xmail.com"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError((err) => {
                return { ...err, email: "" };
              });
            }}
            error={error?.email || ""}
          />
          <Input
            key="password"
            placeHolder="Min 8 Characters"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError((err) => {
                return { ...err, password: "" };
              });
            }}
            error={error?.password || ""}
          />
          <Button text={"LOGIN"} variant="primary" onClick={handleLogin} />
        </form>
        <p className="mt-4">
          Don't have an account?{" "}
          <Link
            className="cursor-pointer text-primary underline hover:font-semibold"
            to={"/signup"}
          >
            SignUp
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
