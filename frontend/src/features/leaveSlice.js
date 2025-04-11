import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLeaves = createAsyncThunk(
  "leaves/fetchLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8080/api/leaves");
      if (!response.ok) throw new Error("Failed to fetch leaves");
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addLeave = createAsyncThunk(
  "leaves/addLeave",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8080/api/leaves", {
        method: "POST",
        body: data,
      });
      if (!response.ok) throw new Error("Failed to add leave");
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    leaves: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaves = action.payload || [];
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addLeave.fulfilled, (state, action) => {
        state.leaves.push(action.payload);
      })
      .addCase(addLeave.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default leaveSlice.reducer;