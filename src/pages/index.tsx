import Image from "next/image";
import { Quicksand } from "next/font/google";
import Link from "next/link";

const quicksand = Quicksand({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center ${quicksand.className}  text-white`}
    >
      <div className="bg-neutral p-4 form-control rounded-md">
        <h1 className="font-bold text-3xl mb-4 text-center">Login</h1>

        <label className="label">Email</label>
        <input
          type="text"
          name="email"
          className="input input-bordered min-w-[32rem]"
        />
        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          className="input input-bordered min-w-[32rem]"
        />

        <button className="btn btn-primary mt-4">Login</button>
      </div>
    </main>
  );
}
