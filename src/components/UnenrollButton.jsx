import Button from '@/components/Button'
import { useState } from 'react';


const UnenrollButton = ({ classObj }) => {
    return (
        <Button label={"Unenroll"} onClick={onClick}></Button>
    )
}

export {UnenrollButton};