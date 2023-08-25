export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
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
    </div>
  );
}
