import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/candidates');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch candidates');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('http://localhost:8080/api/candidates', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add candidate');
      }
      
      const result = await response.json();
      dispatch(fetchCandidates()); // Refresh list after adding
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCandidateStatus = createAsyncThunk(
  'candidates/updateStatus',
  async ({ id, status }, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/candidates/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
      }
      
      // Optimistically update local state
      const state = getState();
      const updatedData = state.candidates.data.map(candidate => 
        candidate._id === id ? { ...candidate, status } : candidate
      );
      
      // Then refresh from server to ensure consistency
      await dispatch(fetchCandidates());
      
      return { updatedData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/candidates/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete candidate');
      }
      
      // Refresh list after deletion
      await dispatch(fetchCandidates());
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    data: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCandidate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCandidate.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.updatedData;
      })
      .addCase(deleteCandidate.fulfilled, (state) => {
        state.status = 'succeeded';
      });
  },
});

export default candidateSlice.reducer;