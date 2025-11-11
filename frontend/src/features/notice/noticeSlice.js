import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

/* ============================================================
   📨 SEND NOTICE TO MEMBERS
   ============================================================ */
export const sendNoticeToMembers = createAsyncThunk(
  "notice/sendNoticeToMembers",
  async ({ memberIds, subject, message, attachment }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      memberIds.forEach((id) => formData.append("memberIds[]", id)); // send array properly
      if (attachment) formData.append("attachment", attachment);

      const { data } = await axios.post("/notice/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      return rejectWithValue(errorMsg);
    }
  }
);

/* ============================================================
   ⚙️ SLICE
   ============================================================ */
const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: "",
  },
  reducers: {
    resetNoticeState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNoticeToMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = "";
      })
      .addCase(sendNoticeToMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(sendNoticeToMembers.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to send notice";
      });
  },
});

export const { resetNoticeState } = noticeSlice.actions;
export default noticeSlice.reducer;
