// candidateSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async () => {
    const response = await fetch('http://localhost:8080/api/candidates');
    return await response.json();
  }
);

export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async (candidateData) => {
    const formData = new FormData();
    for (const key in candidateData) {
      if (key === 'resume') {
        if (candidateData[key]) formData.append(key, candidateData[key]);
      } else {
        formData.append(key, candidateData[key]);
      }
    }
    
    const response = await fetch('http://localhost:8080/api/candidates', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
);

export const updateCandidateStatus = createAsyncThunk(
    'candidates/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:8080/api/candidates/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData);
        }
        
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id) => {
    await fetch(`http://localhost:8080/api/candidates/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    data: [],
    status: 'idle',
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
        state.error = action.error.message;
      })
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.data = state.data.filter(c => c.id !== action.payload);
      });
  },
});

export default candidateSlice.reducer;  