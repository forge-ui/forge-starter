export const PROFILE_UPDATED_EVENT = "forge-starter:profile-updated";

export type ProfileUpdatedDetail = {
  displayName?: string;
  email?: string;
  username?: string;
};

export function emitProfileUpdated(detail: ProfileUpdatedDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail }));
}
