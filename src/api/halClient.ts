import halfred, {Resource} from "halfred";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:8080";

export function mergeHal<T>(obj: Resource): (T & Resource) {
    return Object.assign(obj, halfred.parse(obj)) as T & Resource;
}

export function mergeHalArray<T>(objs: Resource[]): (T & Resource)[] {
    return objs.map(o => Object.assign(o, halfred.parse(o)) as T & Resource);
}

export async function getHal(path: string, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();
    const res = await fetch(url, {
        headers: {
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}), },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} fetching ${url}`);
    }
    return halfred.parse(await res.json());
}

export async function postHal(path: string, body: Resource, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}), },
        body: JSON.stringify(body),
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} posting ${JSON.stringify(body)}`)
    }
    // Si el body és buit (ex: 201 Created sense body), retornem un Resource buit
    const text = await res.text();
    return text ? halfred.parse(JSON.parse(text)) : halfred.parse({});
}


// For suspend creator action
export async function postHalAction(
    path: string,
    authProvider: { getAuth: () => Promise<string | null> }
) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} posting action`);
    }

    const text = await res.text();
    if (!text || !text.trim()) {
        return halfred.parse({});
    }

    return halfred.parse(JSON.parse(text));
}

export async function putHal(
    path: string,
    body: Resource,
    authProvider: { getAuth: () => Promise<string | null> }
) {
    const url = path.startsWith("http")
        ? path
        : `${API_BASE_URL}${path}`;

    const authorization = await authProvider.getAuth();

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} putting ${JSON.stringify(body)}`);
    }

    const text = await res.text();
    if (!text || !text.trim()) {
        return halfred.parse({});
    }

    return halfred.parse(JSON.parse(text));
}

export async function deleteHal(
    path: string,
    authProvider: { getAuth: () => Promise<string | null> }
) {
    const url = path.startsWith("http")
        ? path
        : `${API_BASE_URL}${path}`;

    const authorization = await authProvider.getAuth();

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} deleting ${url}`);
    }

    const text = await res.text();
    if (!text || !text.trim()) {
        return halfred.parse({});
    }

    try {
        return halfred.parse(JSON.parse(text));
    } catch {
        return halfred.parse({});
    }
}

export async function putUriList(
    path: string,
    uris: string | string[],
    authProvider: { getAuth: () => Promise<string | null> }
) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();

    const makeAbsolute = (u: string) => {
        const trimmed = String(u).trim();
        if (!trimmed) return "";
        return trimmed.startsWith("http") ? trimmed : `${API_BASE_URL}${trimmed.startsWith("/") ? trimmed : "/" + trimmed}`;
    };

    let bodyText = "";
    if (Array.isArray(uris)) {
        bodyText = uris.map(makeAbsolute).filter(Boolean).join("\n");
    } else {
        if (uris.indexOf("\n") !== -1) {
            bodyText = uris
                .split(/\r?\n/)
                .map(l => makeAbsolute(l))
                .filter(Boolean)
                .join("\n");
        } else {
            bodyText = makeAbsolute(uris);
        }
    }

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "text/uri-list",
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        body: bodyText,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} putting uri-list to ${url}`);
    }

    const text = await res.text();
    if (!text || !text.trim()) {
        return halfred.parse({});
    }

    try {
        return halfred.parse(JSON.parse(text));
    } catch (e) {
        return halfred.parse({});
    }
}
