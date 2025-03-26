import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, limit }) => {
    const response = await axios.get(`http://localhost:5000/users?page=${page}&limit=${limit}`)
    return response.data
  }
)

export const updateUserOnServer = createAsyncThunk(
  'users/updateUserOnServer',
  async (updatedUser, { rejectWithValue }) => {
    try {
      if (!updatedUser.id) throw new Error('Нет ID пользователя')
      await axios.put(`http://localhost:5000/users/${updatedUser.id}`, updatedUser)
      return updatedUser
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    totalUsers: 0,
    currentPage: 1,
    usersPerPage: 50,
    selectedUser: null,
    status: 'idle',
    isSaving: false,
    searchQuery: '',
  },
  reducers: {
    selectUser: (state, action) => {
      if (!state.isSaving) {
        state.selectedUser = state.list.find((user) => user.id === action.payload)
      }
    },
    updateUser: (state, action) => {
      if (state.selectedUser) {
        state.selectedUser = { ...state.selectedUser, ...action.payload }
      }
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload?.users || []
        state.totalUsers = action.payload?.totalUsers || 0
        state.status = 'succeeded'
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(updateUserOnServer.pending, (state) => {
        state.isSaving = true
      })
      .addCase(updateUserOnServer.fulfilled, (state, action) => {
        state.isSaving = false
        const index = state.list.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload
        }
      })
      .addCase(updateUserOnServer.rejected, (state) => {
        state.isSaving = false
      })
  },
})

export const { selectUser, updateUser, setPage, setSearchQuery } = usersSlice.actions
export default usersSlice.reducer
