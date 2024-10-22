import express from "express";
const app = express();
const PORT = 8000;
app.use(express.json());

const rooms = [
  {
    roomId: "1",
    roomName: "Room A",
    seats: "20",
    amenities: ["Projector", "Whiteboard"],
    pricePerHour: 100,
  },
  {
    roomId: "2",
    roomName: "Room B",
    seats: "40",
    amenities: ["Projector", "Video Conferencing", "Whiteboard"],
    pricePerHour: 200,
  },
];

const bookings = [
  {
    bookingId: "100",
    customerName: "Paul",
    date: "2024-10-22",
    startTime: "10.00 AM",
    endTime: "12:00 PM",
    roomId: "1",
    bookingDate: "2024-10-22T14:30:00Z",
    bookingStatus: "confirmed",
  },

  {
    bookingId: "101",
    customerName: "Balu",
    date: "2024-10-19",
    startTime: "11.00 AM",
    endTime: "04.00 PM",
    roomId: "2",
    bookingDate: "2024-10-19T15:15:00Z",
    bookingStatus: "confirmed",
  },
  {
    bookingId: "102",
    customerName: "Priya",
    date: "2024-10-10",
    startTime: "11.00 AM",
    endTime: "04.00 PM",
    roomId: "2",
    bookingDate: "2024-10-10T15:15:00Z",
    bookingStatus: "confirmed",
  },
  {
    bookingId: "103",
    customerName: "Paul",
    date: "2023-11-22",
    startTime: "10.00 AM",
    endTime: "12:00 PM",
    roomId: "1",
    bookingDate: "2023-11-22T14:30:00Z",
    bookingStatus: "confirmed",
  },
];

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/rooms", (req, res) => {
  res.send(rooms);
});
//creating a room
app.post("/createRoom", (req, res) => {
  const newRoom = req.body;
  rooms.push(newRoom);
  res.status(201).json({ message: "room created successfully", newRoom });
});

//booking a room
app.post("/bookRoom", (req, res) => {
  const newBooking = req.body;
  const { roomId, date, startTime, endTime } = newBooking;
  const room = rooms.find((r) => r.roomId === newBooking.roomId);
  if (!room) {
    return res.status(404).json({ error: "room not found" });
  }
  const isOverlapping = bookings.some((booking) => {
    return (
      booking.roomId === roomId &&
      booking.date === date &&
      startTime < booking.endTime &&
      endTime > booking.startTime
    );
  });

  if (isOverlapping) {
    return res
      .status(400)
      .json({ error: "Room is already booked for this date and time" });
  }

  bookings.push(newBooking);
  console.log(bookings);
  res.status(201).json({ message: "room booked successfully", newBooking });
});

//listing booked rooms
app.get("/listBookedRooms", (req, res) => {
  const result = rooms.map((room) => {
    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.roomId
    );
    return {
      roomName: room.roomName,
      bookedStatus: roomBookings.length > 0,
      customerName: roomBookings.map((booking) => booking.customerName),
      date: roomBookings.map((booking) => booking.date),
      startTime: roomBookings.map((booking) => booking.startTime),
      endTime: roomBookings.map((booking) => booking.endTime),
    };
  });
  res.send(result);
});

//list all customers with booked data
app.get("/listCustomers", (req, res) => {
  const result = bookings.map((booking) => {
    const room = rooms.find((r) => r.roomId === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room.roomName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.send(result);
});

//listing number of times a customer has booked a room
app.get("/customerHistory/:customerName", (req, res) => {
  const { customerName } = req.params;
  const result = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => {
      const room = rooms.find((r) => r.roomId === booking.roomId);
      return {
        customerName: booking.customerName,
        roomName: room.roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.bookingId,
        bookingDate: booking.bookingDate,
        bookingStatus: booking.bookingStatus,
      };
    });
  res.send(result);
});

app.listen(PORT, () => console.log("server started on port", PORT));
