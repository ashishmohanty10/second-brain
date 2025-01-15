import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Post {
  title: string;
  content: string;
  link?: string;
  image: string;
  tags: { tag: string }[];
}

export function Dashboard() {
  const { data, isLoading, isError } = useQuery<{ data: Post[] }>({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/post`,
        { withCredentials: true }
      );
      return response.data; // this will have the `data` property containing posts
    },
  });

  if (isLoading) {
    return <div className="text-lg font-medium">Loading...</div>;
  }

  if (isError) {
    console.error("Error fetching posts");
    return (
      <div className="text-lg font-medium text-red-500">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-lg font-medium">
        No posts available. Create one now!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 masonry-grid">
      {data.data.map(({ title, content, image, link, tags }) => (
        <div
          className="border p-5 h-fit rounded-md shadow-sm text-center space-y-5"
          key={title}
        >
          <img
            src={image}
            alt={title || "Post Image"}
            className="w-full h-40 object-cover rounded-md"
          />
          <h3 className="text-md font-semibold mb-5">{title}</h3>
          <p className="text-sm font-medium text-left text-slate-600">
            {content}
          </p>

          {link && (
            <Link
              to={link}
              className="bg-black flex items-center text-white px-4 py-2 justify-center group text-md rounded-md gap-x-2 font-semibold"
            >
              Check Out{" "}
              <ArrowRightIcon
                className="group-hover:-rotate-45 transition-transform font-semibold"
                size={14}
              />
            </Link>
          )}
          <div className="flex justify-center items-center flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag.tag}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
              >
                {tag.tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
