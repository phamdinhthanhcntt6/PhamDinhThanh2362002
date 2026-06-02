import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Student } from '../../shared/types'
import { createId } from '../../shared/id'

type StudentsState = {
  byId: Record<string, Student>
  allIds: string[]
}

const seedStudents = (): StudentsState => {
  const s1: Student = {
    id: createId(),
    fullName: 'Nguyễn Văn A',
    email: 'a.nguyen@example.com',
    phone: '0900000001',
  }
  const s2: Student = {
    id: createId(),
    fullName: 'Trần Thị B',
    email: 'b.tran@example.com',
    phone: '0900000002',
  }

  return {
    byId: {
      [s1.id]: s1,
      [s2.id]: s2,
    },
    allIds: [s1.id, s2.id],
  }
}

const initialState: StudentsState = seedStudents()

export type StudentCreate = Omit<Student, 'id'>
export type StudentUpdate = Pick<Student, 'id'> & Partial<StudentCreate>

const slice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    studentAdded: (state, action: PayloadAction<StudentCreate>) => {
      const student: Student = { id: createId(), ...action.payload }
      state.byId[student.id] = student
      state.allIds.unshift(student.id)
    },
    studentUpdated: (state, action: PayloadAction<StudentUpdate>) => {
      const { id, ...patch } = action.payload
      const current = state.byId[id]
      if (!current) return
      state.byId[id] = { ...current, ...patch }
    },
    studentDeleted: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload
      if (!state.byId[id]) return
      delete state.byId[id]
      state.allIds = state.allIds.filter((x) => x !== id)
    },
  },
})

export const { studentAdded, studentUpdated, studentDeleted } = slice.actions
export const studentsReducer = slice.reducer

