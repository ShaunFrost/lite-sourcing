import { useQueryClient, useMutation } from "@tanstack/react-query"
import { attachSourcing } from "../api"
import { toast } from "react-hot-toast";

export const useAddSpecSourcing = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: attachSourcing,
        onSuccess: (data) => {
            console.log("sourcing add data", data)
            console.log("sourcing added")
            toast.success("Source attached!", {
                duration: 1000,
                position: "bottom-center"
            })
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
        },
        onError: () => {
            toast.error("Couldn't attach sourcing to spec!", {
                duration: 1000,
                position: "bottom-center"
            })
        }
    });
}
