import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

import { useCourses, type CourseInput } from '../features/courses/useCourses'
import { useDebounce } from '../shared/hooks/useDebounce'
import {
  COURSE_CAPACITY_MAX,
  COURSE_CAPACITY_MIN,
  COURSE_NAME_MIN_LENGTH,
  SEARCH_DEBOUNCE_MS,
  TABLE_PAGE_SIZE,
} from '../shared/constants'
import type { Course, CourseStatus } from '../shared/types'
import { normalizeForSearch } from '../shared/validation'

const statusOptions: { value: CourseStatus; label: string }[] = [
  { value: 'open', label: 'Mở' },
  { value: 'closed', label: 'Đóng' },
]

export const CoursesPage = () => {
  const {
    courses,
    seatsTakenByCourse,
    addCourse,
    updateCourse,
    removeCourse,
    changeStatus,
  } = useCourses()

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form] = Form.useForm<CourseInput>()

  const filtered = useMemo(() => {
    const q = normalizeForSearch(debouncedQuery)
    if (!q) return courses
    return courses.filter((c) => normalizeForSearch(c.name).includes(q))
  }, [courses, debouncedQuery])

  const openCreate = () => {
    setEditing(null)
    form.setFieldsValue({ status: 'open', capacity: COURSE_CAPACITY_MIN, name: '' })
    setOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditing(course)
    form.setFieldsValue({
      name: course.name,
      status: course.status,
      capacity: course.capacity,
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const success = editing ? updateCourse(editing.id, values) : addCourse(values)
    if (success) setOpen(false)
  }

  const columns: ColumnsType<Course> = [
    {
      title: 'Tên khoá học',
      dataIndex: 'name',
      key: 'name',
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: CourseStatus, record) => (
        <Select
          value={status}
          style={{ width: '100%' }}
          options={statusOptions}
          onChange={(next) => changeStatus(record.id, next)}
        />
      ),
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 140,
      render: (cap: number) => <span>{cap}</span>,
    },
    {
      title: 'Tình trạng chỗ',
      key: 'seats',
      width: 220,
      render: (_: unknown, record) => {
        const taken = seatsTakenByCourse.get(record.id) ?? 0
        const remaining = Math.max(0, record.capacity - taken)
        const full = remaining === 0
        return (
          <div className="flex items-center gap-2">
            <Tag color={full ? 'red' : 'green'}>
              {full ? 'Đã đầy' : `Còn ${remaining}`}
            </Tag>
            <Badge
              count={`${taken}/${record.capacity}`}
              style={{ backgroundColor: '#64748b' }}
            />
          </div>
        )
      },
    },
    {
      title: '',
      key: 'actions',
      width: 220,
      render: (_: unknown, record) => (
        <div className="flex justify-end gap-2">
          <Button onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xoá khoá học?"
            description="Các đăng ký liên quan sẽ bị xoá để dữ liệu nhất quán."
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => removeCourse(record.id)}
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
            placeholder="Tìm theo tên khoá học"
            className="w-full sm:w-[360px]"
            allowClear
          />
          <Button type="primary" onClick={openCreate}>
            Thêm khoá học
          </Button>
        </div>
      </Card>

      <Card className="shadow-sm" styles={{ body: { padding: 0 } }}>
        <Table<Course>
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: TABLE_PAGE_SIZE }}
        />
      </Card>

      <Modal
        open={open}
        title={editing ? 'Sửa khoá học' : 'Thêm khoá học'}
        okText={editing ? 'Lưu' : 'Tạo'}
        cancelText="Huỷ"
        onCancel={() => setOpen(false)}
        onOk={() => void handleSubmit()}
        destroyOnClose
      >
        <Form<CourseInput> layout="vertical" form={form} preserve={false}>
          <Form.Item
            label="Tên khoá học"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khoá học' },
              { min: COURSE_NAME_MIN_LENGTH, message: 'Tên quá ngắn' },
            ]}
          >
            <Input placeholder="VD: ReactJS cơ bản" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item
            label="Giới hạn học viên"
            name="capacity"
            rules={[
              { required: true, message: 'Vui lòng nhập sức chứa' },
              {
                validator: async (_, value: unknown) => {
                  const v = typeof value === 'number' ? value : NaN
                  if (
                    !Number.isFinite(v) ||
                    v < COURSE_CAPACITY_MIN ||
                    v > COURSE_CAPACITY_MAX
                  ) {
                    throw new Error(
                      `Sức chứa phải từ ${COURSE_CAPACITY_MIN} đến ${COURSE_CAPACITY_MAX}`,
                    )
                  }
                },
              },
            ]}
          >
            <InputNumber
              min={COURSE_CAPACITY_MIN}
              max={COURSE_CAPACITY_MAX}
              className="w-full"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
