import { Link } from "react-router-dom"

export default function StudentFee() {
    return (
        <div className="py-2">
            <div className="flex justify-between">
                <h1 className="text-lg">Fee</h1>
                <Link className="bg-green-600 text-white px-4 py-2 rounded-md" to={"/schedule"}>+Create</Link>
            </div>
            <div className="text-center">Fee Comming Soon!</div>
        </div>
    )
}
