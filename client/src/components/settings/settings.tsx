import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpdateUserProps {
  email: string;
  name: string;
}

export function Settings() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/info`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserProps>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<UpdateUserProps> = async (data) => {
    setLoading(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/updateInfo`,
        data,
        { withCredentials: true }
      );
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user information. Please try again later.</div>;
  }

  const user = data?.data;

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <>
      <div className="max-w-lg flex items-center gap-4 p-4 bg-gray-100 rounded-md shadow">
        {user.image ? (
          <img
            src={user.image}
            alt="User Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-lg">
            {user.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="space-y-2">
          <p className="text-lg font-semibold">{user.name || "Unknown User"}</p>
          <p className="text-gray-600">{user.email || "No email provided"}</p>
          <p className="text-gray-500 text-sm">
            Joined:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Unknown date"}
          </p>
        </div>
      </div>
      <div>
        <form className="space-y-5 py-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Edit Name"
              className="py-2 px-4 border"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Edit Email"
              className="py-2 px-4 border"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            className="px-4 py-2 rounded-md bg-black text-white w-fit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
