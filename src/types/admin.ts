// Admin extends User at the backend without adding any new fields.
// We reuse the User type and just alias it as Admin for clarity.

import { User } from "@/types/user";

export type Admin = User;