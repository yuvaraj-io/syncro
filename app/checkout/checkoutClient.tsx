"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  if (!serviceId) return <p className="p-10">Invalid service</p>;

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [monthBookings, setMonthBookings] = useState<Record<string, boolean>>(
    {}
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  /* ---------- MONTH DOTS ---------- */
  useEffect(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1;

    fetch(`/api/calendar?year=${y}&month=${m}&serviceId=${serviceId}`)
      .then((res) => res.json())
      .then(setMonthBookings);
  }, [currentMonth, serviceId]);

  /* ---------- AVAILABLE SLOTS ---------- */
  useEffect(() => {
    if (!selectedDate) return;

    const date = selectedDate.toISOString().split("T")[0];

    fetch(`/api/availability?date=${date}&serviceId=${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
        setSelectedSlot(null);
        setBookingId(null);
      });
  }, [selectedDate, serviceId]);

  /* ---------- SAVE BOOKING ---------- */
  async function saveBooking() {
    if (!selectedDate || selectedSlot === null) return;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        date: selectedDate.toISOString().split("T")[0],
        slot: selectedSlot,
        phone,
        message,
      }),
    });

    const data = await res.json();
    setBookingId(data.id);
    setShowConfirm(true);
  }

  /* ---------- CONFIRM BOOKING ---------- */
  async function confirmBooking() {
    if (!bookingId) return;

    await fetch(`/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });

    alert("Booking confirmed");
    router.push("/");
  }

  /* ---------- CALENDAR ---------- */
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i + 1
    );
    const key = date.toISOString().split("T")[0];

    return {
      date,
      hasBooking: monthBookings[key],
    };
  });

  function isPastDay(date: Date) {
    return date < new Date(today.toDateString());
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Select Date & Time</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* CALENDAR */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
            )}>←</button>

            <h2 className="font-semibold">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button onClick={() => setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
            )}>→</button>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map(({ date, hasBooking }) => {
              const isPast = isPastDay(date);
              const isSelected =
                selectedDate?.toDateString() === date.toDateString();

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => !isPast && setSelectedDate(date)}
                  className={`border p-3 text-center cursor-pointer relative
                    ${isPast ? "text-gray-400" : ""}
                    ${isSelected ? "bg-black text-white" : ""}
                  `}
                >
                  {date.getDate()}

                  {hasBooking && !isPast && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SLOTS */}
        <div>
          <h2 className="font-semibold mb-4">
            {selectedDate ? selectedDate.toDateString() : "Select a date"}
          </h2>

          {selectedDate && (
            <div className="grid grid-cols-2 gap-3">
              {availableSlots.map((slot) => (
                <div
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border p-3 text-center cursor-pointer
                    ${selectedSlot === slot ? "bg-black text-white" : ""}
                  `}
                >
                  {slot}:00 – {slot + 1}:00
                </div>
              ))}
            </div>
          )}

          {selectedSlot !== null && (
            <button
              onClick={saveBooking}
              className="mt-6 bg-black text-white px-6 py-2"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Booking</h2>

            <input
              className="w-full border p-2 mb-3"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
              className="w-full border p-2 mb-4"
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={confirmBooking}
              className="bg-black text-white px-4 py-2 w-full"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
