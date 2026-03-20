import React from "react";
import { User, Mail, Phone, Hash, Pencil } from "lucide-react";
import { IUserData } from "@/@types/interface/authinvoice.interface";

interface UserProfileCardProps {
  userData: IUserData | null;
}

const Row = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5 break-all leading-snug">
        {value}
      </p>
    </div>
  </div>
);

const UserProfileCard: React.FC<UserProfileCardProps> = ({ userData }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-[84px]">
    {/* Banner */}
    <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 px-6 pt-7 pb-9 text-white text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/20 ring-2 ring-white/30 flex items-center justify-center mx-auto mb-3">
        <User className="w-8 h-8 text-white" />
      </div>
      <p className="text-base font-bold leading-tight">
        {userData?.username || "—"}
      </p>
      <p className="text-xs text-indigo-200 mt-1 truncate">
        {userData?.email || "—"}
      </p>
    </div>

    {/* Details */}
    <div className="px-5 py-5 space-y-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
        Profile Details
      </p>
      <Row
        icon={Hash}
        label="User ID"
        value={userData?.user_id ? `${userData.user_id.slice(0, 8)}…` : "N/A"}
      />
      <Row icon={Mail} label="Email" value={userData?.email || "N/A"} />
      <Row
        icon={Phone}
        label="Mobile"
        value={userData?.mobile_number || "N/A"}
      />
    </div>

    <div className="px-5 pb-5">
      <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all">
        <Pencil className="w-3.5 h-3.5" />
        Edit Profile
      </button>
    </div>
  </div>
);

export default UserProfileCard;
