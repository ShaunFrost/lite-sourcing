import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addNewSupplier } from "../api"
import { toast } from "react-hot-toast";

export const useAddSupplier = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addNewSupplier,
        onSuccess: () => {
            console.log("Supplier added")
            toast.success("New Supplier added!", {
                duration: 1000,
                position: "bottom-center"
            })
            queryClient.invalidateQueries({
                queryKey: ["suppliers"]
            })
        },
        onError: () => {
            toast.error("Couldn't add supplier!", {
                duration: 1000,
                position: "bottom-center"
            })
        }
    });
}
