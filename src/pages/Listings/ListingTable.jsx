import React from "react";
import { ConfigProvider, Modal, Table } from "antd";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import {
  useGetAllListingsQuery,
  useUpdateListingMutation,
  useDeleteListingMutation,
} from "../../redux/api/listingApi";
import Loader from "../../Components/Loaders/Loader";
import { getImageBaseUrl } from "../../config/envConfig";
import Swal from "sweetalert2";
import img from "../../assets/icons/user.png";
import { useGetUserProfileQuery } from "../../redux/api/profileApi";
import EditMeta from "./EditMeta";

export default function ListingTable({ businessRole = "", status = "" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  // console.log("selectedListing", selectedListing);
  const [page, setPage] = useState(1);
  const [activeAction, setActiveAction] = useState(null);
  const navigate = useNavigate();
  const toPlainText = (html) => {
    if (!html) return "";
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    } catch (e) {
      return String(html)
        .replace(/<[^>]+>/g, " ")
        .trim();
    }
  };

  // Fetch listings data from API with filters
  const { data: listingsData, isLoading } = useGetAllListingsQuery({
    businessRole: businessRole || undefined,
    status: status || undefined,
    page,
    limit: 10,
  });
  console.log("listingsData from list page", listingsData);

  // Update listing mutation
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();
  const [deleteListing, { isLoading: isDeleting }] = useDeleteListingMutation();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState(null);
  const showModal = (record) => {
    setSelectedListing(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (record) => {
    if (!record?._id) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete "${record?.title || "this listing"}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteListing({ businessId: record._id }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `Listing "${
            record?.title || ""
          }" has been deleted successfully.`,
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.data?.message ||
            "Failed to delete listing. Please try again.",
        });
      }
    }
  };

  const handleApprove = async () => {
    if (!selectedListing) return;
    console.log(selectedListing._id);
    try {
      const wasApproved = selectedListing?.isApproved === true;
      await updateListing({
        businessId: selectedListing._id,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: wasApproved ? "Rejected!" : "Approved!",
        text: wasApproved
          ? `Listing "${
              selectedListing?.title || ""
            }" has been rejected successfully!`
          : `Listing "${
              selectedListing?.title || ""
            }" has been approved successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve listing. Please try again.",
      });
    }
    setActiveAction(null);
  };

  const handleApproveClick = async (action) => {
    setActiveAction(action); // 'approve' or 'reject'
    await handleApprove();
  };
  const { data: userProfileData } = useGetUserProfileQuery();
  const currentUser = userProfileData?.data;
  const dataSource = listingsData?.data?.map((listing, index) => ({
    key: listing._id || index,
    no: index + 1 + (page - 1) * 10,
    userName: listing?.user?.name || "N/A",
    email: listing?.user?.email || "N/A",
    userImg: listing?.user?.image,
    productName: listing?.title || "N/A",
    catrgory: listing?.category || "N/A",
    productImg: listing?.image,
    price: listing?.price || "N/A",
    views: listing?.views || "N/A",
    date: listing?.createdAt
      ? new Date(listing?.createdAt).toLocaleDateString()
      : "N/A",
    title: listing?.title,
    category: listing?.category || "N/A",
    subCategory: listing?.subCategory || "N/A",
    businessType: listing?.businessType || "N/A",
    ownerShipType: listing?.ownerShipType || "N/A",
    askingPrice: listing?.askingPrice || "N/A",
    buyerViewCount: listing?.user?.buyerViewCount || 0,
    countryName: listing?.countryName || "N/A",
    state: listing?.state || "N/A",
    city: listing?.city || "N/A",
    reason: listing?.reason || "N/A",
    description: listing?.description || "N/A",
    isApproved: listing?.isApproved || "N/A",
    ...listing,
  }));
  const handleEditClick = (user) => {
    setSelectedMeta(user);
    setOpenEditModal(true);
  };
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "User Info",
      key: "User Info",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
            src={
              record?.userImg
                ? `${getImageBaseUrl()}/profile-image/${record?.userImg}`
                : img
            }
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <div className="flex flex-col items-start justify-center">
            <span>{record?.userName || "No Name"}</span>
            <span>{record?.email || "No Email"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Listing Info",
      key: "Listing Info",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record?.productImg
                ? `${getImageBaseUrl()}/business-image/${record?.productImg}`
                : "https://avatar.iran.liara.run/public/21"
            }
            className="w-10 h-10 object-cover rounded"
            alt="Product Image"
          />
          <div className="flex flex-col items-start justify-center">
            <span>{record?.productName}</span>
            <span>{record?.catrgory}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
    },
    {
      title: "Contact View",
      dataIndex: "buyerViewCount",
      key: "buyerViewCount",
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <span className="text-lg font-semibold">${record?.price}</span>
      ),
    },
    {
      title: "Posted On",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "business location",
      dataIndex: "countryName",
      key: "countryName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

        const canBlock =
          isSuperAdmin || currentUser?.permissions?.includes("EDIT_LISTING");

        const canDelete =
          isSuperAdmin || currentUser?.permissions?.includes("DELETE_LISTING");


           const canMeta =
          isSuperAdmin || currentUser?.permissions?.includes("ADD_METADATA");
        return (
          <div className="flex gap-2">
                        {canMeta && (<button
              onClick={() => handleEditClick(record)}
              style={{ color: "white" }}
              className="bg-[#0091ff] cursor-pointer rounded px-2 py-1"
            >
              Edit Meta
            </button> )}
            {/* BLOCK BUTTON */}
            {canBlock && (
              <button
                onClick={() =>
                  navigate("/edit-listing-management", {
                    state: { listing: record },
                  })
                }
                className="border border-green-500 rounded-lg p-1 bg-green-100 text-green-600"
                title="Edit Listing"
              >
                <FiEdit className="w-8 h-8 text-green-600" />
              </button>
            )}

            {/* VIEW BUTTON (Always Visible) */}
            <button
              onClick={() => showModal(record)}
              className="border border-[#0091ff] rounded-lg p-1 bg-[#cce9ff] text-[#0091ff]"
              title="View Details"
            >
              <FaRegEye className="w-8 h-8 text-[#0091ff]" />
            </button>
            {/* DELETE BUTTON */}
            {canDelete && (
              <button
                onClick={() => handleDelete(record)}
                disabled={isDeleting}
                className="border border-red-500 rounded-lg p-1 bg-red-100 text-red-600"
                title="Delete Listing"
              >
                <FiTrash2
                  className={`w-8 h-8 ${
                    isDeleting ? "opacity-50" : "text-red-600"
                  }`}
                />
              </button>
            )}
          </div>
        );
      },
    },
  ];
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const canApprove =
    isSuperAdmin || currentUser?.permissions?.includes("APPROVED_LISTING");

  const canReject =
    isSuperAdmin || currentUser?.permissions?.includes("REJECTED_LISTING");
  if (isLoading) {
    return <Loader />;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            colorPrimary: "#0091ff",
            colorPrimaryHover: "#0091ff",
            itemActiveBg: "#0091ff",
            itemActiveColor: "#ffffff",
            colorBgTextHover: "#0091ff",
            colorText: "#0091ff",
          },
          Table: {
            headerBg: "#0091ff",
            headerColor: "rgb(255,255,255)",
            cellFontSize: 16,
            headerSplitColor: "#0091ff",
          },
        },
      }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 10,
          total: listingsData?.meta?.total || dataSource?.length || 0,
          current: page,
          showSizeChanger: false,
          onChange: (newPage) => setPage(newPage),
        }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        open={isModalOpen}
        centered
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
        className="p-0"
        bodyStyle={{ padding: 0, borderRadius: "12px", overflow: "hidden" }}
      >
        <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-lg shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            <img
              src={
                selectedListing?.business_image
                  ? `${getImageBaseUrl()}/business-image/${selectedListing.business_image}`
                  : selectedListing?.image
                    ? `${getImageBaseUrl()}/business-image/${selectedListing.image}`
                    : "https://avatar.iran.liara.run/public/21"
              }
              alt={selectedListing?.title || "Business Listing"}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">
                {selectedListing?.title || "Business Listing"}
              </h1>
              <p className="mt-1 text-lg font-semibold text-white">
                Price: ${selectedListing?.price || 0} USD
              </p>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-2 space-y-6">
            {/* Business Details Card */}
            <div className="bg-white shadow-md rounded-lg p-5 space-y-4 border-l-4 border-indigo-500">
              <h2 className="text-xl font-semibold text-gray-800">
                Business Details
              </h2>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Role:</span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    {selectedListing?.businessRole || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Category:</span>
                  <span>{selectedListing?.category || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedListing?.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedListing?.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Views:</span>
                  <span>{selectedListing?.buyerViewCount || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Listed By:</span>
                  <span>{selectedListing?.user?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Location:</span>
                  <span>{selectedListing?.country || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Description & Additional Info */}
            <div className="bg-white shadow-md rounded-lg p-5 space-y-3 border-l-4 border-pink-500">
              <h3 className="text-lg font-semibold text-gray-800">
                Description
              </h3>
              <p className="text-gray-700">
                {toPlainText(selectedListing?.description) ||
                  "No description available for this business listing."}
              </p>
              {selectedListing?.additionalInfo && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Additional Information
                  </h3>
                  <p className="text-gray-700">
                    {selectedListing.additionalInfo}
                  </p>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-white shadow-md rounded-lg p-5 space-y-3 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-800">
                Contact Information
              </h3>
              <div className="flex justify-between text-gray-700">
                <span>Email:</span>
                <span className="font-semibold">
                  {selectedListing?.user?.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Posted Date:</span>
                <span>
                  {selectedListing?.createdAt
                    ? new Date(selectedListing.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {/* APPROVE BUTTON */}
              {canApprove && (
                <button
                  onClick={() => handleApproveClick("approve")}
                  disabled={isUpdating || selectedListing?.isApproved}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isUpdating && activeAction === "approve"
                    ? "Processing..."
                    : "Mark as Approve"}
                </button>
              )}

              {/* REJECT BUTTON */}
              {canReject && (
                <button
                  onClick={() => handleApproveClick("reject")}
                  disabled={isUpdating || !selectedListing?.isApproved}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isUpdating && activeAction === "reject"
                    ? "Processing..."
                    : "Mark as Rejected"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <EditMeta
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedMeta={selectedMeta}
      />
    </ConfigProvider>
  );
}
