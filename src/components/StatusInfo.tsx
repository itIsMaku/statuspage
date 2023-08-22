import "./StatusInfo.css";
import { Status } from "./App";
import { Tooltip } from "react-tooltip";

const getLastStatus = (status: Status) => {
    let newest;
    for (const historyItem of status.history) {
        if (!newest || historyItem.timestamp > newest.timestamp) {
            newest = historyItem;
        }
    }
    return newest;
};

const getStatusColor = (history: any) => {
    if (history == undefined) return "neutral";
    return history.up ? "up" : "down";
};

const getUptimePercentForLastDays = (status: Status, lastDays: number) => {
    const now: Date = new Date();
    const timeThreshold: Date = new Date(now);
    timeThreshold.setDate(now.getDate() - lastDays);

    let totalUptime = 0;
    let uptime = 0;

    for (const historyItem of status.history) {
        if (new Date(historyItem.timestamp) >= timeThreshold) {
            totalUptime += 24 * 60 * 60 * 1000;
            if (historyItem.up) {
                uptime += 24 * 60 * 60 * 1000;
            }
        } else if (new Date(historyItem.timestamp) >= now) {
            break;
        }
    }

    if (totalUptime === 0) {
        return 0.0;
    }

    const uptimePercentage = (uptime / totalUptime) * 100;
    return uptimePercentage;
};

const getFormattedTooltipInfo = (history: any) => {
    if (history == undefined) return "N/A";
    return `${history.timestamp}`;
};

export default function StatusInfo({ status }: { status: Status }) {
    return (
        <div className="status">
            <div className="status-icon-wrapper">
                <div
                    className={`status-icon ${
                        getLastStatus(status)?.up ? "up" : "down"
                    }`}
                ></div>
            </div>
            <div className="status-info">
                <div className="status-name">{status.name}</div>
                <div className="status-description">{status.description}</div>
            </div>
            <div className="status-history-bar-wrapper">
                <div className="status-history-bar">
                    {[...Array(30)].map((e, i) => {
                        const reversedIndex = 29 - i; // Počítá odzadu, kde 29 je index posledního prvku
                        return (
                            <>
                                <div
                                    key={i}
                                    className={`status-history-item ${getStatusColor(
                                        status.history.reverse()[reversedIndex]
                                    )}`}
                                    data-tooltip-id={`tooltip-${reversedIndex}-${status.id}-${status.name}`}
                                ></div>
                                <Tooltip
                                    id={`tooltip-${reversedIndex}-${status.id}-${status.name}`}
                                    place="top"
                                    content={getFormattedTooltipInfo(
                                        status.history.reverse()[reversedIndex]
                                    )}
                                />
                            </>
                        );
                    })}
                </div>
                <div className="status-history-description">
                    <span className="status-history-description-item left">
                        Historie
                    </span>
                    <span className="status-history-description-item uptime">
                        {getUptimePercentForLastDays(status, 30).toFixed(2)}%
                    </span>
                    <span className="status-history-description-item right">
                        Nyní
                    </span>
                </div>
            </div>
        </div>
    );
}
