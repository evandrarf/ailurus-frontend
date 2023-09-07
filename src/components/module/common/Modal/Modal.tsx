import React, { RefObject, useRef } from "react";
import { ModalProps } from "./interface";

export default function Modal({ btn, children, showClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a onClick={() => ref.current?.showModal()}>{btn}</a>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          {typeof children === "function" ? children({ ref }) : children}
        </div>
        {showClose && (
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        )}
      </dialog>
    </>
  );
}
