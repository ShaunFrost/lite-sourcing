import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addNewSpecItem } from "../api"
import { toast } from "react-hot-toast";

export const useAddSpec = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addNewSpecItem,
        onSuccess: (data) => {
            console.log("spec add data", data)
            console.log("Spec added")
            toast.success("New spec added!", {
                duration: 1000,
                position: "bottom-center"
            })
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
        },
        onError: () => {
            toast.error("Couldn't add spec!", {
                duration: 1000,
                position: "bottom-center"
            })
        }
    });
}
