import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/employees');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch employees');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
        method: 'PUT',
        body: data,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update employee');
      }
      const updatedEmployee = await response.json();
      return updatedEmployee.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete employee');
      }
      return id; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const updatedEmployee = action.payload;
        const index = state.employees.findIndex((emp) => emp._id === updatedEmployee._id);
        if (index !== -1) {
          state.employees[index] = updatedEmployee;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.employees = state.employees.filter((emp) => emp._id !== deletedId);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;