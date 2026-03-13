import { useQuery } from "@tanstack/react-query"
import { getProjectData } from "../api"

export const useProjectDetails = (projectId?: string) => {
    return useQuery({
        queryKey: ["projects", projectId],
        queryFn: () => getProjectData(projectId!),
        enabled: !!projectId
    })
}
