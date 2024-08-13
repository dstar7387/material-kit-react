import './App.css';
import { Calendar, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { localiser } from './localeData';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import { Input, Button } from '@mui/material';
import { fetchData, saveData, deleteData } from './app-init-HA';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Iconify from 'src/components/iconify';
import { message } from 'antd';

export default function AppCalendar({ value, setValue }) {
  let currentDate = new Date();
  const [textValue, setTextValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasInputForToday, setHasInputForToday] = useState(false);

  // Fetch data when the component mounts

  useEffect(() => {
    const _fetchData = async () => {
      const data = await fetchData();
      const today = dayjs().format('YYYY-MM-DD');

      if (data) {
        const existingEntry = data.find((todo) => dayjs(todo.date).format('YYYY-MM-DD') !== today);
        if (existingEntry) {
          setHasInputForToday(true);
        }
        const result = data.map((item) => {
          return { title: item[1], start: new Date(item[3]), end: new Date(item[3]) };
        });

        setValue(result);
      }
    };
    _fetchData();
  }, [textValue]);

  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleClick = () => {
    if (textValue == '') {
      message.error('Please Input your HA activity');
      return;
    }
    const today = new Date();
    const formatDate = selectedDate ? selectedDate.toDate() : today;
    console.log(value, "-----------value");
    const existingEntry = value.find(
      (todo) => dayjs(todo.start).format('YYYY-MM-DD') == dayjs(formatDate).format('YYYY-MM-DD')
    );
    if (existingEntry) {
      setHasInputForToday(true);
      message.error('You have already input data for day.');
      return;
    }

    // today format like "YYYY-MM-DD"

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const dd = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const dataList = {
      userId: '1',
      title: textValue,
      content: textValue,
      date: selectedDate ? selectedDate.format('YYYY-MM-DD') : formattedDate,
    };

    const newTodo = {
      title: textValue,
      start: formatDate,
      end: formatDate, // Assuming a one-day event, otherwise adjust accordingly
      allDay: true, // Set to true for an all-day event
    };

    setTextValue(''); // Clear the input field
    setSelectedDate(null); // Reset the date picker

    saveData(dataList);
    setValue([...value, newTodo]);
  };

  /////////////////////////////////////////////////////////////////////////
  // Function to handle event removal///////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  const handleEventRemove = (event) => {
    const updatedTodos = value.filter(
      (todo) => !(todo.title === event.title && todo.start.getTime() === event.start.getTime())
    );
    setValue(updatedTodos);
    const index = value.findIndex(
      (todo) => todo.title === event.title && todo.start.getTime() === event.start.getTime()
    );
    deleteData({ index: index });
  };

  // Event style customizer with remove button
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#3174ad',
        borderRadius: '5px',
        color: 'white',
        border: 'none',
        display: 'block',
        cursor: 'pointer',
      },
    };
  };

  // When an event is selected, prompt for deletion
  const handleEventSelect = (event) => {
    const confirmDelete = window.confirm(`Do you want to delete the event: "${event.title}"?`);
    if (confirmDelete) {
      handleEventRemove(event);
    }
  };

  return (
    <>
      <Grid xs={12} md={12} lg={12}>
        <Card>
          <CardHeader title="Your activities" subheader="You can show all activities on here." />
          <Box sx={{ mx: 3 }} p={4} width="100%" display="flex" alignItems="center" gap={5}>
            <Input
              placeholder="Type in here…"
              variant="outlined"
              color="primary"
              value={textValue}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                defaultValue={dayjs(currentDate)}
                value={selectedDate}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
            <Button
              onClick={handleClick}
              size="medium"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              HA confirm
            </Button>
          </Box>
          <Box sx={{ mx: 1 }} p={2}>
            <Calendar
              localizer={localiser}
              events={value}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              defaultView={Views.MONTH} // Set the default view to 'month'
              views={[Views.MONTH]} // Restrict views to 'month' only
              className="h-screen my-10 bg-richGreen text-black"
              onSelectEvent={handleEventSelect} // Handle event click to prompt deletion
              eventPropGetter={eventStyleGetter} // Apply custom styles
            />
          </Box>
        </Card>
      </Grid>
    </>
    // <div className="min-h-screen bg-richGreen text-gray-800 py-10 px-4">
    //   <div className="flex items-center mb-4">
    //     <input
    //       type="text"
    //       placeholder="Enter Todo Title"
    //       className="w-1/4 mr-4 p-2 rounded-md text-gray-800 border border-gray-200 focus:border-gray-400 hover:border-gray-300"
    //       value={newTodo.title}
    //       onChange={(event) => setNewTodo({ ...newTodo, title: event.target.value })}
    //     />
    //     {/* <DatePicker
    //       placeholderText="Enter Date"
    //       className="mr-4 p-2 rounded-md text-gray-800 border border-gray-200 focus:border-gray-400 hover:border-gray-300"
    //       selected={newTodo.date}
    //       onChange={(date) => setNewTodo({ ...newTodo, date })}
    //     /> */}
    //     <button
    //       className="px-4 py-2 rounded-md bg-gray-300 hover:bg-lightGray focus:outline-none border border-transparent"
    //       onClick={handleCreateTodo}
    //     >
    //       Add New Todo
    //     </button>
    //   </div>

    // </div>
  );
}
