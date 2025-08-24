export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "M" | "F" | null;
  birthDate: Date | null;
};
