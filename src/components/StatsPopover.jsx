import { Icon, Text, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, VStack, Flex, UnorderedList, ListItem, CardHeader, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react'
import React from 'react'


export const StatsPopover = ({ count, stats }) => {
    //const filterStatuses = columnFilters.find((f) => f.id === "status")?.value || [];
  return (
    <Popover isLazy placement="auto-start">
        <PopoverTrigger>
            <Button size='sm' colorScheme='messenger'>{count} Items</Button>
        </PopoverTrigger>
        <PopoverContent bg="gray.900" color="white" borderColor="gray.700" maxW="640px" maxH="70vh" overflowY="auto" boxShadow="lg">
            <PopoverArrow bg="gray.900" />
            <PopoverCloseButton color='white'/>
            <PopoverBody>
                <Text fontSize='md' fontWeight='bold' mb={4}>
                    Order Stats
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mb={3}>
                  {['Total', 'Live', 'Tips'].map((k, i) => (
                    <Stat key={i} p={3} border='1px' borderColor='gray.700' borderRadius='md' bg='gray.800'>
                      <StatLabel>{k}</StatLabel>
                      <StatNumber>{k === 'Total' ? (Object.values(stats||{}).reduce((a, v) => a + Object.values(v).reduce((x,y)=>x+y,0), 0)) : (k==='Live' ? 'On' : '')}</StatNumber>
                      <StatHelpText>{k==='Tips' ? 'Use filters below' : ''}</StatHelpText>
                    </Stat>
                  ))}
                </SimpleGrid>
                <Text fontWeight="semibold" mb={2}>By Category</Text>
                {Object.keys(stats || {}).map(outerKey => (
                  <>
                    <Text fontWeight="bold" fontSize="16">{outerKey}</Text>
                    <UnorderedList>
                      {Object.entries(stats[outerKey]).map(([innerKey, value]) => (
                        <ListItem key={innerKey}>{innerKey}: {value}</ListItem>
                      ))}
                    </UnorderedList>
                  </>
                ))}
            </PopoverBody>
        </PopoverContent>
    </Popover>
  )
}
