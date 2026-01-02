"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type CalendarSummary = {
  date: string;
  available_count: number;
  total_count: number;
};

type Slot = {
  id: string;
  hour: number;
};

export default function BookPage() {
  const router = useRouter();
  const params = useSearchParams();
  const serviceId = params.get("serviceId");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [calendarData, setCalendarData] = useState<CalendarSummary[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // ------------------------
  // Fetch calendar summary
  // ------------------------
  useEffect(() => {
    fetch("/api/bookings/calendar-summary")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setCalendarData(data) : []);
  }, []);

  // ------------------------
  // Fetch AVAILABLE slots
  // ------------------------
  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedSlot(null);

      const res = await fetch(
        `/api/bookings/available?date=${selectedDate}`
      );
      const data = await res.json();

      setSlots(
        Array.isArray(data)
          ? data.map((s: any) => ({ id: s.id, hour: s.hour }))
          : []
      );

      setLoadingSlots(false);
    }

    fetchSlots();
  }, [selectedDate]);

  // ------------------------
  // Calendar helpers
  // ------------------------
  function isPast(dateStr: string) {
    return dateStr < todayStr;
  }

  function getIndicator(dateStr: string) {
    const entry = calendarData.find(d => d.date === dateStr);
    if (!entry) return "";
    if (entry.available_count > 0) return "bg-green-500";
    if (entry.total_count > 0) return "bg-purple-500";
    return "";
  }

  // ------------------------
  // Build month grid
  // ------------------------
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const calendarCells: (string | null)[] = [];

  for (let i = 0; i < startDay; i++) calendarCells.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      d
    );
    calendarCells.push(date.toISOString().split("T")[0]);
  }

  // ------------------------
  // Confirm booking
  // ------------------------
 async function confirmBooking() {
  if (!selectedSlot || !serviceId) return;

  try {
    const res = await fetch("/api/bookings/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: selectedSlot,
        serviceId,
        message: "https://meet.google.com/abs-vxjx-mwd",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Booking failed");
    }

    router.push("/my-bookings");
  } catch (error: any) {
    console.error("Booking error:", error);
    alert(error.message || "Something went wrong while booking");
  }
}

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT – Calendar */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
            className="border px-3 py-1"
          >
            ←
          </button>

          <h2 className="font-bold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
            className="border px-3 py-1"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="font-semibold text-sm">{d}</div>
          ))}

          {calendarCells.map((dateStr, idx) => {
            if (!dateStr) return <div key={idx} />;

            const disabled = isPast(dateStr);

            return (
              <button
                key={dateStr}
                disabled={disabled}
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  border p-2 text-sm relative
                  ${disabled ? "opacity-30 cursor-not-allowed" : ""}
                  ${selectedDate === dateStr ? "ring-2 ring-black" : ""}
                `}
              >
                {dateStr.split("-")[2]}
                <span
                  className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${getIndicator(
                    dateStr
                  )}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT – Available Slots */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Available slots for {selectedDate}
        </h2>

        {loadingSlots ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {slots.length === 0 ? (
                <p className="col-span-2 text-gray-500">
                  No available slots
                </p>
              ) : (
                slots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`
                      p-3 border text-sm
                      ${selectedSlot === slot.id ? "bg-green-300" : ""}
                    `}
                  >
                    {slot.hour}:00 – {slot.hour + 1}:00
                  </button>
                ))
              )}
            </div>

            <button
              disabled={!selectedSlot}
              onClick={confirmBooking}
              className="mt-6 px-6 py-2 bg-black text-white disabled:opacity-40"
            >
              Confirm Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
}
