import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Course, CourseStatus } from '../../shared/types'
import { createId } from '../../shared/id'

type CoursesState = {
  byId: Record<string, Course>
  allIds: string[]
}

const seedCourses = (): CoursesState => {
  const c1: Course = {
    id: createId(),
    name: 'ReactJS cơ bản',
    status: 'open',
    capacity: 2,
  }
  const c2: Course = {
    id: createId(),
    name: 'TypeScript nâng cao',
    status: 'closed',
    capacity: 3,
  }

  return {
    byId: {
      [c1.id]: c1,
      [c2.id]: c2,
    },
    allIds: [c1.id, c2.id],
  }
}

const initialState: CoursesState = seedCourses()

export type CourseCreate = Omit<Course, 'id'>
export type CourseUpdate = Pick<Course, 'id'> & Partial<CourseCreate>

const slice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    courseAdded: (state, action: PayloadAction<CourseCreate>) => {
      const course: Course = { id: createId(), ...action.payload }
      state.byId[course.id] = course
      state.allIds.unshift(course.id)
    },
    courseUpdated: (state, action: PayloadAction<CourseUpdate>) => {
      const { id, ...patch } = action.payload
      const current = state.byId[id]
      if (!current) return
      state.byId[id] = { ...current, ...patch }
    },
    courseDeleted: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload
      if (!state.byId[id]) return
      delete state.byId[id]
      state.allIds = state.allIds.filter((x) => x !== id)
    },
    courseStatusChanged: (
      state,
      action: PayloadAction<{ id: string; status: CourseStatus }>,
    ) => {
      const { id, status } = action.payload
      const current = state.byId[id]
      if (!current) return
      state.byId[id] = { ...current, status }
    },
  },
})

export const { courseAdded, courseUpdated, courseDeleted, courseStatusChanged } =
  slice.actions
export const coursesReducer = slice.reducer

