export const LOGIN_WORKSHOP_EVENT = "ziki:login-workshop";

export type LoginWorkshopEventDetail = {
  state: "repairing" | "error";
};

export function updateLoginWorkshop(state: LoginWorkshopEventDetail["state"]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<LoginWorkshopEventDetail>(LOGIN_WORKSHOP_EVENT, {
      detail: { state },
    }),
  );
}
