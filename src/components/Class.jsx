import React, { useState, useEffect } from 'react';

const Class = ({level, instructor, title, ageGroup, schedule}) => (
    <div className='ClassCard'>
        <p>Level: {level}</p>
        <p>Instructor: {instructor}</p>
        <p>Age Group: {ageGroup}</p>
        <p>Schedule: {schedule}</p>
    </div>
);

export default Class;