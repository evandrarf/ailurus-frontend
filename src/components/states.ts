import { ContestInfo } from "@/types/contest";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { AttackMarker } from "./module/attackmap/interface";

export const authTokenAtom = atomWithStorage("authToken", "");
export const adminTokenAtom = atomWithStorage("adminToken", "");
export const contestInfoAtom = atom({} as ContestInfo);
export const attackMarkerAtom = atom<AttackMarker[]>([]);