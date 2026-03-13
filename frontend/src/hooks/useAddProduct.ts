import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addNewProductForSupplier } from "../api"
import { toast } from "react-hot-toast";

export const useAddProduct = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addNewProductForSupplier,
        onSuccess: (data) => {
            console.log("Product added")
            toast.success("New product added!", {
                duration: 1000,
                position: "bottom-center"
            })
            queryClient.invalidateQueries({
                queryKey: ["suppliers", data.supplier_id]
            })
        },
        onError: () => {
            toast.error("Couldn't add product!", {
                duration: 1000,
                position: "bottom-center"
            })
        }
    });
}
