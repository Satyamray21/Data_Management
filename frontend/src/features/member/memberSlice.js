import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const createMember = createAsyncThunk(
  "members/createMember",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/members", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Fetch all members
 */
export const fetchAllMembers = createAsyncThunk(
  "members/fetchAllMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/members");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Fetch single member by ID
 */
export const fetchMemberById = createAsyncThunk(
  "members/fetchMemberById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/members/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Update member by ID (with form data)
 */
export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/members/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Delete member by ID
 */
export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/members/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ==========================================================
   ====================   SLICE SETUP   =====================
   ========================================================== */

const memberSlice = createSlice({
  name: "members",
  initialState: {
    members: [],
    selectedMember: null,
    loading: false,
    error: null,
    successMessage: null,
    // NEW: Add operation-specific loading states
    operationLoading: {
      create: false,
      update: false,
      delete: false,
      fetch: false
    }
  },
  reducers: {
    clearMemberState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.loading = false;
      // Reset operation loading states
      state.operationLoading = {
        create: false,
        update: false,
        delete: false,
        fetch: false
      };
    },
    // NEW: Clear selected member when needed
    clearSelectedMember: (state) => {
      state.selectedMember = null;
    },
    // NEW: Clear error specifically
    clearError: (state) => {
      state.error = null;
    },
    // NEW: Clear success message specifically
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE MEMBER
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.operationLoading.create = true;
        state.error = null; // Clear previous errors
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.create = false;
        // FIX: Use unshift instead of push to show newest members first
        state.members.unshift(action.payload);
        state.successMessage = "Member created successfully";
        state.error = null;
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.create = false;
        state.error = action.payload;
        state.successMessage = null;
      })

      // FETCH ALL MEMBERS
      .addCase(fetchAllMembers.pending, (state) => {
        state.loading = true;
        state.operationLoading.fetch = true;
        state.error = null;
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.fetch = false;
        state.members = action.payload;
        state.error = null;
      })
      .addCase(fetchAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.fetch = false;
        state.error = action.payload;
      })

      // FETCH MEMBER BY ID
      .addCase(fetchMemberById.pending, (state) => {
        state.loading = true;
        state.operationLoading.fetch = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.fetch = false;
        state.selectedMember = action.payload;
        state.error = null;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.fetch = false;
        state.error = action.payload;
      })

      // UPDATE MEMBER
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.operationLoading.update = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.update = false;
        const index = state.members.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) {
          state.members[index] = action.payload;
        }
        // Also update selectedMember if it's the same member
        if (state.selectedMember && state.selectedMember._id === action.payload._id) {
          state.selectedMember = action.payload;
        }
        state.successMessage = "Member updated successfully";
        state.error = null;
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.update = false;
        state.error = action.payload;
        state.successMessage = null;
      })

      // DELETE MEMBER
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.operationLoading.delete = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.delete = false;
        state.members = state.members.filter((m) => m._id !== action.payload);
        // Clear selectedMember if it's the deleted member
        if (state.selectedMember && state.selectedMember._id === action.payload) {
          state.selectedMember = null;
        }
        state.successMessage = "Member deleted successfully";
        state.error = null;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.delete = false;
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

export const { 
  clearMemberState, 
  clearSelectedMember, 
  clearError, 
  clearSuccessMessage 
} = memberSlice.actions;

export default memberSlice.reducer;