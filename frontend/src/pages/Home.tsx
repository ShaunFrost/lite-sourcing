import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { Tab } from "../types";
import Projects from "../components/Projects";
import Suppliers from "../components/Suppliers";
import Header from "../components/Header";

const Home = () => {
    const location = useLocation()
    const [selectedTab, setSelectedTab] = useState<Tab>(location?.state?.tab || "Projects")
    return  (
        <main className="w-screen h-screen flex flex-col items-center gap-4">
            <Header />
            <div className="w-fit p-2 flex flex-row gap-2 bg-(--color-primary) rounded-full text-white">
                <button className={`${selectedTab === "Projects" ? 'bg-(--color-secondary)' : ''} rounded-full px-4 py-2 cursor-pointer`}
                    onClick={() => setSelectedTab("Projects")}
                >
                    Projects
                </button>

                <button className={`${selectedTab === "Directory" ? 'bg-(--color-secondary)' : ''} rounded-full px-4 py-2 cursor-pointer`}
                    onClick={() => setSelectedTab("Directory")}
                >
                    Directory
                </button>
            </div>
            <div className="w-[80%] h-125 rounded-2xl border-2 border-black overflow-y-scroll">
                {
                    selectedTab === "Projects" ? <Projects /> : <Suppliers />
                }
            </div>
        </main>
    )
}

export default Home;
