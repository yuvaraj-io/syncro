"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CalendarSummary = {
  date: string; // YYYY-MM-DD
  available_count: number;
  total_count: number;
};

type Slot = {
  hour: number;
  id?: string;
  status?: "AVAILABLE" | "BOOKED";
  checked: boolean;
};

export default function AdminCalendarPage() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [calendarData, setCalendarData] = useState<CalendarSummary[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  // batch tracking
  const addedSlots = useMemo(() => new Set<number>(), []);
  const removedSlotIds = useMemo(() => new Set<string>(), []);

  // ------------------------
  // Fetch calendar summary
  // ------------------------
  useEffect(() => {
  fetch("/api/admin/bookings/calendar-summary")
    .then(res => res.json())
    .then(data => {
      debugger
      if (Array.isArray(data)) {
        setCalendarData(data);
      } else {
        console.error("Calendar summary API returned:", data);
        setCalendarData([]);
      }
    });
}, []);

  // ------------------------
  // Fetch slots for date
  // ------------------------
  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);

      const res = await fetch(
        `/api/admin/bookings?date=${selectedDate}`
      );
      const data = await res.json();

      const map = new Map<number, Slot>();
      for (let h = 0; h < 24; h++) {
        map.set(h, { hour: h, checked: false });
      }

      data?.forEach((b: any) => {
        map.set(b.hour, {
          hour: b.hour,
          id: b.id,
          status: b.status,
          checked: b.status === "AVAILABLE",
        });
      });

      setSlots(Array.from(map.values()));
      setLoading(false);
    }

    fetchSlots();
  }, [selectedDate]);

  // ------------------------
  // Toggle slot
  // ------------------------
  function toggleSlot(slot: Slot) {
    if (slot.status === "BOOKED") return;

    setSlots(prev =>
      prev.map(s => {
        if (s.hour !== slot.hour) return s;

        if (s.checked) {
          if (s.id) removedSlotIds.add(s.id);
          return { ...s, checked: false };
        } else {
          addedSlots.add(s.hour);
          return { ...s, checked: true };
        }
      })
    );
  }

  // ------------------------
  // Save batch
  // ------------------------
  async function handleSave() {
    setLoading(true);

    await Promise.all([
      ...Array.from(addedSlots).map(hour =>
        fetch("/api/admin/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDate, hour }),
        })
      ),
      ...Array.from(removedSlotIds).map(id =>
        fetch(`/api/admin/bookings/${id}`, { method: "DELETE" })
      ),
    ]);

    addedSlots.clear();
    removedSlotIds.clear();

    alert("Slots saved");
    setSelectedDate(selectedDate);
  }

  // ------------------------
  // Calendar helpers
  // ------------------------
  function getIndicator(dateStr: string) {
    const entry = calendarData.find(d => {
      return d.date === dateStr
    });
    if (!entry) return "";

    if (entry.available_count > 0) return "bg-green-500";
    if (entry.total_count > 0) return "bg-purple-500";
    return "";
  }

  function isPast(dateStr: string) {
    return dateStr < todayStr;
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
  ).getDay(); // 0 = Sun

  const calendarCells = [];

  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const dateStr = date.toISOString().split("T")[0];
    calendarCells.push(dateStr);
  }

  // ------------------------
  // Render
  // ------------------------
  return (
    <>
     <div className="flex p-10 gap-10 items-center mb-8">
         <Link href="/admin" className=" border p-3 hover:underline">
          Dashboard
        </Link>
        <div className="text-3xl font-bold">Admin Calandar</div>
      </div>
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT: Monthly Calendar */}
      
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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="font-semibold text-sm">
              {d}
            </div>
          ))}

          {calendarCells.map((dateStr, idx) => {
            if (!dateStr)
              return <div key={idx} />;

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

      {/* RIGHT: Slot Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Slots for {selectedDate}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {slots.map(slot => (
                <label
                  key={slot.hour}
                  className={`p-2 border flex items-center gap-2
                    ${
                      slot.status === "BOOKED"
                        ? "bg-blue-300 cursor-not-allowed"
                        : slot.checked
                        ? "bg-green-300"
                        : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={slot.checked}
                    disabled={slot.status === "BOOKED"}
                    onChange={() => toggleSlot(slot)}
                  />
                  {slot.hour}:00 – {slot.hour + 1}:00
                </label>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="mt-6 px-6 py-2 border bg-black text-white hover:bg-white hover:text-black"
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
    </>
    
  );
}
