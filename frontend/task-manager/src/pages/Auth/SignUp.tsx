/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/helper";
import { Link, useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { useUserContext } from "../../context/user/userContext";
import { uploadImage } from "../../utils/uploadImage";

const SignUp = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [error, seterror] = useState<any>({});
  const [pending, setpending] = useState(false);
  const { updateUser } = useUserContext();
  const navigate = useNavigate();
  const handleSignUp = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      seterror((err: any) => {
        return { ...err, email: "please enter a valide email" };
      });
      return;
    }
    if (!validatePassword(password)) {
      seterror((err: any) => {
        return { ...err, password: "please enter a valide password" };
      });
      return;
    }

    if (!validateName(fullName)) {
      seterror((err: any) => {
        return { ...err, name: "please enter a valide name" };
      });
      return;
    }
    //name, email, password, profileImageUrl, role
    setpending(true);
    let profileImageUrl;
    if (profileImage) {
      const imageResponse = await uploadImage(profileImage);
      console.log(imageResponse);
      profileImageUrl = imageResponse.imageUrl ?? "";
      console.log(profileImageUrl);
    }
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        name: fullName,
        profileImageUrl,
        email,
        password,
      });
      if (response.status === 200) {
        const { role, token } = response.data;
        localStorage.setItem("token", token);
        if (updateUser) updateUser(response.data);
        //
        if (role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/user/");
        }
      }
    } catch (error) {
      console.error(error);
    }
    setpending(false);
    seterror({});
  };
  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <h3>Create an Account</h3>
        <p>Join us today by entering your details below</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8 max-w-[600px] ">
          <div className="lg:col-span-2 w-full  flex items-center justify-center ">
            <ProfilePhotoSelector
              image={profileImage}
              setImage={setProfileImage}
            />
          </div>
          <Input
            label="Full Name"
            key="name"
            onChange={(e) => setfullName(e.target.value + "")}
            placeHolder="Justin"
            type="text"
            value={fullName}
            error={error?.name ?? ""}
          />

          <Input
            label="Email Address"
            key="email"
            onChange={(e) => setEmail(e.target.value + "")}
            placeHolder="Justin@xmail.com"
            type="email"
            value={email}
            error={error?.email ?? ""}
          />

          <Input
            label="Password"
            key="password"
            onChange={(e) => setPassword(e.target.value + "")}
            placeHolder="Min 8 Characters"
            type="password"
            value={password}
            error={error?.password ?? ""}
          />

          <Input
            label="Admin invite Token"
            key="token  "
            onChange={(e) => setAdminToken(e.target.value + "")}
            placeHolder="6 Digit Code"
            type="password"
            value={adminToken}
            error={error?.adminToken ?? ""}
          />

          <Button
            disabled={pending}
            text="SIGN UP"
            variant="primary"
            className="lg:col-span-2"
            onClick={handleSignUp}
          />
          <p className="mt-4 lg:col-span-2">
            Already have an account?{" "}
            <Link
              className="cursor-pointer text-primary underline hover:font-semibold"
              to={"/login"}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
