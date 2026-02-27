// Admin.jsx
import { ConfigProvider, Popconfirm, Table, Tag, message } from "antd";
import React, { useState, useMemo } from "react";
import PageHeading from "../../Components/Shared/PageHeading";
import AddAdmin from "./AddAdmin";
import EditAdmin from "./EditAdmin";
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

const Admin = () => {
  const { data: adminData, isLoading } = useGetAllAdminQuery();
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
      title: "Access",
      key: "access",
      width: 350,
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.access.map((acc) => (
            <Tag key={acc} color="cyan">
              {acc}
            </Tag>
          ))}
        </div>
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
            {/* Block Toggle */}
            <div
              className={`w-[36px] h-[36px] flex justify-center items-center text-white rounded 
              ${
                isSuperAdmin
                  ? "bg-gray-400 cursor-not-allowed"
                  : record.status === "active"
                  ? "bg-[#E63946] cursor-pointer"
                  : "bg-[#2a9d8f] cursor-pointer"
              }`}
              onClick={() => !isSuperAdmin && toggleBlock(record)}
              title={
                isSuperAdmin
                  ? "Super Admin cannot be blocked"
                  : record.status === "active"
                  ? "Block Admin"
                  : "Unblock Admin"
              }
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

            {/* Delete (optional future API) */}
           {record.role !== "SUPER_ADMIN" ? (
  <Popconfirm
    title="Delete Admin"
    description="Are you sure you want to delete this admin?"
    onConfirm={() => handleDelete(record)}
    okText="Yes"
    cancelText="No"
  >
    <div className="w-[36px] h-[36px] flex justify-center items-center text-white rounded bg-[#E63946] cursor-pointer">
      <MdDelete />
    </div>
  </Popconfirm>
) : (
  <div
    className="w-[36px] h-[36px] flex justify-center items-center text-white rounded bg-gray-400 cursor-not-allowed"
    title="Super Admin cannot be deleted"
  >
    <MdDelete />
  </div>
)}
          </div>
        );
      },
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