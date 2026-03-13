import { useQuery } from "@tanstack/react-query"
import { getSourcingOptions } from "../api"

export const useSpecSourcing = (specId: string) => {
    return useQuery({
        queryKey: ["projects", specId],
        queryFn: () => getSourcingOptions(specId)
    })
}
