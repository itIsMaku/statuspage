import { useState } from "react";
import "./App.css";
import StatusInfo from "./StatusInfo";
import axios from "axios";

export interface StatusesCategory {
    id: number;
    name: string;
    description: string;
    statuses: Status[];
}

export interface Status {
    id: number;
    name: string;
    description: string;
    history: {
        timestamp: string;
        up: boolean;
    }[];
    lastUpdated: Date;
}

export default function App() {
    const [statuses, setStatuses] = useState<{
        [key: string]: StatusesCategory;
    }>({});

    axios.get("http://localhost:8081/api/statuses").then((response) => {
        setStatuses(response.data);
    });

    return (
        <>
            <p className="status-page-header">Status</p>
            <div className="status-container">
                {Object.keys(statuses).map((key) => {
                    const category = statuses[key];
                    return (
                        <div className="status-category" key={category.id}>
                            <p>{category.name}</p>
                            <div className="status-header-description">
                                {category.description}
                            </div>
                            <div className="status-list">
                                {category.statuses.map((status) => {
                                    return (
                                        <StatusInfo
                                            key={status.id}
                                            status={status}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
