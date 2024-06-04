"use client";
import signIn from "@/firebase/auth/signIn";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle form submission
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Attempt to sign in with provided email and password
    const { result, error } = await signIn(email, password);

    if (error) {
      // Display and log any sign-in errors
      console.log(error);
      return;
    }

    // Redirect to home page on successful sign-in
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleForm}
          className="bg-white px-8 pt-6 pb-8 mb-4 border border-gray-800 rounded-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-black">Sign In</h1>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className="appearance-none border border-gray-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="appearance-none border border-gray-800 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-white-400 text-black font-semibold py-2 rounded border border-gray-800"
            >
              Sign In
            </button>
          </div>
          <div className="mt-6">
            Don't have an account?{" "}
            <br />
            <a href="/signup" className="underline">
              Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
