import { alignment, defaultDataType } from 'export-xlsx';

// Export settings for student data
export const SETTINGS_FOR_EXPORT = {
  fileName: 'dillar_students',
  workSheets: [
    {
      sheetName: 'Students',
      startingRowNumber: 1,
      gapBetweenTwoTables: 1,
      tableSettings: {
        student_data: {
          tableTitle: 'Student Data',
          headerDefinition: [
            {
              name: 'First Name',
              key: 'firstName',
            },
            {
              name: 'Last Name',
              key: 'lastName',
            },
            {
              name: 'Email',
              key: 'email',
            },
            {
              name: 'Account Creation Date',
              key: 'creationDate',
            },
            {
              name: 'Level',
              key: 'level',
            },
            {
              name: 'Age Group',
              key: 'ageGroup',
            },
            {
              name: 'Instructor',
              key: 'instructor',
            },
            {
              name: 'Google Classroom Link',
              key: 'classroomLink',
            },
            {
              name: 'Schedule (EST)',
              key: 'scheduleEST',
            },
            {
              name: 'Schedule (Istanbul)',
              key: 'scheduleIstanbul',
            },
          ],
        }
      }
    },
  ],
}; 