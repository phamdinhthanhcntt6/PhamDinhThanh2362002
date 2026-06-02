import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Enrollment } from '../../shared/types'
import { createId } from '../../shared/id'

type EnrollmentsState = {
  byId: Record<string, Enrollment>
  allIds: string[]
}

const initialState: EnrollmentsState = {
  byId: {},
  allIds: [],
}

const slice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    enrollmentAdded: (
      state,
      action: PayloadAction<{ studentId: string; courseId: string }>,
    ) => {
      const enrollment: Enrollment = {
        id: createId(),
        studentId: action.payload.studentId,
        courseId: action.payload.courseId,
        createdAtIso: new Date().toISOString(),
      }
      state.byId[enrollment.id] = enrollment
      state.allIds.unshift(enrollment.id)
    },
    enrollmentDeleted: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload
      if (!state.byId[id]) return
      delete state.byId[id]
      state.allIds = state.allIds.filter((x) => x !== id)
    },
    enrollmentsDeletedByStudent: (
      state,
      action: PayloadAction<{ studentId: string }>,
    ) => {
      const { studentId } = action.payload
      const ids = state.allIds.filter(
        (id) => state.byId[id]?.studentId === studentId,
      )
      for (const id of ids) delete state.byId[id]
      state.allIds = state.allIds.filter((id) => !ids.includes(id))
    },
    enrollmentsDeletedByCourse: (
      state,
      action: PayloadAction<{ courseId: string }>,
    ) => {
      const { courseId } = action.payload
      const ids = state.allIds.filter((id) => state.byId[id]?.courseId === courseId)
      for (const id of ids) delete state.byId[id]
      state.allIds = state.allIds.filter((id) => !ids.includes(id))
    },
  },
})

export const {
  enrollmentAdded,
  enrollmentDeleted,
  enrollmentsDeletedByStudent,
  enrollmentsDeletedByCourse,
} = slice.actions
export const enrollmentsReducer = slice.reducer

