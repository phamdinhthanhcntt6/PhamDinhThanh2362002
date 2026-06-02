import { configureStore } from "@reduxjs/toolkit";

import { enrollmentsReducer } from "./slices/enrollmentsSlice.ts";
import { coursesReducer } from "./slices/coursesSlice.ts";
import { studentsReducer } from "./slices/studentsSlice.ts";
import { loadFromStorage, saveToStorage } from "../shared/storage";

type PersistedState = {
  students: ReturnType<typeof studentsReducer>;
  courses: ReturnType<typeof coursesReducer>;
  enrollments: ReturnType<typeof enrollmentsReducer>;
};

const persisted = loadFromStorage<PersistedState | null>(null);

export const store = configureStore({
  preloadedState: persisted ?? undefined,
  reducer: {
    students: studentsReducer,
    courses: coursesReducer,
    enrollments: enrollmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

let persistTimer: number | null = null;

store.subscribe(() => {
  if (persistTimer) window.clearTimeout(persistTimer);

  persistTimer = window.setTimeout(() => {
    const state = store.getState();
    const toPersist: PersistedState = {
      students: state.students,
      courses: state.courses,
      enrollments: state.enrollments,
    };
    saveToStorage(toPersist);
  }, 200);
});
