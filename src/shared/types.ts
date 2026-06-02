export type EntityId = string

export type Student = {
  id: EntityId
  fullName: string
  email: string
  phone: string
}

export type CourseStatus = 'open' | 'closed'

export type Course = {
  id: EntityId
  name: string
  status: CourseStatus
  capacity: number
}

export type Enrollment = {
  id: EntityId
  studentId: EntityId
  courseId: EntityId
  createdAtIso: string
}

