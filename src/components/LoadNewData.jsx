import { Button, Box } from '@chakra-ui/react'
import React from 'react'
import { apiUrl } from '../config'

export const LoadNewData = (setData) => {

    const loadButton = async () => {
        try {
          const response = await fetch(apiUrl('/api/v1/etsy/active'))
           // const result = await response.json();
            //() => setData(result.data);
    
          // Handle the response
          
        } catch (error) {
          console.error('Error:', error);
        }
      };

  return (
    <Box>
        <Button size='sm' bg="green.600" colorScheme='green' onClick={loadButton}>Load new data</Button>
    </Box>
  )
}
