import { App } from 'antd'
import { useCallback, useMemo } from 'react'

import type { EntityId, Enrollment } from '../../shared/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCourses,
  selectEnrollments,
  selectStudents,
} from '../../store/selectors'
import {
  enrollmentAdded,
  enrollmentDeleted,
} from '../../store/slices/enrollmentsSlice'

export type EnrollmentRow = Enrollment & {
  studentName: string
  courseName: string
}

export type RegisterInput = {
  studentId: EntityId
  courseId: EntityId
}

type SelectOption = {
  value: EntityId
  label: string
  disabled?: boolean
}

export const useEnrollments = () => {
  const dispatch = useAppDispatch()
  const students = useAppSelector(selectStudents)
  const courses = useAppSelector(selectCourses)
  const enrollments = useAppSelector(selectEnrollments)
  const { message } = App.useApp()

  const studentById = useMemo(
    () => new Map(students.map((s) => [s.id, s])),
    [students],
  )
  const courseById = useMemo(
    () => new Map(courses.map((c) => [c.id, c])),
    [courses],
  )

  const takenByCourse = useMemo(() => {
    const map = new Map<EntityId, number>()
    for (const e of enrollments) {
      map.set(e.courseId, (map.get(e.courseId) ?? 0) + 1)
    }
    return map
  }, [enrollments])

  const rows: EnrollmentRow[] = useMemo(
    () =>
      enrollments
        .map((e) => {
          const student = studentById.get(e.studentId)
          const course = courseById.get(e.courseId)
          if (!student || !course) return null
          return {
            ...e,
            studentName: student.fullName,
            courseName: course.name,
          }
        })
        .filter((x): x is EnrollmentRow => x !== null),
    [courseById, enrollments, studentById],
  )

  const studentOptions: SelectOption[] = useMemo(
    () => students.map((s) => ({ value: s.id, label: `${s.fullName} (${s.phone})` })),
    [students],
  )

  const courseOptions: SelectOption[] = useMemo(
    () =>
      courses.map((c) => {
        const taken = takenByCourse.get(c.id) ?? 0
        const remaining = Math.max(0, c.capacity - taken)
        return {
          value: c.id,
          label: `${c.name} - ${c.status === 'open' ? 'Mở' : 'Đóng'} - ${taken}/${c.capacity}`,
          disabled: c.status === 'closed' || remaining === 0,
        }
      }),
    [courses, takenByCourse],
  )

  const register = useCallback(
    ({ studentId, courseId }: RegisterInput): boolean => {
      const student = studentById.get(studentId)
      const course = courseById.get(courseId)

      if (!student || !course) {
        void message.error('Dữ liệu không hợp lệ (học viên/khoá học không tồn tại)')
        return false
      }

      const isDuplicate = enrollments.some(
        (e) => e.studentId === studentId && e.courseId === courseId,
      )
      if (isDuplicate) {
        void message.warning('Học viên đã đăng ký khoá học này')
        return false
      }

      if (course.status !== 'open') {
        void message.warning('Khoá học đang đóng, không thể đăng ký')
        return false
      }

      const taken = takenByCourse.get(courseId) ?? 0
      if (taken >= course.capacity) {
        void message.warning('Khoá học đã đầy')
        return false
      }

      dispatch(enrollmentAdded({ studentId, courseId }))
      void message.success('Đăng ký thành công')
      return true
    },
    [courseById, dispatch, enrollments, message, studentById, takenByCourse],
  )

  const cancel = useCallback(
    (id: EntityId): void => {
      dispatch(enrollmentDeleted({ id }))
      void message.success('Đã huỷ đăng ký')
    },
    [dispatch, message],
  )

  return { rows, studentOptions, courseOptions, register, cancel }
}
