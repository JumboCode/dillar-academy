import { useState } from 'react';
import Button from '@/components/Button/Button';
import Overlay from '@/components/Overlay';
import { toTitleCase } from '@/utils/formatters';

const DeleteButton = ({ item, onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = async () => {
    await onDelete();
    setShowPopup(false);
  }

  return (
    <>
      <Button
        label={`Delete ${toTitleCase(item)}`}
        onClick={() => setShowPopup(true)}
      />

      {showPopup && <Overlay width={'w-[22rem]'}>
        <div className="space-y-1">
          <h3 className='font-extrabold'>Delete Confirmation</h3>
          <p className='text-base sm:text-lg'>
            {'Are you sure you want to delete this ' + item + '?'}
          </p>
        </div>
        <div className='grid grid-cols-2 w-fit gap-x-2'>
          <Button label={'Confirm'} onClick={handleDelete} />
          <Button
            label={'Cancel'}
            isOutline={true}
            onClick={() => setShowPopup(false)} />
        </div>
      </Overlay>}
    </>
  )
}

export default DeleteButton;