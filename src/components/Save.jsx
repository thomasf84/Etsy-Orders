import { Button, Box } from '@chakra-ui/react'
import React from 'react'
import { apiUrl } from '../config'
//import { DATA } from '../data2.js'


const Save = ({rows, count, stats}) => {
    
    //console.log(rows)
   
   const saveButton = async () => {
    let data = []
    console.log(rows)
    if (Object.keys(rows).length !== 0) {
      console.log(rows)
      const filteredRows = Object.keys(rows).filter(key => !key.includes('week')).map(key => rows[key]);
      console.log(filteredRows)
      filteredRows.map(row => {
        
          data.push(row.original)
        
        console.log(data)
        })
        
       try {
        // Uses API_BASE + '/setdata' if you set VITE_API_BASE_URL; otherwise relies on dev proxy
        const response = await fetch(apiUrl('/setdata'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
          },
          
          body: JSON.stringify({"data": data, "count": count, "stats": stats})
          
        });

        // Handle the response
        
      } catch (error) {
        console.error('Error:', error);
      }
    };
    }
    

  return (
    <Box>
        <Button size='sm' bg="cyan.600" colorScheme='telegram' onClick={saveButton}>Save</Button>
    </Box>
  )
}

export default Save