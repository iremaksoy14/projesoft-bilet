import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  birthDate: string; // YYYY-MM-DD
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = { user: null, loading: false, error: null };

export const login = createAsyncThunk<
  User,
  { email: string; password: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  const res = await fetch(
    `http://localhost:4000/users?email=${encodeURIComponent(payload.email)}`
  );
  const users: User[] = await res.json();
  const found = users.find((u) => u.password === payload.password);
  if (!found) return rejectWithValue("E-posta veya şifre hatalı");
  return found;
});

export const register = createAsyncThunk<User, Omit<User, "id">>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    const existsRes = await fetch(
      `http://localhost:4000/users?email=${encodeURIComponent(payload.email)}`
    );
    const exists: User[] = await existsRes.json();
    if (exists.length > 0) return rejectWithValue("E-posta zaten kayıtlı");

    const createRes = await fetch("http://localhost:4000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const created = await createRes.json();
    return created as User;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a: PayloadAction<User>) => {
        s.loading = false;
        s.user = a.payload;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || "Giriş başarısız";
      })
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || "Kayıt başarısız";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
