// Admin.jsx
import { ConfigProvider, Modal, Descriptions, Divider,  Popconfirm, Table, Tag, message } from "antd";
import React, { useState, useMemo } from "react";
import PageHeading from "../../Components/Shared/PageHeading";
import AddAdmin from "./AddAdmin";
import EditAdmin from "./EditAdmin";
import { MdVisibility } from "react-icons/md";
import {
  MdBlockFlipped,
  MdOutlineCheckCircle,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import {
  useBlockUserMutation,
  useDeleteAdminMutation,
  useGetAllAdminQuery,
} from "../../redux/api/adminPanalApi";
const permissionStructure = {
  USER: ["BLOCK_USER", "DELETE_USER","VIEW_USER",],
  LISTING: [
    "APPROVED_LISTING",
    "REJECTED_LISTING",
    "DELETE_LISTING",
    "EDIT_LISTING",
    "ADD_METADATA",
    "VIEW_LISTING"
  ],
  EARNING: [
    "TOTAL_EARNING",
    "EARNING_GROWTH_CHART",
    "TRANSACTION_HISTORY",
  ],
  CATEGORY: ["ADD_CATEGORY", "EDIT_CATEGORY", "DELETE_CATEGORY"],
  BLOG: ["ADD_BLOG", "EDIT_BLOG", "DELETE_BLOG"],
  COUPON: ["ADD_COUPON", "EDIT_COUPON", "DELETE_COUPON"],
  FAQ: ["ADD_FAQ", "EDIT_FAQ", "DELETE_FAQ"],
  SUBSCRIPTION: ["EDIT_PRICE", "EDIT_FEATURE", "SUBSCRIBER_LIST"],
  LEGAL: [
    "NDA",
    "PRIVACY_POLICY",
    "TERMS_CONDITIONS",
    "REFUND_POLICY",
  ],
};
const Admin = () => {
  const { data: adminData, isLoading } = useGetAllAdminQuery();
  console.log(adminData)
  const [openViewModal, setOpenViewModal] = useState(false);
const [viewUser, setViewUser] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
const [deleteAdmin] = useDeleteAdminMutation();

  const [adminBlock] = useBlockUserMutation();

  // ✅ API Data Format
  const users = useMemo(() => {
    if (!adminData?.data) return [];

    return adminData.data.map((admin, index) => ({
      key: admin._id,
      sl: index + 1,
      id: admin._id,
      name: admin.name,
      email: admin.email,
      image:
        admin.image ||
        "https://i.pravatar.cc/100?img=" + (index + 1),
      role: admin.role,
      access:
        admin.role === "SUPER_ADMIN"
          ? ["All Access"]
          : admin.permissions,
      status: admin.isBlocked ? "blocked" : "active",
    }));
  }, [adminData]);

  // ✅ Block Toggle
  const toggleBlock = async (record) => {
    if (record.role === "SUPER_ADMIN") return;

    try {
      await adminBlock(record.id).unwrap();
      message.success("Status Updated!");
    } catch (error) {
      message.error("Failed to update status");
    }
  };
const handleDelete = async (record) => {
  if (record.role === "SUPER_ADMIN") return;

  try {
    await deleteAdmin({id:record.id}).unwrap();
    message.success("Admin Deleted Successfully!");
  } catch (error) {
    message.error("Failed to delete admin");
  }
};
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const columns = [
    { title: "SL No.", dataIndex: "sl", key: "sl", width: 60 },

    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      align: "center",
      render: (_, record) => (
        <img
          src={record.image}
          alt={record.name}
          className="w-10 h-10 object-cover rounded mx-auto"
        />
      ),
    },

    { title: "Name", dataIndex: "name", key: "name", width: 150 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 150,
      render: (role) => (
        <Tag color={role === "SUPER_ADMIN" ? "purple" : "blue"}>
          {role}
        </Tag>
      ),
    },

   
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_, record) =>
        record.status === "active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Blocked</Tag>
        ),
    },

    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
     render: (_, record) => {
  const isSuperAdmin = record.role === "SUPER_ADMIN";

  return (
    <div className="flex gap-2 justify-center">

      {/* 👁 View Button */}
      <div
        className="w-[36px] h-[36px] flex justify-center items-center text-white rounded bg-[#457B9D] cursor-pointer"
        onClick={() => {
          setViewUser(record);
          setOpenViewModal(true);
        }}
        title="View Details"
      >
        <MdVisibility />
      </div>

      {/* Block Button */}
      <div
        className={`w-[36px] h-[36px] flex justify-center items-center text-white rounded 
        ${
          isSuperAdmin
            ? "bg-gray-400 cursor-not-allowed"
            : record.status === "active"
            ? "bg-[#E63946]"
            : "bg-[#2a9d8f]"
        }`}
        onClick={() => !isSuperAdmin && toggleBlock(record)}
      >
        {record.status === "active" ? (
          <MdBlockFlipped />
        ) : (
          <MdOutlineCheckCircle />
        )}
      </div>

      {/* Edit */}
      <div
        className="w-[36px] h-[36px] flex justify-center items-center text-white rounded bg-[#1D3557] cursor-pointer"
        onClick={() => handleEditClick(record)}
      >
        <MdEdit />
      </div>

      {/* Delete */}
      {record.role !== "SUPER_ADMIN" ? (
        <Popconfirm
          title="Delete Admin"
          description="Are you sure?"
          onConfirm={() => handleDelete(record)}
        >
          <div className="w-[36px] h-[36px] flex justify-center items-center text-white rounded bg-[#E63946] cursor-pointer">
            <MdDelete />
          </div>
        </Popconfirm>
      ) : (
        <div className="w-[36px] h-[36px] flex justify-center items-center text-white rounded bg-gray-400 cursor-not-allowed">
          <MdDelete />
        </div>
      )}
    </div>
  );
}
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <PageHeading title="Admin Panel" />
        <button
        style={{color:'white'}}
          onClick={() => setOpenAddModal(true)}
          className="bg-[#3872F0] w-[150px]  py-2 rounded"
        >
          Add Admin
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#0091ff",
              headerColor: "#ffffff",
              cellFontSize: 16,
              headerSplitColor: "#0091ff",
            },
          },
        }}
      >
        <Table
          loading={isLoading}
          dataSource={users}
          columns={columns}
          scroll={{ x: "max-content" }}
          bordered
          pagination={false}
        />
      </ConfigProvider>


      <Modal
  open={openViewModal}
  onCancel={() => setOpenViewModal(false)}
  footer={null}
  width={700}
  title="Admin Details"
>
  {viewUser && (
    <>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Name">
          {viewUser.name}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {viewUser.email}
        </Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color="blue">{viewUser.role}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={viewUser.status === "active" ? "green" : "red"}>
            {viewUser.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Permissions</Divider>

      {viewUser.role === "SUPER_ADMIN" ? (
        <Tag color="purple">All Access</Tag>
      ) : (
        Object.entries(permissionStructure).map(([parent, children]) => {
          const hasParent = viewUser.access.includes(parent);
          if (!hasParent) return null;

          return (
            <div key={parent} className="mb-4">
              <h4 className="font-semibold text-[#3872F0] mb-2">
                {parent.replaceAll("_", " ")}
              </h4>

              <div className="flex flex-wrap gap-2">
                {children
                  .filter((child) => viewUser.access.includes(child))
                  .map((child) => (
                    <Tag key={child} color="cyan">
                      {child.replaceAll("_", " ")}
                    </Tag>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </>
  )}
</Modal>

      <AddAdmin
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />

      <EditAdmin
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Admin;