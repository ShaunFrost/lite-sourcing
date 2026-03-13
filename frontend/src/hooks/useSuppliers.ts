import { useQuery } from "@tanstack/react-query"
import { getSuppliers } from "../api"

export const useSuppliers = () => {
    return useQuery({
        queryKey: ["suppliers"],
        queryFn: getSuppliers
    })
}
