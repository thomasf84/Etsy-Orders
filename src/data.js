const STATUS_RECEIVED = { id: 1, name: "Received", color: "blue.300" };
const STATUS_CUT = {id: 2, name: "Cut", color: "yellow.400",};
const STATUS_LASER = { id: 3, name: "Lasered", color: "pink.300" };
const STATUS_STAINED = { id: 4, name: "Stained", color: "green.300" };
const STATUS_PAINT = { id: 5, name: "Painted", color: "teal.300" };
const STATUS_LACQUERED = { id: 7, name: "Lacquered", color: "orange.300" };
const STATUS_READY = { id: 6, name: "Ready", color: "purple.400" };
const STATUS_SHIPPED = { id: 8, name: "Shipped", color: "blue.500" };
const STATUS_CANCELED = { id: 9, name: "Canceled", color: "red.500" };

export const STATUSES = [
  STATUS_RECEIVED,
  STATUS_CUT,
  STATUS_LASER,
  STATUS_STAINED,
  STATUS_PAINT,
  STATUS_LACQUERED,
  STATUS_READY,
  STATUS_SHIPPED,
  STATUS_CANCELED,
];

const SIZE_8 = { id: 0, name: "8", color: "purple.300" };
const SIZE_15 = { id: 1, name: "15", color: "blue.300" };
const SIZE_16 = {id: 2, name: "16", color: "yellow.400",};
const SIZE_18 = { id: 3, name: "18", color: "pink.300" };
const SIZE_24 = { id: 4, name: "24", color: "green.300" };
const SIZE_OTHER = { id: 5, name: "Other", color: "gray.400" };

export const SIZES = [
  SIZE_8,
  SIZE_15,
  SIZE_16,
  SIZE_18,
  SIZE_24,
  SIZE_OTHER
];

