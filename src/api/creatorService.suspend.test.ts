import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreatorService } from "@/api/creatorAPI";
import type { AuthProvider } from "@/lib/authProvider";

const API_BASE = "http://test-api.local";

describe("CreatorService.suspendCreator (HTTP integration)", () => {
  const authProvider: AuthProvider = {
    getAuth: vi.fn().mockResolvedValue("Bearer admin-token"),
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.API_BASE_URL = API_BASE;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("POSTs suspend action with HAL accept header and auth, then returns parsed creator", async () => {
    const halBody = {
      _links: {
        self: { href: `${API_BASE}/creators/alice` },
      },
      username: "alice",
      accountNonLocked: false,
    };

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(halBody), {
        status: 200,
        headers: { "Content-Type": "application/hal+json" },
      })
    );

    const service = new CreatorService(authProvider);
    const result = await service.suspendCreator("alice");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/creators/alice/suspend`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Accept: "application/hal+json",
          Authorization: "Bearer admin-token",
        }),
        cache: "no-store",
      })
    );

    expect(result.username).toBe("alice");
    expect(result.accountNonLocked).toBe(false);
  });

  it("propagates HTTP errors from the suspend endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("", { status: 403 }));

    const service = new CreatorService(authProvider);

    await expect(service.suspendCreator("bob")).rejects.toThrow("HTTP 403");
  });
});
