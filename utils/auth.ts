import type { SupabaseClient, User } from "@supabase/supabase-js";

export const APP_ROLES = ["user", "staff", "admin", "super_admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];

const ROLE_HOME: Record<AppRole, string> = {
  user: "/user",
  staff: "/staff",
  admin: "/admin",
  super_admin: "/super_admin",
};

type ClaimBag = Record<string, unknown>;

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

function getNestedRole(source: unknown): AppRole | null {
  if (!source || typeof source !== "object") {
    return null;
  }

  const role = (source as ClaimBag).app_role ?? (source as ClaimBag).role;
  return isAppRole(role) ? role : null;
}

function extractRole(claims: ClaimBag | null | undefined): AppRole | null {
  if (!claims) {
    return null;
  }

  return (
    getNestedRole(claims) ??
    getNestedRole(claims.app_metadata) ??
    getNestedRole(claims.user_metadata)
  );
}

export function getAppRoleFromUser(
  user: Pick<User, "app_metadata" | "user_metadata"> | null,
): AppRole | null {
  if (!user) {
    return null;
  }

  return extractRole({
    app_metadata: (user.app_metadata ?? {}) as ClaimBag,
    user_metadata: (user.user_metadata ?? {}) as ClaimBag,
  });
}

export async function getCurrentAppRole(
  supabase: SupabaseClient,
  user: User | null,
): Promise<AppRole | null> {
  const userRole = getAppRoleFromUser(user);
  if (userRole) {
    return userRole;
  }

  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    return null;
  }

  return extractRole((data?.claims as ClaimBag | undefined) ?? null);
}

export function getDefaultRouteForRole(role: AppRole | null): string {
  return role ? ROLE_HOME[role] : "/";
}

export function getRouteRole(pathname: string): AppRole | null {
  if (pathname.startsWith("/super_admin")) {
    return "super_admin";
  }

  if (pathname.startsWith("/admin")) {
    return "admin";
  }

  if (pathname.startsWith("/staff")) {
    return "staff";
  }

  if (pathname.startsWith("/user")) {
    return "user";
  }

  return null;
}