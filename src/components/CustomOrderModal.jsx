import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast
} from '@chakra-ui/react';
import { apiUrl } from '../config';

export default function CustomOrderModal({ isOpen, onClose, editOrder = null }) {
  const [formData, setFormData] = useState({
    name: '',
    firstLine: '',
    city: '',
    state: '',
    zip: '',
    shipDate: '',
    itemTitle: '',
    quantity: '1',
    size: '',
    message: ''
  });

  React.useEffect(() => {
    if (isOpen && editOrder) {
      setFormData({
        name: editOrder.name || '',
        firstLine: editOrder.shipping_address?.first_line || '',
        city: editOrder.shipping_address?.city || '',
        state: editOrder.shipping_address?.state || '',
        zip: editOrder.shipping_address?.zip || '',
        shipDate: editOrder.date?.raw_date || editOrder.ship_date || '',
        itemTitle: editOrder['formatted value'] || '',
        quantity: String(editOrder.quantity || 1),
        size: editOrder.size?.name || '',
        message: editOrder.message_from_buyer || ''
      });
    } else if (isOpen && !editOrder) {
      setFormData({
        name: '', firstLine: '', city: '', state: '', zip: '', shipDate: '', itemTitle: '', quantity: '1', size: '', message: ''
      });
    }
  }, [isOpen, editOrder]);

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch current dashboard state
      const res = await fetch(apiUrl('/api/v1/etsy/dashboard-state'));
      const state = await res.json();
      const currentData = state.data || [];

      // 2. Build custom order payload
      const customId = editOrder ? editOrder.receipt_id : `custom_${Date.now()}`;
      const creationTsz = editOrder ? editOrder.creation_tsz : Math.floor(Date.now() / 1000);
      
      const getFormattedDate = (dateStr) => {
        if (!dateStr) return 'TBD';
        const d = new Date(dateStr + 'T12:00:00Z');
        const ordinal = (n) => {
          const s = ['th', 'st', 'nd', 'rd'];
          const v = n % 100;
          return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short' }) + ' ' + ordinal(d.getDate());
        return formatted;
      };

      const getShipWeekData = (dateStr) => {
        if (!dateStr) return { weekLabel: 'TBD', weekNum: '1' };
        const d = new Date(dateStr + 'T12:00:00Z');
        
        // Approximate ISO week number calculation
        const target = new Date(d.valueOf());
        const dayNr = (d.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        const isoWeek = 1 + Math.ceil((firstThursday - target) / 604800000);
        
        const adjWeek = Math.max(1, isoWeek - 1);
        return {
          weekLabel: `Week ${adjWeek}, ${d.getFullYear()}`,
          weekNum: String(adjWeek)
        };
      };
      
      const weekData = getShipWeekData(formData.shipDate);
      
      const newOrder = {
        receipt_id: customId,
        is_custom_order: true,
        name: formData.name,
        buyer_email: 'custom@example.com',
        creation_tsz: creationTsz,
        ship_date: formData.shipDate,
        ship_week: 'Custom Orders',
        ship_week_num: '0',
        date: {
          formatted: getFormattedDate(formData.shipDate),
          time_left: 'Custom',
          progress_percent: 0,
          raw_date: formData.shipDate
        },
        location: formData.state || 'Unknown',
        quantity: parseInt(formData.quantity, 10) || 1,
        'formatted value': formData.itemTitle,
        size: formData.size ? { name: formData.size, id: 99, color: 'purple.100' } : null,
        message_from_buyer: formData.message,
        status: editOrder ? editOrder.status : { id: 1, name: 'Received', color: 'blue.300' },
        shipping_address: {
          name: formData.name,
          first_line: formData.firstLine,
          second_line: editOrder?.shipping_address?.second_line || '',
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country_iso: 'US'
        },
        formatted_address: `${formData.name}\n${formData.firstLine}\n${formData.city}, ${formData.state} ${formData.zip}`,
        warnings: editOrder ? editOrder.warnings : []
      };

      // 3. Update existing or insert at beginning of data so its group appears at the top
      let newData = [];
      if (editOrder) {
        newData = currentData.map(order => order.receipt_id === customId ? newOrder : order);
      } else {
        newData = [newOrder, ...currentData];
      }
      
      // 4. Save to backend
      const clientId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const saveRes = await fetch(apiUrl('/api/v1/etsy/dashboard-state?client_id=' + clientId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: newData,
          count: editOrder ? state.count : state.count + 1,
          stats: state.stats
        })
      });

      if (!saveRes.ok) throw new Error('Failed to save');
      
      toast({ title: editOrder ? 'Custom order updated!' : 'Custom order created!', status: 'success', duration: 3000 });
      onClose();
      // Reset form
      setFormData({
        name: '', firstLine: '', city: '', state: '', zip: '', shipDate: '', itemTitle: '', quantity: '1', size: '', message: ''
      });
      
    } catch (err) {
      console.error(err);
      toast({ title: 'Error creating custom order', status: 'error', duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="white" borderRadius="xl">
        <ModalHeader>Create Custom Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Buyer Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Ship Date</FormLabel>
              <Input type="date" name="shipDate" value={formData.shipDate} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Street Address</FormLabel>
              <Input name="firstLine" value={formData.firstLine} onChange={handleChange} placeholder="123 Main St" />
            </FormControl>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input name="city" value={formData.city} onChange={handleChange} placeholder="Anytown" />
              </FormControl>
              <FormControl isRequired w="100px">
                <FormLabel>State</FormLabel>
                <Input name="state" value={formData.state} onChange={handleChange} placeholder="CA" />
              </FormControl>
              <FormControl isRequired w="150px">
                <FormLabel>ZIP</FormLabel>
                <Input name="zip" value={formData.zip} onChange={handleChange} placeholder="12345" />
              </FormControl>
            </div>

            <FormControl isRequired>
              <FormLabel>Item Title</FormLabel>
              <Input name="itemTitle" value={formData.itemTitle} onChange={handleChange} placeholder="Custom product name" />
            </FormControl>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <FormControl>
                <FormLabel>Size (optional)</FormLabel>
                <Input name="size" value={formData.size} onChange={handleChange} placeholder="e.g. Large" />
              </FormControl>
              <FormControl w="100px">
                <FormLabel>Quantity</FormLabel>
                <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" />
              </FormControl>
            </div>

            <FormControl>
              <FormLabel>Buyer Notes (optional)</FormLabel>
              <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Any special requests..." />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>Create Order</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
