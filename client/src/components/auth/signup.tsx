import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/authStore";

interface SignupFormProps {
  name: string;
  email: string;
  password: string;
}

export function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormProps>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onSubmit: SubmitHandler<SignupFormProps> = async (data) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
        data,
        { withCredentials: true }
      );
      login();
      navigate("/dashboard");
    } catch (error) {
      console.log("Error while signinIn", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-2xl border rounded-2xl p-10 space-y-6 flex items-center flex-col"
      >
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            type="name"
            placeholder="Enter Your Name"
            className="border px-4 py-1 rounded-md"
          />

          {errors.name && <p>{errors.name.message}</p>}
        </div>

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

          {errors.email && <p>{errors.email.message}</p>}
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
