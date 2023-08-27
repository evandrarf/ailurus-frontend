import { ReactElement, useRef } from "react";
import { ServerProps } from "./interface";

function InputLabel({ value, label }: { value: string; label: string }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="input input-bordered"
      />
    </div>
  );
}

function ServerDetail({ server }: ServerProps) {
  return (
    <div className="flex flex-col">
      <h4 className="font-bold text-xl pb-4">Server Detail</h4>
      <InputLabel label="ID" value={server.id.toString()} />
      <InputLabel label="Host" value={server.host} />
      <InputLabel label="Port" value={server.sshport.toString()} />
      <InputLabel label="Username" value={server.username.toString()} />
      <div className="form-control">
        <label className="label">
          <span className="label-text">Auth Key</span>
        </label>
        <textarea readOnly className="textarea textarea-bordered">
          {server.auth_key}
        </textarea>
      </div>
    </div>
  );
}

export default function ServerDetailModal({
  server,
  btn,
}: ServerProps & { btn: ReactElement }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a onClick={() => ref.current?.showModal()}>{btn}</a>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <ServerDetail server={server} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
