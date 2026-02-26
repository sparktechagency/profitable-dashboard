// EditAdmin.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Checkbox, Select, message, Spin } from "antd";
import { useUpdateAdminMutation } from "../../redux/api/adminPanalApi";
export const ENUM_ADMIN_PERMISSION = {
  USER: "USER",
  LISTING: "LISTING",
  EARNING: "EARNING",
  CATEGORY: "CATEGORY",
  SUBSCRIPTION: "SUBSCRIPTION",
  SUBSCRIBER_LIST: "SUBSCRIBER_LIST",
  COUPON: "COUPON",
  BLOG: "BLOG",
  NDA: "NDA",
};

export const ENUM_ADMIN_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
};

const { Option } = Select;

const permissionOptions = Object.values(ENUM_ADMIN_PERMISSION);

const EditAdmin = ({
  openEditModal,
  setOpenEditModal,
  selectedUser,
}) => {
  const [updateAdmin] = useUpdateAdminMutation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        permissions:
          selectedUser.role === ENUM_ADMIN_ROLE.ADMIN
            ? selectedUser.access
            : [],
      });

      setSelectedRole(selectedUser.role);
    }
  }, [selectedUser, form]);

  const handleCancel = () => {
    setOpenEditModal(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const body = {
        name: values.name,
        role: values.role,
      };

    
      if (values.role === ENUM_ADMIN_ROLE.ADMIN) {
        body.permissions = values.permissions || [];
      }

      await updateAdmin({
        id: selectedUser.id,
        data:body,
      }).unwrap();

      message.success("Admin updated successfully!");
      setOpenEditModal(false);
    } catch (error) {
      message.error("Failed to update admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      open={openEditModal}
      onCancel={handleCancel}
      footer={null}
      width={600}
      title={`Edit Admin - ${selectedUser?.name}`}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-2"
      >
        {/* Name */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input style={{ height: "40px" }} />
        </Form.Item>

        {/* Email */}
        <Form.Item label="Email" name="email">
          <Input disabled style={{ height: "40px" }} />
        </Form.Item>

        {/* Role */}
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select
            style={{ height: "40px" }}
            onChange={(value) => {
              setSelectedRole(value);

              if (value === ENUM_ADMIN_ROLE.SUPER_ADMIN) {
                form.setFieldsValue({ permissions: [] });
              }
            }}
          >
            <Option value={ENUM_ADMIN_ROLE.ADMIN}>
              ADMIN
            </Option>
            <Option value={ENUM_ADMIN_ROLE.SUPER_ADMIN}>
              SUPER_ADMIN
            </Option>
          </Select>
        </Form.Item>

        {/* Permissions */}
        <Form.Item label="Permissions" name="permissions">
          <Checkbox.Group
            options={permissionOptions}
            disabled={selectedRole === ENUM_ADMIN_ROLE.SUPER_ADMIN}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white flex justify-center items-center gap-2 ${
              loading
                ? "bg-[#fa8e97] cursor-not-allowed"
                : "bg-[#E63946] hover:bg-[#941822]"
            }`}
          >
            {loading ? (
              <>
                <Spin size="small" />
                <span>Updating...</span>
              </>
            ) : (
              "Update"
            )}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAdmin;