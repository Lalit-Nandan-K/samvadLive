import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // This is how we did it first , without using our custom hook

  // const queryClient = useQueryClient();
  // const {mutate:signupMutation, isPending , error} = useMutation({
  //     mutationFn:signup,
  //     onSuccess:()=> queryClient.invalidateQueries({queryKey:["authUser"]}),
  //   })

  //This is how we did it using our custom hook
  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SignUp - left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-cyan-300" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 tracking-wider">
              Samvad Live
            </span>
          </div>

          {/* Error if any problem occurs */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}
          {/*Form*/}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join Samvad Live to make new friends.
                  </p>
                </div>
                <div className="space-y-3">
                  {/* Full Name */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* Email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="abc@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text=xs opacity-70 mt-1">
                      Password must atleast of 6 characters long
                    </p>
                  </div>

                  {/* Terms & Condition */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I trust{" "}
                        <span className="text-accent hover:underline">
                          Lalit Nandan{" "}
                        </span>
                        <span>& his </span>
                        <span className="text-accent hover:underline">
                          Terms
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Create Account */}
                <button className="btn btn-accent w-full " type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Creating ...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Alreday Account */}
                <div className="text-center mt-4">
                  <p className="text-sm ">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* SignUp - right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-slate-700/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/Conversation-rafiki.png" alt="" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with new friend and make Conversation..
              </h2>
              <p className="opacity-70">Make conversations and be together </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
