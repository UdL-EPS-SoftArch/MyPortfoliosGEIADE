import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Project } from "@/types/project";

export class ProjectsService {
    constructor(private authProvider: AuthProvider) {
    }

    async getProjects(): Promise<Project[]> {
        const resource = await getHal("/projects", this.authProvider);
        const embedded = resource.embeddedArray("projects") || [];
        return mergeHalArray<Project>(embedded);
    }

    async getProjectById(id: string): Promise<Project> {
        const resource = await getHal(`/projects/${id}`, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async createProject(project: Project): Promise<Project> {
        const resource = await postHal("/projects", project, this.authProvider);
        return mergeHal<Project>(resource);
    }
}
