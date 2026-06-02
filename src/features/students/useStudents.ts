import { App } from 'antd'
import { useCallback } from 'react'

import type { EntityId, Student } from '../../shared/types'
import { normalizeText } from '../../shared/validation'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectStudents } from '../../store/selectors'
import { enrollmentsDeletedByStudent } from '../../store/slices/enrollmentsSlice'
import {
  studentAdded,
  studentDeleted,
  studentUpdated,
} from '../../store/slices/studentsSlice'

export type StudentInput = {
  fullName: string
  email: string
  phone: string
}

const normalizeInput = (input: StudentInput): StudentInput => ({
  fullName: normalizeText(input.fullName),
  email: normalizeText(input.email),
  phone: normalizeText(input.phone),
})

const isEmailTaken = (
  students: Student[],
  email: string,
  exceptId?: EntityId,
): boolean =>
  students.some(
    (s) => s.id !== exceptId && s.email.toLowerCase() === email.toLowerCase(),
  )

export const useStudents = () => {
  const dispatch = useAppDispatch()
  const students = useAppSelector(selectStudents)
  const { message } = App.useApp()

  const addStudent = useCallback(
    (input: StudentInput): boolean => {
      const payload = normalizeInput(input)
      if (isEmailTaken(students, payload.email)) {
        void message.warning('Email đã tồn tại trong hệ thống')
        return false
      }
      dispatch(studentAdded(payload))
      void message.success('Đã thêm học viên')
      return true
    },
    [dispatch, message, students],
  )

  const updateStudent = useCallback(
    (id: EntityId, input: StudentInput): boolean => {
      const payload = normalizeInput(input)
      if (isEmailTaken(students, payload.email, id)) {
        void message.warning('Email đã tồn tại trong hệ thống')
        return false
      }
      dispatch(studentUpdated({ id, ...payload }))
      void message.success('Đã cập nhật học viên')
      return true
    },
    [dispatch, message, students],
  )

  const removeStudent = useCallback(
    (id: EntityId): void => {
      dispatch(enrollmentsDeletedByStudent({ studentId: id }))
      dispatch(studentDeleted({ id }))
      void message.success('Đã xoá học viên (kèm các đăng ký liên quan)')
    },
    [dispatch, message],
  )

  return { students, addStudent, updateStudent, removeStudent }
}
