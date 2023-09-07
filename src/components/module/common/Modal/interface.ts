import React, { RefObject } from "react";

export interface ModalProps {
  btn: React.ReactElement;
  children:
    | ((props: { ref: RefObject<HTMLDialogElement> }) => React.ReactElement)
    | React.ReactNode;
  showClose?: boolean;
}
