import { Button, Card, Form, Select, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'

import {
  useEnrollments,
  type EnrollmentRow,
  type RegisterInput,
} from '../features/enrollments/useEnrollments'
import { TABLE_PAGE_SIZE } from '../shared/constants'

export const EnrollmentsPage = () => {
  const { rows, studentOptions, courseOptions, register, cancel } = useEnrollments()

  const [form] = Form.useForm<RegisterInput>()
  const [submitting, setSubmitting] = useState(false)

  const handleRegister = async () => {
    try {
      setSubmitting(true)
      const values = await form.validateFields()
      if (register(values)) form.resetFields()
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnsType<EnrollmentRow> = [
    {
      title: 'Học viên',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (v: string) => <Typography.Text strong>{v}</Typography.Text>,
    },
    { title: 'Khoá học', dataIndex: 'courseName', key: 'courseName' },
    {
      title: 'Thời điểm',
      dataIndex: 'createdAtIso',
      key: 'createdAtIso',
      width: 200,
      render: (iso: string) => new Date(iso).toLocaleString(),
    },
    {
      title: '',
      key: 'actions',
      width: 140,
      render: (_: unknown, record) => (
        <div className="flex justify-end">
          <Button danger onClick={() => cancel(record.id)}>
            Huỷ
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <Form<RegisterInput> layout="vertical" form={form}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Form.Item
              label="Chọn học viên"
              name="studentId"
              rules={[{ required: true, message: 'Vui lòng chọn học viên' }]}
            >
              <Select
                showSearch
                options={studentOptions}
                placeholder="Tìm và chọn học viên"
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              label="Chọn khoá học"
              name="courseId"
              rules={[{ required: true, message: 'Vui lòng chọn khoá học' }]}
            >
              <Select
                showSearch
                options={courseOptions}
                placeholder="Chỉ chọn được khoá mở & còn chỗ"
                optionFilterProp="label"
              />
            </Form.Item>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="primary"
              loading={submitting}
              onClick={() => void handleRegister()}
            >
              Đăng ký
            </Button>
          </div>
        </Form>
      </Card>

      <Card className="shadow-sm" styles={{ body: { padding: 0 } }}>
        <Table<EnrollmentRow>
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: TABLE_PAGE_SIZE }}
        />
      </Card>
    </div>
  )
}
