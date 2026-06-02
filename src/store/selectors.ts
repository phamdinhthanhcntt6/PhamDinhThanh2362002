import type { RootState } from './store'
import type { EntityId } from '../shared/types'

export const selectStudents = (state: RootState) =>
  state.students.allIds.map((id) => state.students.byId[id]).filter(Boolean)

export const selectCourses = (state: RootState) =>
  state.courses.allIds.map((id) => state.courses.byId[id]).filter(Boolean)

export const selectEnrollments = (state: RootState) =>
  state.enrollments.allIds
    .map((id) => state.enrollments.byId[id])
    .filter(Boolean)

export const selectCourseEnrollmentCount =
  (courseId: EntityId) => (state: RootState) =>
    selectEnrollments(state).filter((e) => e.courseId === courseId).length

export const selectIsStudentEnrolledInCourse =
  (studentId: EntityId, courseId: EntityId) => (state: RootState) =>
    selectEnrollments(state).some(
      (e) => e.studentId === studentId && e.courseId === courseId,
    )

export const selectDashboardStats = (state: RootState) => {
  const studentsCount = state.students.allIds.length
  const courses = selectCourses(state)
  const openCoursesCount = courses.filter((c) => c.status === 'open').length
  const enrollments = selectEnrollments(state)
  const enrollmentsCount = enrollments.length

  const totalCapacity = courses.reduce((sum, c) => sum + c.capacity, 0)
  const remainingCapacity = Math.max(totalCapacity - enrollmentsCount, 0)
  const fillRate = totalCapacity === 0 ? 0 : enrollmentsCount / totalCapacity

  return {
    studentsCount,
    openCoursesCount,
    enrollmentsCount,
    totalCapacity,
    remainingCapacity,
    fillRate,
  }
}

