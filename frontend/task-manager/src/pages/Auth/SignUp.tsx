import { useState } from "react";
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector";
import AuthLayout from "../../layouts/AuthLayout";

const SignUp = () => {
  const [profileImage, setProfileImage] = useState(null);
  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <h3>Create an Account</h3>
        <p>Join us today by entering your details below</p>
        <ProfilePhotoSelector image={profileImage} setImage={setProfileImage} />
      </div>
    </AuthLayout>
  );
};

export default SignUp;
