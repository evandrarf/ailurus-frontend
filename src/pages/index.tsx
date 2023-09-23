import { postUser } from "@/components/fetcher/user";
import { useContestContext } from "@/components/module/ContestContext";
import { authTokenAtom } from "@/components/states";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [authToken, setAuthToken] = useAtom(authTokenAtom);
  const { contest } = useContestContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authenticate = useMutation({
    mutationFn: (authData: { email: string; password: string }) =>
      postUser<string>("authenticate/", {
        json: authData,
      }),
    onSuccess(data, variables, context) {
      setAuthToken(data.data);
      router.push("/dashboard");
    },
  });

  useEffect(() => {
    if (authToken && router) router.replace("/dashboard");
  }, [authToken, router]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4">
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={
          contest.logo_url.length > 0
            ? contest.logo_url
            : "https://media.discordapp.net/attachments/1107668994477019218/1137735995559772290/Logo_transparent.png?width=680&height=676"
        }
        width={680}
        height={676}
        className="max-h-64 object-scale-down"
      />
      <h1 className="text-center font-bold text-4xl pt-12">
        {contest.event_name}
      </h1>

      <div className="p-4 form-control rounded-md">
        <label className="label">Email</label>
        <input
          type="text"
          name="email"
          className="input input-bordered min-w-[32rem]"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          className="input input-bordered min-w-[32rem]"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary mt-4"
          onClick={() => authenticate.mutate({ email, password })}
        >
          Login
        </button>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/leaderboard" className="btn btn-secondary mt-4">
            Leaderboard
          </Link>
          <Link href="/attackmap" className="btn btn-secondary mt-4">
            Attack Map
          </Link>
        </div>
      </div>
    </div>
  );
}
