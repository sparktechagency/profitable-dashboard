// AddAdmin.jsx
import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Spin,
  Select,
  Divider,
} from "antd";
import { useCreateAdminMutation } from "../../redux/api/adminPanalApi";

export const ENUM_ADMIN_PERMISSION = {
  USER: "USER",
  BLOCK_USER: "BLOCK_USER",
  VIEW_USER: "VIEW_USER",
  DELETE_USER: "DELETE_USER",

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
      ENUM_ADMIN_PERMISSION.EDIT_LISTING,
      ENUM_ADMIN_PERMISSION.ADD_METADATA,
      ENUM_ADMIN_PERMISSION.VIEW_LISTING,
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

  // ✅ Now these are also proper groups
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

const AddAdmin = ({ openAddModal, setOpenAddModal }) => {
  const [addAdmin] = useCreateAdminMutation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [role, setRole] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const roleEnum =
        values.role === "Super Admin"
          ? ENUM_ADMIN_ROLE.SUPER_ADMIN
          : ENUM_ADMIN_ROLE.ADMIN;

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: roleEnum,
        permissions:
          roleEnum === ENUM_ADMIN_ROLE.SUPER_ADMIN ? [] : selectedPermissions,
      };

      const res = await addAdmin(payload).unwrap();
      message.success(res?.message);
      form.resetFields();
      setSelectedPermissions([]);
      setRole("");
      setOpenAddModal(false);
    } catch (error) {
      message.error(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- Replace handleParentToggle & add new function ----

  const handleParentToggle = (checked, group) => {
    if (checked) {
      setSelectedPermissions([
        ...new Set([...selectedPermissions, group.parent, ...group.children]),
      ]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter(
          (p) => p !== group.parent && !group.children.includes(p),
        ),
      );
    }
  };

  const handleChildToggle = (checked, child, group) => {
    if (checked) {
      const updated = [...selectedPermissions, child];

      // if any child selected → ensure parent included
      if (!updated.includes(group.parent)) {
        updated.push(group.parent);
      }

      setSelectedPermissions([...new Set(updated)]);
    } else {
      const updated = selectedPermissions.filter((p) => p !== child);

      // check if any child still selected
      const stillHasChild = group.children.some((c) => updated.includes(c));

      if (!stillHasChild) {
        // remove parent if no child selected
        setSelectedPermissions(updated.filter((p) => p !== group.parent));
      } else {
        setSelectedPermissions(updated);
      }
    }
  };

  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={() => setOpenAddModal(false)}
      footer={null}
      width={750}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-[#3872F0]">
        + Add Admin
      </h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select onChange={(val) => setRole(val)}>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Super Admin">Super Admin</Select.Option>
          </Select>
        </Form.Item>

        {role !== "Super Admin" && (
          <>
            <Divider orientation="left">Permissions</Divider>

            {permissionGroups.map((group) => (
              <div
                key={group.parent}
                className="mb-4 p-4 bg-gray-50 rounded-xl border hover:shadow-md transition"
              >
                <Checkbox
                  checked={selectedPermissions.includes(group.parent)}
                  onChange={(e) => handleParentToggle(e.target.checked, group)}
                  className="font-semibold text-[#3872F0]"
                >
                  {group.title}
                </Checkbox>

                {group.children.length > 0 && (
                  <div className="ml-6 mt-3 grid grid-cols-2 gap-2">
                    {group.children.map((child) => (
                      <Checkbox
                        key={child}
                        checked={selectedPermissions.includes(child)}
                        onChange={(e) =>
                          handleChildToggle(e.target.checked, child, group)
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

        <Form.Item className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#3872F0] text-white rounded-lg hover:bg-[#2c5cd4] transition"
          >
            {loading ? (
              <>
                <Spin size="small" /> Submitting...
              </>
            ) : (
              "Create Admin"
            )}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdmin;
