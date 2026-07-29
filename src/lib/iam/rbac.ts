import { z } from "zod";

export type ActorRole = "player" | "coach" | "referee" | "club-registrar" | "admin";

export interface UserSession {
  userId: string;
  email: string;
  role: ActorRole;
  entityId?: string; // Player ID, Club ID, Referee ID
  clubId?: string;
}

export const playerProfileSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string(),
  clubId: z.string(),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  caps: z.number().default(0),
  bio: z.string().optional(),
});

export const coachProfileSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  clubId: z.string(),
  coachingLevel: z.string(),
  bio: z.string().optional(),
});

export const refereeProfileSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  certificationLevel: z.string(),
  region: z.string(),
  availableForMatches: z.boolean().default(true),
});

export const clubRegistrarProfileSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  clubId: z.string(),
  officialRole: z.string(),
});

export type PlayerProfile = z.infer<typeof playerProfileSchema>;
export type CoachProfile = z.infer<typeof coachProfileSchema>;
export type RefereeProfile = z.infer<typeof refereeProfileSchema>;
export type ClubRegistrarProfile = z.infer<typeof clubRegistrarProfileSchema>;

/**
 * IAM Role-Based Access Control (RBAC) Permission Matrix
 * Enforces data read/write boundaries per actor role.
 */
export function checkPermission(
  session: UserSession,
  action: "read" | "write",
  targetResource: { resourceType: "player" | "coach" | "referee" | "club"; ownerId?: string; clubId?: string }
): boolean {
  if (session.role === "admin") return true;

  if (action === "read") {
    switch (session.role) {
      case "player":
        return targetResource.ownerId === session.userId;
      case "coach":
        return targetResource.clubId === session.clubId;
      case "club-registrar":
        return targetResource.clubId === session.clubId;
      case "referee":
        return targetResource.ownerId === session.userId;
      default:
        return false;
    }
  }

  if (action === "write") {
    switch (session.role) {
      case "player":
        return targetResource.ownerId === session.userId && targetResource.resourceType === "player";
      case "coach":
        return targetResource.clubId === session.clubId && (targetResource.resourceType === "player" || targetResource.ownerId === session.userId);
      case "club-registrar":
        return targetResource.clubId === session.clubId;
      case "referee":
        return targetResource.ownerId === session.userId && targetResource.resourceType === "referee";
      default:
        return false;
    }
  }

  return false;
}
