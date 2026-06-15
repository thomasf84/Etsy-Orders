import { forwardRef } from 'react'
import { Center, Icon, Box } from '@chakra-ui/react'
import DatePicker from "react-datepicker"
import CalendarIcon from './icons/CalendarIcon'
import "react-datepicker/dist/react-datepicker.css"

const DateCustomInput = forwardRef(({value, onClick, clearDate}, ref) => <Center ref={ref} onClick={onClick} cursor='pointer'>
    {value ? <>{value}
    <Box 
    pos="absolute" 
    right={3} 
    fontSize='md' 
    color='red.300' 
    onClick={(e) => {
            e.stopPropagation()
           clearDate()
        }
    }>&times;</Box></> : <Icon as={CalendarIcon} fontSize='xl' />}</Center>)

export const DateCell = ({getValue, row, column, table}) => {
    const date = getValue();
    const { updateData } = table.options.meta;
  return (
    <DatePicker 
        wrapperClassName='date-wrapper' 
        dateFormat='MMM d' 
        selected={date} 
        onChange={(date) => updateData(row.index, column.id, date)}
        customInput={
            <DateCustomInput  clearDate={
                () => updateData(
                    row.index, column.id, null
                )
            }/>
        }
        />
  )
}
