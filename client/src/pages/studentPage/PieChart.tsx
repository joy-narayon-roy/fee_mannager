import {
    PieChart as RechartsPieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface DataItem {
    name: string;
    color?: string;
    value: number;
}

const def_data: DataItem[] = [
    // { name: "Food", value: 4000 },
    // { name: "Transport", value: 2000 },
    // { name: "Shopping", value: 3000 },
    // { name: "Bills", value: 2500 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type Props = {
    data?: DataItem[]
    colors?: string[]
}

export default function PieChart(props: Props) {
    const {
        data = def_data,
        colors = COLORS
    } = props
    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                    >
                        {data.map((d, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={d.color || colors[index % colors.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}