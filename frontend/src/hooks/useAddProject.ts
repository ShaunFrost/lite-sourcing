import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addNewProject } from "../api"
import { toast } from "react-hot-toast";

export const useAddProject = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addNewProject,
        onSuccess: () => {
            console.log("Project added")
            toast.success("New Project added!", {
                duration: 1000,
                position: "bottom-center"
            })
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
        },
        onError: () => {
            toast.error("Couldn't add project!", {
                duration: 1000,
                position: "bottom-center"
            })
        }
    });
}
