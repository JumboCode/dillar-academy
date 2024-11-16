import Button from '@/components/Button';
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";

const Class = ({ classObj }) => {
    const ageGroup = classObj.ageGroup.toString();
    
    return (
        <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div>
                        <h3 className="text-xl font-bold text-dark-blue-800 mb-1">
                            {ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}'s Class
                        </h3>
                        <span className="text-sm text-neutral-400">w/ {classObj.instructor}</span>
                    </div>
                    
                    {/* Schedule */}
                    <div className="space-y-3">
                        {classObj.schedule.map((schedule, index) => (
                            <div key={index} className="flex items-center text-neutral-400 text-sm">
                                <div className="flex items-center gap-2 w-1/2">
                                    <IoCalendarOutline className="text-lg" />
                                    <span>{schedule.day}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IoTimeOutline className="text-lg" />
                                    <span>{schedule.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Register Button */}
                    <Button 
                        label="Register" 
                        isOutline={false}
                        className="w-full bg-dark-blue-800 text-white hover:bg-dark-blue-700 py-2.5"
                    />
                </div>
            </div>
        </div>
    );
};

export default Class;