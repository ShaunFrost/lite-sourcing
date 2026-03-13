import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { Toaster } from "react-hot-toast"
import SupplierCatalog from "./pages/SupplierCatalog"
import Project from "./pages/Project"

function App() {
    
    return  (
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/supplier/:supplierId" element={<SupplierCatalog />} />
                <Route path="/project/:projectId" element={<Project />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
