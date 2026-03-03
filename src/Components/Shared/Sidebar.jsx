import { NavLink, useLocation, Link } from "react-router";
import {
  BiCategory,
} from "react-icons/bi";
import { CiCircleQuestion } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import {
  LuChartNoAxesCombined,
  LuClipboardList,
  LuCrown,
} from "react-icons/lu";
import { PiMapPinArea } from "react-icons/pi";
import {
  RiCoupon4Line,
  RiDashboard2Line,
  RiUserSettingsLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { TbMessageQuestion } from "react-icons/tb";
import { useGetUserProfileQuery } from "../../redux/api/profileApi";

const Sidebar = ({ collapsed, isMobile, onClose }) => {
  const { data: userProfileData } = useGetUserProfileQuery();
  const location = useLocation();

  const user = userProfileData?.data;

  const SidebarLink = [
    {
      path: "/",
      label: "Dashboard",
      icon: <RiDashboard2Line size={24} />,
    },
    {
      path: "/user-management",
      label: "User",
      icon: <FaRegUserCircle size={24} />,
      permission: "USER",
    },
    {
      path: "/listing-management",
      label: "Listings",
      icon: <LuClipboardList size={24} />,
      permission: "LISTING",
    },
    {
      path: "/subscription",
      label: "Subscription",
      icon: <LuCrown size={24} />,
      permission: "SUBSCRIPTION",
    },
    {
      path: "/all-subscriber",
      label: "All Subscriber",
      icon: <FaListUl size={24} />,
      permission: "SUBSCRIBER_LIST",
    },
    {
      path: "/earnings-management",
      label: "Earnings",
      icon: <LuChartNoAxesCombined size={24} />,
      permission: "EARNING",
    },
    {
      path: "/NDA",
      label: "NDA",
      icon: <PiMapPinArea size={24} />,
      permission: "NDA",
    },
    {
      path: "/coupon",
      label: "Coupon",
      icon: <RiCoupon4Line size={24} />,
      permission: "COUPON",
    },
    {
      path: "/formation",
      label: "Blog",
      icon: <BiCategory size={24} />,
      permission: "BLOG",
    },
    {
      path: "/categories",
      label: "Manage Category",
      icon: <BiCategory size={24} />,
      permission: "CATEGORY",
    },
    {
      path: "/admin",
      label: "Admin Panel",
      icon: <BiCategory size={24} />,
      roleOnly: "SUPER_ADMIN",
    },
    {
      path: "/profile",
      label: "Profile Setting",
      icon: <RiUserSettingsLine size={24} />,
    },
    {
      path: "/faq-management",
      label: "FAQ",
      icon: <TbMessageQuestion size={24} />,
     permission: "FAQ",
    },
    {
      path: "/privacy-policy",
      label: "Privacy Policy",
      icon: <GoChecklist size={24} />,
 permission: "PRIVACY_POLICY",
    },
    {
      path: "/terms-condition",
      label: "Terms & Condition",
      icon: <CiCircleQuestion size={24} />,
      permission: "TERMS_CONDITIONS",
    },
    {
      path: "/refund-policy",
      label: "Refund Policy",
      icon: <CiCircleQuestion size={24} />,
     permission: "REFUND_POLICY",
    },
  ];


  const filteredSidebar = SidebarLink.filter((item) => {
    if (!user) return false;

    if (user.role === "SUPER_ADMIN") return true;


    if (user.role === "ADMIN") {

      if (item.hideForAdmin) return false;

 
      if (item.roleOnly) return false;

      if (item.permission) {
        return user.permissions?.includes(item.permission);
      }

      return true;
    }

    return false;
  });

  return (
    <div className="h-full px-2 pt-4 pb-6 flex flex-col gap-3">
      {filteredSidebar.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={isMobile ? onClose : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all
            ${
              item.path === location.pathname
                ? "bg-[#0091FF] text-white"
                : "bg-white text-[#111]"
            }`}
        >
          <span className="text-xl">{item.icon}</span>
          {(!collapsed || isMobile) && <span>{item.label}</span>}
        </NavLink>
      ))}

      {/* Logout */}
      <div className="mt-auto">
        <Link to="/login">
          <button className="flex items-center gap-3 w-full py-3 rounded-lg bg-[#bbe5fc] hover:bg-[#0091FF] text-white justify-center transition">
            <RiLogoutBoxLine size={18} />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;