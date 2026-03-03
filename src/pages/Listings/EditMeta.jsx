import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message, Modal } from "antd";
import { useAddListingMetaMutation } from "../../redux/api/listingApi";

const EditMeta = ({
  openEditModal,
  setOpenEditModal,
  selectedMeta,
}) => {
  const [form] = Form.useForm();
  const [addMeta, { isLoading }] = useAddListingMetaMutation();

  useEffect(() => {
    if (selectedMeta) {
      form.setFieldsValue({
        metaTitle: selectedMeta?.metaTitle || "",
        metaDescription: selectedMeta?.metaDescription || "",
        metaKeywords: selectedMeta?.metaKeywords || [],
      });
    } else if (openEditModal) {
      message.error("No meta data found.");
      setOpenEditModal(false);
    }
  }, [selectedMeta, openEditModal, form, setOpenEditModal]);

  /* ================= SUBMIT HANDLER ================= */

  const onFinish = async (values) => {
    try {
      const payload = {
        id: selectedMeta?._id,
        data: {
          metaTitle: values.metaTitle,
          metaDescription: values.metaDescription,
          metaKeywords: values.metaKeywords,
        },
      };

      await addMeta(payload).unwrap();

      message.success("Meta updated successfully!");

      form.resetFields();
      setOpenEditModal(false);
    } catch (error) {
      message.error("Failed to update meta");
    }
  };

  return (
    <Modal
      open={openEditModal}
      onCancel={() => setOpenEditModal(false)}
      footer={null}
      centered
      width={600}
      title="Edit Meta Information"
    >
      <Form
        form={form}
        name="editMeta"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="space-y-6"
      >
        <Form.Item
          name="metaTitle"
          label="Meta Title"
          rules={[
            { required: true, message: "Please enter meta title" },
          ]}
        >
          <Input placeholder="Enter meta title" />
        </Form.Item>

        <Form.Item
          name="metaDescription"
          label="Meta Description"
          rules={[
            {
              required: true,
              message: "Please enter meta description",
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter meta description"
          />
        </Form.Item>

        <Form.Item
          name="metaKeywords"
          label="Meta Keywords"
          rules={[
            {
              required: true,
              message: "Please enter at least one keyword",
            },
          ]}
        >
          <Select
            mode="tags"
            tokenSeparators={[","]}
            placeholder="Type and press Enter to add keywords"
          />
        </Form.Item>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <Button
            onClick={() => setOpenEditModal(false)}
            size="large"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditMeta;