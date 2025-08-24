import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { baseURL } from "../lib/baseUrl";
import { saveUser, loadUser, clearUser } from "@/lib/storage";
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
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  const res = await fetch(
    `${baseURL}/users?email=${encodeURIComponent(payload.email)}`
  );
  const users: User[] = await res.json();
  const found = users.find((u) => u.password === payload.password);
  if (!found) return rejectWithValue("Email veya parola hatalıdır");
  return found;
});

export const register = createAsyncThunk<
  User,
  Omit<User, "id">,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  const existsRes = await fetch(
    `${baseURL}/users?email=${encodeURIComponent(payload.email)}` // ⬅️ baştaki boşluk kaldırıldı
  );
  const exists: User[] = await existsRes.json();
  if (exists.length > 0) {
    return rejectWithValue(
      "E-posta adresi zaten kayıtlı. Lütfen başka bir e-posta adresi giriniz"
    );
  }

  const createRes = await fetch(`${baseURL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const created = (await createRes.json()) as User;
  return created;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      clearUser();
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
        saveUser(a.payload);
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

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
