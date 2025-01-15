import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/authStore";

interface SigninProps {
  email: string;
  password: string;
}

export function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninProps>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { login } = useAuthStore();

  const onSubmit: SubmitHandler<SigninProps> = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`,
        data,
        { withCredentials: true }
      );

      login();
      navigate("/dashboard");
    } catch (error) {
      console.log("--error", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-2xl border rounded-2xl p-10 space-y-6 flex items-center flex-col"
      >
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Enter Your Email"
            className="border px-4 py-1 rounded-md"
          />
        </div>

        <div>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 6 character long",
              },
            })}
            type="password"
            placeholder="Enter Your Password"
            className="border px-4 py-1 rounded-md"
          />

          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button className="px-4 py-2 rounded-md bg-black text-white w-full">
          {loading ? "Signing Up" : "Submit"}
        </button>
      </form>
    </div>
  );
}
