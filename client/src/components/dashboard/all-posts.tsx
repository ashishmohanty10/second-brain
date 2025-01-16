import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  title: string;
  content: string;
  image: string;
  tags: { tag: string }[];
  User: {
    name: string;
    image: string;
  };
}

export function AllPosts() {
  const { data, isLoading, isError } = useQuery<Post[]>({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/publicPosts`,
        { withCredentials: true }
      );
      return response.data.data; // Ensure you access the 'data' object returned from the server
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {data?.length === 0 ? (
        <div>No posts available</div>
      ) : (
        data?.map((post) => (
          <div
            key={post.title}
            className="border p-5 rounded-md shadow-sm text-center"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-slate-600">{post.content}</p>
            <div className="flex justify-center items-center gap-2 mt-3 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag.tag}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                >
                  {tag.tag}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Posted by {post.User.name}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
