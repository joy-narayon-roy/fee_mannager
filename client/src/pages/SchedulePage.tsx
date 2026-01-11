import { Link } from 'react-router-dom';
import ScheduleCard from '../components/schedule/scheduleCard';
import { useMainContext } from '../contexts/MainContext/MainContext';

function SchedulePage() {
    const { profile } = useMainContext()
    const schedules = Object.values(profile.schedules).sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    

    return (
        <div className="mx-2">
            {/* Page Header */}
            <div className="flex items-center justify-between max-w-xl">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Schedules</h1>
                    <p className="text-sm text-gray-500">
                        Weekly class schedules
                    </p>
                </div>

                <Link to={'create'} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    + Add Schedule
                </Link>
            </div>

            {/* Schedule List */}
            <div className="flex flex-col gap-6">
                {schedules.map((schedule) => (
                    <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
            </div>
        </div>
    );
};

export default SchedulePage;
