import { RotatingLines } from "react-loader-spinner"

interface LoadingStateProps {
    size: number
}

const Loading = ({size}: LoadingStateProps) => {
    return (
        <RotatingLines color="#355872" height={size} width={size} animationDuration={0.8} />
    )
}

export default Loading;
