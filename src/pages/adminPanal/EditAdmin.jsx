// EditAdmin.jsx

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Checkbox,
  Select,
  message,
  Spin,
  Divider,
} from "antd";
import { useUpdateAdminMutation } from "../../redux/api/adminPanalApi";

/* ================= ENUMS ================= */

export const ENUM_ADMIN_PERMISSION = {
  USER: "USER",
  BLOCK_USER: "BLOCK_USER",
  DELETE_USER: "DELETE_USER",
VIEW_USER: "VIEW_USER",
  LISTING: "LISTING",
  APPROVE_LISTING: "APPROVED_LISTING",
  REJECTE_LISTING: "REJECTED_LISTING",
  DELETE_LISTING: "DELETE_LISTING",
    VIEW_LISTING: "VIEW_LISTING",
  EDIT_LISTING: "EDIT_LISTING",
  ADD_METADATA: "ADD_METADATA",

  EARNING: "EARNING",
  TOTAL_EARNING: "TOTAL_EARNING",
  EARNING_GROWTH_CHART: "EARNING_GROWTH_CHART",
  TRANSACTION_HISTORY: "TRANSACTION_HISTORY",

  CATEGORY: "CATEGORY",
  ADD_CATEGORY: "ADD_CATEGORY",
  EDIT_CATEGORY: "EDIT_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",

  COUPON: "COUPON",
  ADD_COUPON: "ADD_COUPON",
  EDIT_COUPON: "EDIT_COUPON",
  DELETE_COUPON: "DELETE_COUPON",

  BLOG: "BLOG",
  ADD_BLOG: "ADD_BLOG",
  EDIT_BLOG: "EDIT_BLOG",
  DELETE_BLOG: "DELETE_BLOG",

  FAQ: "FAQ",
  ADD_FAQ: "ADD_FAQ",
  EDIT_FAQ: "EDIT_FAQ",
  DELETE_FAQ: "DELETE_FAQ",

  SUBSCRIPTION: "SUBSCRIPTION",
  EDIT_PRICE: "EDIT_PRICE",
  EDIT_FEATURE: "EDIT_FEATURE",

  SUBSCRIBER_LIST: "SUBSCRIBER_LIST",
  NDA: "NDA",
  PRIVACY_POLICY: "PRIVACY_POLICY",
  TERMS_CONDITIONS: "TERMS_CONDITIONS",
  REFUND_POLICY: "REFUND_POLICY",
};

export const ENUM_ADMIN_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
};

/* ================= PERMISSION GROUPS ================= */

const permissionGroups = [
  {
    title: "User Management",
    parent: ENUM_ADMIN_PERMISSION.USER,
    children: [
      ENUM_ADMIN_PERMISSION.BLOCK_USER,
      ENUM_ADMIN_PERMISSION.DELETE_USER,
      ENUM_ADMIN_PERMISSION.VIEW_USER,
    ],
  },
  {
    title: "Listing Management",
    parent: ENUM_ADMIN_PERMISSION.LISTING,
    children: [
      ENUM_ADMIN_PERMISSION.APPROVE_LISTING,
      ENUM_ADMIN_PERMISSION.REJECTE_LISTING,
      ENUM_ADMIN_PERMISSION.DELETE_LISTING,
      ENUM_ADMIN_PERMISSION.VIEW_LISTING,
      ENUM_ADMIN_PERMISSION.EDIT_LISTING,
      ENUM_ADMIN_PERMISSION.ADD_METADATA,
    ],
  },
  {
    title: "Earning Management",
    parent: ENUM_ADMIN_PERMISSION.EARNING,
    children: [
      ENUM_ADMIN_PERMISSION.TOTAL_EARNING,
      ENUM_ADMIN_PERMISSION.EARNING_GROWTH_CHART,
      ENUM_ADMIN_PERMISSION.TRANSACTION_HISTORY,
    ],
  },
  {
    title: "Category Management",
    parent: ENUM_ADMIN_PERMISSION.CATEGORY,
    children: [
      ENUM_ADMIN_PERMISSION.ADD_CATEGORY,
      ENUM_ADMIN_PERMISSION.EDIT_CATEGORY,
      ENUM_ADMIN_PERMISSION.DELETE_CATEGORY,
    ],
  },
  {
    title: "Coupon Management",
    parent: ENUM_ADMIN_PERMISSION.COUPON,
    children: [
      ENUM_ADMIN_PERMISSION.ADD_COUPON,
      ENUM_ADMIN_PERMISSION.EDIT_COUPON,
      ENUM_ADMIN_PERMISSION.DELETE_COUPON,
    ],
  },
  {
    title: "Blog Management",
    parent: ENUM_ADMIN_PERMISSION.BLOG,
    children: [
      ENUM_ADMIN_PERMISSION.ADD_BLOG,
      ENUM_ADMIN_PERMISSION.EDIT_BLOG,
      ENUM_ADMIN_PERMISSION.DELETE_BLOG,
    ],
  },
  {
    title: "FAQ Management",
    parent: ENUM_ADMIN_PERMISSION.FAQ,
    children: [
      ENUM_ADMIN_PERMISSION.ADD_FAQ,
      ENUM_ADMIN_PERMISSION.EDIT_FAQ,
      ENUM_ADMIN_PERMISSION.DELETE_FAQ,
    ],
  },
  {
    title: "Subscription Management",
    parent: ENUM_ADMIN_PERMISSION.SUBSCRIPTION,
    children: [
      ENUM_ADMIN_PERMISSION.EDIT_PRICE,
      ENUM_ADMIN_PERMISSION.EDIT_FEATURE,
    ],
  },

  // Single Permission Groups (No Children)
  {
    title: "Subscriber List Access",
    parent: ENUM_ADMIN_PERMISSION.SUBSCRIBER_LIST,
    children: [],
  },
  {
    title: "NDA Management",
    parent: ENUM_ADMIN_PERMISSION.NDA,
    children: [],
  },
  {
    title: "Privacy Policy Management",
    parent: ENUM_ADMIN_PERMISSION.PRIVACY_POLICY,
    children: [],
  },
  {
    title: "Terms & Conditions Management",
    parent: ENUM_ADMIN_PERMISSION.TERMS_CONDITIONS,
    children: [],
  },
  {
    title: "Refund Policy Management",
    parent: ENUM_ADMIN_PERMISSION.REFUND_POLICY,
    children: [],
  },
];

