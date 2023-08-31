export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4">
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src="https://media.discordapp.net/attachments/1107668994477019218/1137735995559772290/Logo_transparent.png?width=680&height=676"
        width={680}
        height={676}
        className="max-h-64 object-scale-down"
      />
      <h1 className="text-center font-bold text-4xl pt-12">CTF COMPFEST 15</h1>

      <div className="p-4 form-control rounded-md">
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
