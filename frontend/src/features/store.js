import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from './candidateSlice';
import employeeReducer from './employeeSlice';
import attendanceReducer from './attendanceSlice';
import leaveReducer from "./leaveSlice";


export const store = configureStore({
  reducer: {
    candidates: candidateReducer,
    employees: employeeReducer,
    attendance: attendanceReducer,
    leaves: leaveReducer,
  },
});
