import { localBackend } from "./localBackend";
import { createApiBackend } from "./apiBackend";
import { DataBackend } from "./backend";

const API_URL = process.env.NEXT_PUBLIC_LINKCARD_API_URL;

export const usingApiBackend = Boolean(API_URL);

const backend: DataBackend = API_URL ? createApiBackend(API_URL) : localBackend;

export const listProfiles = backend.listProfiles.bind(backend);
export const getProfile = backend.getProfile.bind(backend);
export const isUsernameTaken = backend.isUsernameTaken.bind(backend);
export const saveProfile = backend.saveProfile.bind(backend);
export const deleteProfile = backend.deleteProfile.bind(backend);

export type { DataBackend };
