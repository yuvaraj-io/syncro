
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type CalendarSummary = {
  date: string;
  available_count: number;
  total_count: number;
};

type Slot = {
  id: string;
  hour: number;
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
} | null;

export default function BookPage({ service }: { service: Service }) {
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
      alert(error.message || "Something went wrong");
    }
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-6 mt-8 flex items-center gap-10">
        <Link
          href="/services"
          className="border px-4 py-2 hover:bg-black hover:text-white transition"
        >
          ← Back to Services
        </Link>

         {service && (
          <div className="text-xl text-gray-700 text-right">
            <div className="font-semibold">{service.name}</div>
            <div className="text-xs text-gray-500">
              ₹{service.price} · {service.duration} mins
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT – Calendar */}
        <div>
          <h2 className="text-xl font-bold mb-4">Select Date</h2>

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

            <h3 className="font-semibold">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h3>

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

            {calendarCells.map((dateStr, idx) =>
              !dateStr ? (
                <div key={idx} />
              ) : (
                <button
                  key={dateStr}
                  disabled={isPast(dateStr)}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    border p-2 text-sm relative
                    ${isPast(dateStr) ? "opacity-30 cursor-not-allowed" : ""}
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
              )
            )}
          </div>
        </div>

        {/* RIGHT – Slots */}
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
                      className={`p-3 border text-sm ${
                        selectedSlot === slot.id
                          ? "bg-green-300"
                          : "hover:bg-gray-100"
                      }`}
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
    </>
  );
}
