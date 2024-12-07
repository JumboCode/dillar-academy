import Button from '@/components/Button/Button'
import { enrollInClass, unenrollInClass } from '../../api/class-wrapper';

const EnrollButton = ({ userId, classId, isEnroll }) => {
  const handleEnrollOrUnenroll = async () => {
    if (isEnroll) {
      await enrollInClass(classId, userId);
    } else {
      await unenrollInClass(classId, userId);
    }
  }
  return (
    <Button label={isEnroll ? "Enroll" : "Unenroll"} isOutline={false} onClick={handleEnrollOrUnenroll}></Button>
  )
}

export default EnrollButton;