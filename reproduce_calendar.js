
const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
};

const renderCalendarDays = (currentDate) => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays = [];

    console.log(`Date: ${currentDate.toISOString()}`);
    console.log(`Days in month: ${daysInMonth}`);
    console.log(`First day index: ${firstDay}`);

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(`empty-${i}`);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(`day-${day}`);
    }

    return calendarDays;
};

const date = new Date('2025-12-02');
const cells = renderCalendarDays(date);
console.log(`Total cells: ${cells.length}`);
console.log(cells);

// Check for duplicates
const uniqueCells = new Set(cells);
if (uniqueCells.size !== cells.length) {
    console.log('DUPLICATES FOUND!');
} else {
    console.log('No duplicates found in logic.');
}