/* ================= COMPONENT ================= */

const EditAdmin = ({
  openEditModal,
  setOpenEditModal,
  selectedUser,
}) => {
  const [updateAdmin] = useUpdateAdminMutation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      setSelectedPermissions(
        selectedUser.role === ENUM_ADMIN_ROLE.ADMIN
          ? selectedUser.access
          : []
      );

      setSelectedRole(selectedUser.role);

      form.setFieldsValue({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
  }, [selectedUser]);

  const handleCancel = () => {
    setOpenEditModal(false);
    form.resetFields();
    setSelectedPermissions([]);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const body = {
        name: values.name,
        role: values.role,
        permissions:
          values.role === ENUM_ADMIN_ROLE.ADMIN
            ? selectedPermissions
            : [],
      };

      await updateAdmin({
        id: selectedUser.id,
        data: body,
      }).unwrap();

      message.success("Admin updated successfully!");
      setOpenEditModal(false);
    } catch {
      message.error("Failed to update admin");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PERMISSION LOGIC ================= */

  const handleParentToggle = (checked, group) => {
    if (group.children.length === 0) {
      // Single permission group
      if (checked) {
        setSelectedPermissions([
          ...new Set([...selectedPermissions, group.parent]),
        ]);
      } else {
        setSelectedPermissions(
          selectedPermissions.filter((p) => p !== group.parent)
        );
      }
      return;
    }

    // Group with children
    if (checked) {
      setSelectedPermissions([
        ...new Set([
          ...selectedPermissions,
          group.parent,
          ...group.children,
        ]),
      ]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter(
          (p) =>
            p !== group.parent &&
            !group.children.includes(p)
        )
      );
    }
  };

  const handleChildToggle = (checked, child, group) => {
    if (checked) {
      const updated = [...selectedPermissions, child];

      if (!updated.includes(group.parent)) {
        updated.push(group.parent);
      }

      setSelectedPermissions([...new Set(updated)]);
    } else {
      const updated = selectedPermissions.filter(
        (p) => p !== child
      );

      const stillHasChild = group.children.some((c) =>
        updated.includes(c)
      );

      if (!stillHasChild) {
        setSelectedPermissions(
          updated.filter((p) => p !== group.parent)
        );
      } else {
        setSelectedPermissions(updated);
      }
    }
  };

  /* ================= UI ================= */

  return (
    <Modal
      centered
      open={openEditModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
      title={`Edit Admin - ${selectedUser?.name}`}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true }]}
        >
          <Select
            onChange={(value) => {
              setSelectedRole(value);
              if (value === ENUM_ADMIN_ROLE.SUPER_ADMIN) {
                setSelectedPermissions([]);
              }
            }}
          >
            <Select.Option value={ENUM_ADMIN_ROLE.ADMIN}>
              ADMIN
            </Select.Option>
            <Select.Option value={ENUM_ADMIN_ROLE.SUPER_ADMIN}>
              SUPER_ADMIN
            </Select.Option>
          </Select>
        </Form.Item>

        {selectedRole === ENUM_ADMIN_ROLE.ADMIN && (
          <>
            <Divider orientation="left">
              Permissions
            </Divider>

            {permissionGroups.map((group) => (
              <div
                key={group.parent}
                className="mb-4 p-4 bg-gray-50 rounded-xl border"
              >
                <Checkbox
                  checked={selectedPermissions.includes(
                    group.parent
                  )}
                  onChange={(e) =>
                    handleParentToggle(
                      e.target.checked,
                      group
                    )
                  }
                  className="font-semibold text-[#3872F0]"
                >
                  {group.title}
                </Checkbox>

                {group.children.length > 0 && (
                  <div className="ml-6 mt-3 grid grid-cols-2 gap-2">
                    {group.children.map((child) => (
                      <Checkbox
                        key={child}
                        checked={selectedPermissions.includes(
                          child
                        )}
                        onChange={(e) =>
                          handleChildToggle(
                            e.target.checked,
                            child,
                            group
                          )
                        }
                      >
                        {child.replaceAll("_", " ")}
                      </Checkbox>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <Form.Item>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E63946] text-white rounded"
          >
            {loading ? (
              <>
                <Spin size="small" /> Updating...
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