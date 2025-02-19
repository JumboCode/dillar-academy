import { useLocation, useParams } from 'wouter';
import Button from '@/components/Button/Button';

const EditButton = ({ classId, editURL }) => {
    const params = useParams();
    const [, setLocation] = useLocation();

    return (
        <Button label="Edit" onClick={() => setLocation(`${editURL}/${classId}`)} />
    )
}

export default EditButton;