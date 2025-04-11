import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/attendance');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch attendance');
      }
      const data = await response.json();
      return data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async ({ id, status, na }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/attendance/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, na }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark attendance');
      }
      const data = await response.json();
      return data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        const updatedEmployee = action.payload;
        const index = state.employees.findIndex((emp) => emp._id === updatedEmployee._id);
        if (index !== -1) {
          state.employees[index] = updatedEmployee;
        }
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;