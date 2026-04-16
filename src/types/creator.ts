import { Resource } from "halfred";

export interface AuthorityEntity {
    authority: string;
}

export interface CreatorEntity {
    uri?: string;
    username: string;
    email?: string;
    password?: string;
    authorities?: AuthorityEntity[];

    accountNonLocked?: boolean;
    accountNonExpired?: boolean;
    credentialsNonExpired?: boolean;
    enabled?: boolean;
}

export type Creator = CreatorEntity & Resource;