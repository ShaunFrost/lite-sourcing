import { Link } from "react-router-dom"

const HomeLink = () => {
    return (
        <div className="absolute flex flex-row gap-2 right-6 top-4">
            <Link to="/" state={{tab: "Projects"}}>Projects</Link>
            <Link to="/" state={{tab: "Directory"}}>Suppliers</Link>
        </div>
    )
}

export default HomeLink
