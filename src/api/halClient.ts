import halfred, { Resource } from "halfred";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:8080";

type AuthProviderLike = { getAuth: () => Promise<string | null> };

export function mergeHal<T>(obj: Resource): (T & Resource) {
    return Object.assign(obj, halfred.parse(obj)) as T & Resource;
}

export function mergeHalArray<T>(objs: Resource[]): (T & Resource)[] {
    return objs.map(o => Object.assign(o, halfred.parse(o)) as T & Resource);
}

function toUrl(path: string) {
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

async function parseHalResponse(res: Response): Promise<Resource> {
    const text = await res.text();
    if (!text.trim()) {
        return {
            uri: res.headers.get("Location") ?? undefined,
        } as unknown as Resource;
    }

    return halfred.parse(JSON.parse(text));
}

async function requestHal(
    path: string,
    authProvider: AuthProviderLike,
    init: RequestInit,
    errorContext: string
) {
    const url = toUrl(path);
    const authorization = await authProvider.getAuth();
    let res: Response;

    try {
        res = await fetch(url, {
            ...init,
            headers: {
                "Accept": "application/hal+json",
                ...(init.headers || {}),
                ...(authorization ? { Authorization: authorization } : {}),
            },
            cache: "no-store",
        });
    } catch {
        throw new Error(`Could not connect to API at ${url}. Make sure the backend server is running.`);
    }

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} ${errorContext}${errorText ? `: ${errorText}` : ""}`);
    }

    return parseHalResponse(res);
}

export async function getHal(path: string, authProvider: AuthProviderLike) {
    return requestHal(path, authProvider, {}, `fetching ${toUrl(path)}`);
}

export async function postHal(path: string, body: Resource, authProvider: AuthProviderLike) {
    return requestHal(
        path,
        authProvider,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        },
        `posting ${JSON.stringify(body)}`
    );
}

export async function postHalAction(path: string, authProvider: AuthProviderLike) {
    return requestHal(
        path,
        authProvider,
        { method: "POST" },
        "posting action"
    );
}

export async function putHal(path: string, body: Resource, authProvider: AuthProviderLike) {
    return requestHal(
        path,
        authProvider,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        },
        `putting ${JSON.stringify(body)}`
    );
}

export async function putUriList(
    path: string,
    uris: string | string[],
    authProvider: AuthProviderLike
) {
    const makeAbsolute = (u: string) => {
        const trimmed = String(u).trim();
        if (!trimmed) return "";
        return trimmed.startsWith("http") ? trimmed : `${API_BASE_URL}${trimmed.startsWith("/") ? trimmed : "/" + trimmed}`;
    };

    const bodyText = Array.isArray(uris)
        ? uris.map(makeAbsolute).filter(Boolean).join("\n")
        : uris.includes("\n")
            ? uris.split(/\r?\n/).map(makeAbsolute).filter(Boolean).join("\n")
            : makeAbsolute(uris);

    return requestHal(
        path,
        authProvider,
        {
            method: "PUT",
            headers: { "Content-Type": "text/uri-list" },
            body: bodyText,
        },
        `putting uri-list to ${toUrl(path)}`
    );
}

export async function patchHal(path: string, body: Resource, authProvider: AuthProviderLike) {
    return requestHal(
        path,
        authProvider,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        },
        `patching ${JSON.stringify(body)}`
    );
}

export async function deleteHal(path: string, authProvider: AuthProviderLike) {
    await requestHal(
        path,
        authProvider,
        { method: "DELETE" },
        `deleting ${toUrl(path)}`
    );
}
