import EarningManage from "./EarningManage";
import BookingChart from "./BookingChart";
import PageHeading from "../../Components/Shared/PageHeading";
import TransactionTable from "./TransactionTable";
import { useGetUserProfileQuery } from "../../redux/api/profileApi";

export default function EarningPage() {
    const { data: userProfileData } = useGetUserProfileQuery();
const currentUser = userProfileData?.data;

const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

const TOTAL_EARNING =
  isSuperAdmin ||
  currentUser?.permissions?.includes("TOTAL_EARNING");

const EARNING_GROWTH_CHART =
  isSuperAdmin ||
  currentUser?.permissions?.includes("EARNING_GROWTH_CHART");

  const TRANSACTION_HISTORY =
  isSuperAdmin ||
  currentUser?.permissions?.includes("TRANSACTION_HISTORY");
  return (
    <div>
      <PageHeading title={"Earnings"} />
      <div className="grid md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-5 gap-4">
         {TOTAL_EARNING && (<div className="col-span-2">
          <EarningManage />
        </div>)}
         {EARNING_GROWTH_CHART && (<div className="col-span-3">
          <BookingChart />
        </div>)}
      </div>
       {TRANSACTION_HISTORY && (<div className="mt-12">
        <h1 className="text-2xl font-bold text-[#0091FF] mb-5 text-start">
          Last transactions history
        </h1>
        <TransactionTable />
      </div>)}
    </div>
  );
}
