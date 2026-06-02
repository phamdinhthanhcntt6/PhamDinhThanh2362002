import { Button, Card, Form, Input, Modal, Popconfirm, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

import { useStudents, type StudentInput } from '../features/students/useStudents'
import { useDebounce } from '../shared/hooks/useDebounce'
import {
  SEARCH_DEBOUNCE_MS,
  STUDENT_NAME_MIN_LENGTH,
  TABLE_PAGE_SIZE,
} from '../shared/constants'
import type { Student } from '../shared/types'
import { isValidEmail, isValidPhone } from '../shared/validation'

export const StudentsPage = () => {
  const { students, addStudent, updateStudent, removeStudent } = useStudents()

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form] = Form.useForm<StudentInput>()

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) =>
      `${s.fullName} ${s.email} ${s.phone}`.toLowerCase().includes(q),
    )
  }, [debouncedQuery, students])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (student: Student) => {
    setEditing(student)
    form.setFieldsValue({
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const success = editing
      ? updateStudent(editing.id, values)
      : addStudent(values)
    if (success) setOpen(false)
  }

  const columns: ColumnsType<Student> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    {
      title: '',
      key: 'actions',
      width: 220,
      render: (_: unknown, record) => (
        <div className="flex justify-end gap-2">
          <Button onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xoá học viên?"
            description="Các đăng ký liên quan cũng sẽ bị xoá để đảm bảo dữ liệu nhất quán."
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => removeStudent(record.id)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <Card size="small" className="shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên / email / sđt"
            className="w-full sm:w-[360px]"
            allowClear
          />
          <Button type="primary" onClick={openCreate}>
            Thêm học viên
          </Button>
        </div>
      </Card>

      <Card className="shadow-sm" styles={{ body: { padding: 0 } }}>
        <Table<Student>
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: TABLE_PAGE_SIZE }}
        />
      </Card>

      <Modal
        open={open}
        title={editing ? 'Sửa học viên' : 'Thêm học viên'}
        okText={editing ? 'Lưu' : 'Tạo'}
        cancelText="Huỷ"
        onCancel={() => setOpen(false)}
        onOk={() => void handleSubmit()}
        destroyOnClose
      >
        <Form<StudentInput> layout="vertical" form={form} preserve={false}>
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' },
              { min: STUDENT_NAME_MIN_LENGTH, message: 'Họ tên quá ngắn' },
            ]}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              {
                validator: async (_, value: unknown) => {
                  const v = typeof value === 'string' ? value : ''
                  if (!isValidEmail(v.trim())) {
                    throw new Error('Email không hợp lệ')
                  }
                },
              },
            ]}
          >
            <Input placeholder="name@company.com" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              {
                validator: async (_, value: unknown) => {
                  const v = typeof value === 'string' ? value : ''
                  if (!isValidPhone(v.trim())) {
                    throw new Error('SĐT phải 9-11 chữ số')
                  }
                },
              },
            ]}
          >
            <Input inputMode="numeric" placeholder="VD: 0901234567" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
