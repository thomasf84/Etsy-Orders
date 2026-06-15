// Sample data for development/testing purposes
// This file can be used for mock data when the API is not available

export const SAMPLE_DATA = [
  {
    id: 1,
    date: { formatted: "2024-01-15" },
    receipt_id: "12345",
    location: "Warehouse A",
    status: { id: 1, name: "Received", color: "blue.300" },
    name: "John Doe",
    quantity: 2,
    "formatted value": "Custom Wood Sign",
    size: { id: 1, name: "15", color: "blue.300" },
    is_gift: false,
    "message from buyer": "Please make it special"
  }
];

export default SAMPLE_DATA;

