import Button from '@/components/Button'
import { useState } from 'react';

const UnenrollButton = ({ userId, classId }) => {
    const onClick = async () => {
        await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, classId }),
        });
    };

    return <Button label={"Unenroll"} onClick={onClick} />;
};

export default UnenrollButton;
