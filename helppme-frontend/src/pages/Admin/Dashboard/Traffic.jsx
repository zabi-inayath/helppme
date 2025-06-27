import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from "recharts";

const Traffic = () => {
    const [callData, setCallData] = useState([]);
    const [totalCallCount, setTotalCallCount] = useState(0);
    const [range, setRange] = useState('30');
    const [visitorData, setVisitorData] = useState([]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/call-traffic`, { params: { range } })
            .then((res) => setCallData(res.data))
            .catch(() => setCallData([]));

        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/total-call-count`)
            .then((res) => setTotalCallCount(res.data.total_call_count || 0))
            .catch(() => setTotalCallCount(0));

        // Fetch website visitor data
        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/api/helppme/website-visitors`, { params: { range } })
            .then((res) => setVisitorData(res.data))
            .catch(() => setVisitorData([]));
    }, [range]);

    // Prepare chart data (ascending order for chart)
    const chartData = callData
        .map((row) => ({
            ...row,
            call_count: Number(row.call_count || 0),
            formattedDate: row.date
                ? new Date(row.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
                : ""
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending (oldest to newest)

    // Table data: reverse chartData for table so today shows first
    const tableData = [...chartData].reverse();

    // Prepare visitor chart data
    const visitorChartData = visitorData
        .map((row) => ({
            ...row,
            visitor_count: Number(row.visitor_count || 0),
            formattedDate: row.date
                ? new Date(row.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
                : ""
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending

    // Prepare visitor table data (reverse for newest first)
    const visitorTableData = [...visitorChartData].reverse();

    // Calculate total visitor count for the selected range
    const totalVisitorCount = visitorChartData.reduce(
        (sum, row) => sum + (Number(row.visitor_count) || 0),
        0
    );

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50">
            <h2 className="text-3xl font-bold mb-6 text-blue-700 tracking-tight">
                📈 Traffic Analytics
            </h2>

            {/* Date Range Buttons */}
            <div className="mb-4 flex gap-2">
                <button onClick={() => setRange('7')} className={`px-3 py-1 rounded ${range === '7' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>7 Days</button>
                <button onClick={() => setRange('30')} className={`px-3 py-1 rounded ${range === '30' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>30 Days</button>
                <button onClick={() => setRange('90')} className={`px-3 py-1 rounded ${range === '90' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>90 Days</button>
            </div>

            {/* Chart Card: Website Visitors */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Website Visitors
                    </h3>
                    <span className="text-3xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg shadow">
                        {totalVisitorCount}
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={visitorChartData}>
                        <defs>
                            <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0175F3" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0175F3" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            tick={{ fontSize: 13, fill: "#0175F3" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 13, fill: "#0175F3" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "#fff",
                                borderRadius: "12px",
                                boxShadow: "0 2px 12px #0001",
                                border: "none",
                                color: "#222"
                            }}
                            labelStyle={{ fontWeight: 600, color: "#0175F3" }}
                            labelFormatter={(label) =>
                                label
                                    ? label
                                    : ""
                            }
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="visitor_count"
                            name="Visitor Count"
                            stroke="#0175F3"
                            strokeWidth={3}
                            dot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                            fill="url(#colorVisitor)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Table Card: Visitor Data */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="#0175F3" strokeWidth="2" strokeLinecap="round" /></svg>
                    Detailed Visitor Data
                </h3>
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="py-3 px-5 bg-blue-50 text-blue-700 rounded-l-lg font-semibold text-sm">
                                    Date
                                </th>
                                <th className="py-3 px-5 bg-blue-50 text-blue-700 rounded-r-lg font-semibold text-sm">
                                    Visitor Count
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitorTableData.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-6 text-center text-gray-400">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                visitorTableData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="transition hover:bg-blue-50"
                                    >
                                        <td className="py-3 px-5 rounded-l-lg text-gray-700 font-medium">
                                            {row.formattedDate}
                                        </td>
                                        <td className="py-3 px-5 rounded-r-lg text-gray-700 font-semibold">
                                            {row.visitor_count}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Chart Card: Call Count */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Total Calls (All Services)
                    </h3>
                    <span className="text-3xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg shadow">
                        {totalCallCount}
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={chartData}>
                        <defs>
                            <linearGradient id="colorCall" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0175F3" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0175F3" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            tick={{ fontSize: 13, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 13, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "#fff",
                                borderRadius: "12px",
                                boxShadow: "0 2px 12px #0001",
                                border: "none",
                                color: "#222"
                            }}
                            labelStyle={{ fontWeight: 600, color: "#0175F3" }}
                            labelFormatter={(label) =>
                                label
                                    ? label
                                    : ""
                            }
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="call_count"
                            name="Call Count"
                            stroke="#0175F3"
                            strokeWidth={3}
                            dot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                            fill="url(#colorCall)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="#0175F3" strokeWidth="2" strokeLinecap="round" /></svg>
                    Detailed Call Data
                </h3>
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="py-3 px-5 bg-blue-50 text-blue-700 rounded-l-lg font-semibold text-sm">
                                    Date
                                </th>
                                <th className="py-3 px-5 bg-blue-50 text-blue-700 rounded-r-lg font-semibold text-sm">
                                    Call Count
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-6 text-center text-gray-400">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                tableData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="transition hover:bg-blue-50"
                                    >
                                        <td className="py-3 px-5 rounded-l-lg text-gray-700 font-medium">
                                            {row.formattedDate}
                                        </td>
                                        <td className="py-3 px-5 rounded-r-lg text-gray-700 font-semibold">
                                            {row.call_count}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Traffic;