import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const Profile = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [image, setImage] = useState(null);
  
  const handleImageUpload = (e)=>{
    e.preventDefault();
    const file = e.target.files[0];
    if(!file){
      return ;
    }
    const reader = new FileReader();
    reader.onloadend=async ()=>{
      setImage(reader.result);
      await updateProfile({profilePic: reader.result});
    }
    reader.readAsDataURL(file);
  }
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-200 p-6 rounded-xl space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your Profile Information</p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={image || user.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Information Section */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-300 rounded-lg border">
                {user?.fullName}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex gap-2 items-center text-zinc-400 text-sm">
                <Mail className="size-4"></Mail>
                Email
              </div>
              <div className="border px-4 py-2.5 bg-base-300 rounded-lg">
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          {/*Foooter Section  */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{user.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
