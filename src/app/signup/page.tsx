"use client";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle form submission
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Attempt to sign up with provided email and password
    const { result, error } = await signUp(email, password);

    if (error) {
      // Display and log any sign-up errors
      console.log(error);
      return;
    }

    // Sign up successful
    console.log(result);

    // Redirect to the admin page
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center h-screen text-black">
      <div className="w-96 bg-white border border-gray-800 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6">Registration</h1>
        <form onSubmit={handleForm} className="space-y-4">
          <div>
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
              className="w-full border border-gray-800 rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="w-full border border-gray-800 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white-400 text-black font-semibold py-2 rounded border border-gray-800"
          >
            Sign up
          </button>
          <div className="mt-6">
            Already have an account?{" "}
            <br />
            <a href="/signin" className="underline">
              Log in here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
