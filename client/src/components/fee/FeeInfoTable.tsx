import { Link, useNavigate } from 'react-router-dom';
import MainButton from '../../components/MainButton';
import type { Fee, Student } from '../../models';

type PropsType = {
    fee?: Fee | undefined | null,
    student?: Student | undefined | null
}
export default function FeeInfoTable({ fee, student }: PropsType) {
    const status_colors = {
        Paid: "bg-green-100 text-green-700",
        Partial: "bg-yellow-100 text-yellow-700",
        Unpaid: "bg-red-100 text-red-700"
    }

    const nav = useNavigate()

    const goToFee = () => {
        nav(`/payment/pay?fee=${fee?.id}&student=${student?.id}`)
    }

    return (
        <>
            <div className="mt-5 mx-auto w-full md:max-w-2xl">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                Name
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                <Link to={`/student/${student?.id}`}>{student?.name || '-'}</Link>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                ID
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                {student?.short_id || '-'}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                Month
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                {fee?.monthString}/{fee?.year}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                Total Fee
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                ৳ {fee?.total_amount || 0}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                Discount
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">
                                − ৳ {fee?.discount || 0}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                Paid Amount
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                ৳ {fee?.paid_amount || 0}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                Due Amount
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3 text-sm font-semibold text-red-600">
                                ৳ {fee?.due_amount || 0}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                                Status
                            </td>
                            <td className="px-2 py-3 text-gray-400">:</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
            ${status_colors[fee?.status || 'Unpaid']}`}
                                >
                                    {fee?.status}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="p-2">
                                <MainButton onClick={goToFee} disabled={fee?.status === 'Paid'}>Payment</MainButton>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </>
    )
}


