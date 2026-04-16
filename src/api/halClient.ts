import halfred, {Resource} from "halfred";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

export function mergeHal<T>(obj: Resource): (T & Resource) {
    return Object.assign(obj, halfred.parse(obj)) as T & Resource;
}

export function mergeHalArray<T>(objs: Resource[]): (T & Resource)[] {
    return objs.map(o => Object.assign(o, halfred.parse(o)) as T & Resource);
}

export async function getHal(path: string, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();
    let res: Response;
    try {
        res = await fetch(url, {
            headers: {
                "Accept": "application/hal+json",
                ...(authorization ? { Authorization: authorization } : {}), },
            cache: "no-store",
        });
    } catch {
        throw new Error(`Could not connect to API at ${url}. Make sure the backend server is running.`);
    }
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} fetching ${url}`);
    }
    return halfred.parse(await res.json());
}

export async function postHal(path: string, body: Resource, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();
    let res: Response;
    try {
        res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/hal+json",
                ...(authorization ? { Authorization: authorization } : {}), },
            body: JSON.stringify(body),
            cache: "no-store",
        });
    } catch {
        throw new Error(`Could not connect to API at ${url}. Make sure the backend server is running.`);
    }
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} posting ${JSON.stringify(body)}`)
    }
    const responseText = await res.text();
    if (!responseText.trim()) {
        return {
            uri: res.headers.get("Location") ?? undefined,
        } as Resource;
    }
    return halfred.parse(JSON.parse(responseText));
}

export async function patchHal(path: string, body: Resource, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();
    let res: Response;
    try {
        res = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/hal+json",
                ...(authorization ? { Authorization: authorization } : {}),
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });
    } catch {
        throw new Error(`Could not connect to API at ${url}. Make sure the backend server is running.`);
    }
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} patching ${JSON.stringify(body)}`);
    }
    const responseText = await res.text();
    if (!responseText.trim()) {
        return {
            uri: res.headers.get("Location") ?? undefined,
        } as Resource;
    }
    return halfred.parse(JSON.parse(responseText));
}

export async function deleteHal(path: string, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();
    let res: Response;
    try {
        res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Accept": "application/hal+json",
                ...(authorization ? { Authorization: authorization } : {}),
            },
            cache: "no-store",
        });
    } catch {
        throw new Error(`Could not connect to API at ${url}. Make sure the backend server is running.`);
    }
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} deleting ${url}`);
    }
}
