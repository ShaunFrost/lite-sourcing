import { useQuery } from "@tanstack/react-query"
import { getProductsForSupplier } from "../api"

export const useProducts = (supplierId?: string) => {
    return useQuery({
        queryKey: ["suppliers", supplierId],
        queryFn: () => getProductsForSupplier(supplierId!),
        enabled: !!supplierId
    })
}
