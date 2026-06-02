import { App } from 'antd'
import { useCallback, useMemo } from 'react'

import type { CourseStatus, EntityId } from '../../shared/types'
import { normalizeText } from '../../shared/validation'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectCourses, selectEnrollments } from '../../store/selectors'
import {
  courseAdded,
  courseDeleted,
  courseStatusChanged,
  courseUpdated,
} from '../../store/slices/coursesSlice'
import { enrollmentsDeletedByCourse } from '../../store/slices/enrollmentsSlice'

export type CourseInput = {
  name: string
  status: CourseStatus
  capacity: number
}

export const useCourses = () => {
  const dispatch = useAppDispatch()
  const courses = useAppSelector(selectCourses)
  const enrollments = useAppSelector(selectEnrollments)
  const { message } = App.useApp()

  const seatsTakenByCourse = useMemo(() => {
    const map = new Map<EntityId, number>()
    for (const e of enrollments) {
      map.set(e.courseId, (map.get(e.courseId) ?? 0) + 1)
    }
    return map
  }, [enrollments])

  const addCourse = useCallback(
    (input: CourseInput): boolean => {
      dispatch(courseAdded({ ...input, name: normalizeText(input.name) }))
      void message.success('Đã thêm khoá học')
      return true
    },
    [dispatch, message],
  )

  const updateCourse = useCallback(
    (id: EntityId, input: CourseInput): boolean => {
      const taken = seatsTakenByCourse.get(id) ?? 0
      if (input.capacity < taken) {
        void message.error(
          `Sức chứa (${input.capacity}) không thể nhỏ hơn số đã đăng ký (${taken})`,
        )
        return false
      }
      dispatch(courseUpdated({ id, ...input, name: normalizeText(input.name) }))
      void message.success('Đã cập nhật khoá học')
      return true
    },
    [dispatch, message, seatsTakenByCourse],
  )

  const removeCourse = useCallback(
    (id: EntityId): void => {
      dispatch(enrollmentsDeletedByCourse({ courseId: id }))
      dispatch(courseDeleted({ id }))
      void message.success('Đã xoá khoá học (kèm các đăng ký liên quan)')
    },
    [dispatch, message],
  )

  const changeStatus = useCallback(
    (id: EntityId, status: CourseStatus): void => {
      dispatch(courseStatusChanged({ id, status }))
      void message.success(
        status === 'open' ? 'Đã mở khoá học' : 'Đã đóng khoá học',
      )
    },
    [dispatch, message],
  )

  return {
    courses,
    seatsTakenByCourse,
    addCourse,
    updateCourse,
    removeCourse,
    changeStatus,
  }
}
