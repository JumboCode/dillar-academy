import EnrollButton from '@/components/EnrollButton'
import UnenrollButton from '@/components/UnenrollButton'

const Class = ({ classObj }) => {
    const ageGroup = classObj.ageGroup.toString()
    return (
        <div className="bg-white px-4 py-3 rounded-lg w-1/4 h-1/4 shadow-md">
            <p>{ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}'s Class</p>
            <p>with {classObj.instructor}</p>
            {classObj.schedule.map((schedule, index) => (
                <p key={index}>{schedule.day} {schedule.time}</p>
            ))}
            <div className='grid grid-cols-2 gap-3'>
                <EnrollButton classId={classObj._id} />
                <UnenrollButton classId={classObj._id} />
            </div>
            
        </div>
    )
};

export default Class;