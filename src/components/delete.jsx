import Button from '@/components/Button/Button';
import Overlay from '@/components/Overlay';

const DeletePopup = ({itemName, onDelete, setShowPopup }) => {

    const handleDelete = async () => {
        await onDelete();
        setShowPopup(false);
    }

    return (
        <Overlay width={'w-[22rem]'}>
        <div className="space-y-1">
            <h3 className='font-extrabold'>{'Delete Confirmation'}</h3>
            <p className='text-base sm:text-lg'>
            {'Are you sure you would like to delete ' + itemName + '?'}
            </p>
        </div>
        <div className='grid grid-cols-2 w-fit gap-x-2'>
            <Button label={'Confirm'} onClick={handleDelete} />
            <Button
            label={'Cancel'}
            isOutline={true}
            onClick={() => setShowPopup(false)} />
        </div>
        </Overlay>
    )
}

export default DeletePopup;