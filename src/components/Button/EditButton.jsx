import { useLocation } from 'wouter';
import Button from '@/components/Button/Button';

const EditButton = ({ classId, editURL }) => {
    const [, setLocation] = useLocation();

    return (
        <Button label="Edit" onClick={() => setLocation(`${editURL}/${classId}`)} />
    )
}

export default EditButton;