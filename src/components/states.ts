import { atomWithStorage } from "jotai/utils";

export const authTokenAtom = atomWithStorage("authToken", "");
export const adminTokenAtom = atomWithStorage("adminToken", "");
