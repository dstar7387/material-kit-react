import { dateFnsLocalizer } from 'react-big-calendar'
import enGB from "date-fns/locale/en-GB"
import { format, parse, startOfWeek, getDay } from 'date-fns';

export const locales = {
  "en-GB": enGB
}

export const localiser = dateFnsLocalizer({
  format, // function to format dates
  parse,  // function to parse dates
  startOfWeek, // function to determine the start of the week
  getDay, // function to get the day of the week
  locales, // a map from locale code to a date-fns locale object
})