"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AvailabilitySlot = {
  slot: number;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [monthAvailability, setMonthAvailability] = useState<Record<string, boolean>>({});
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);

  /* ---------------- FETCH MONTH DATA ---------------- */
  useEffect(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1;

    fetch(`/api/availability/month?year=${y}&month=${m}`)
      .then((res) => res.json())
      .then(setMonthAvailability);
  }, [currentMonth]);

  /* ---------------- FETCH DAY DATA ---------------- */
  useEffect(() => {
    if (!selectedDate) return;

    const date = selectedDate.toISOString().split("T")[0];

    fetch(`/api/availability?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
        setSelectedSlots([]);
      });
  }, [selectedDate]);

  /* ---------------- HELPERS ---------------- */
  function isPastDay(date: Date) {
    return date < new Date(today.toDateString());
  }

  function slotStatus(slot: number) {
    if (!selectedDate) return "AVAILABLE";

    const slotTime = new Date(selectedDate);
    slotTime.setHours(slot, 0, 0, 0);

    if (
      isPastDay(selectedDate) ||
      (selectedDate.toDateString() === today.toDateString() && slotTime < today)
    ) {
      return "PAST";
    }

    if (availableSlots.some((s) => s.slot === slot)) {
      return "AVAILABLE";
    }

    return "AVAILABLE";
  }

  function toggleSlot(slot: number) {
    setSelectedSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  }

  async function saveAvailability() {
    if (!selectedDate || selectedSlots.length === 0) return;

    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate.toISOString().split("T")[0],
        slots: selectedSlots,
      }),
    });

    alert("Availability saved");
    
    // Refresh month data
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1;
    fetch(`/api/availability/month?year=${y}&month=${m}`)
      .then((res) => res.json())
      .then(setMonthAvailability);
      
    // Refresh day data
    const date = selectedDate.toISOString().split("T")[0];
    fetch(`/api/availability?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
        setSelectedSlots([]);
      });
      
    setSelectedDate(null);
  }

  /* ---------------- CALENDAR GRID ---------------- */
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
      hasAvailability: monthAvailability[key],
    };
  });

  return (
    <div className="p-10 max-w-4xl mx-auto">
        <Link
          href="/admin  "
          className="border border-black p-2 hover:bg-black hover:text-white transition mb-6"
        >
            <span className="font-bold">Admin Dashboard</span>
        </Link>
       
        <h2 className="text-3xl font-bold mb-8 pt-5">Admin Calendar</h2>
      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center mb-6">
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
        >
          ←
        </button>

        <h1 className="text-xl font-bold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>

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
        >
          →
        </button>
      </div>

      {/* ---------------- DAYS GRID ---------------- */}
      <div className="grid grid-cols-7 gap-3">
        {days.map(({ date, hasAvailability }) => {
          const isPast = isPastDay(date);

          return (
            <div
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`border p-3 cursor-pointer text-center relative
                ${isPast ? "text-gray-400" : ""}
              `}
            >
              {date.getDate()}

              {/* DOT */}
              {isPast && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full" />
              )}

              {hasAvailability && !isPast && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 w-full max-w-md h-[400px] overflow-y-scroll">
            <h2 className="text-lg font-bold mb-s">
              {selectedDate.toDateString()}
            </h2>

            {isPastDay(selectedDate) ? (
              <div className="mt-4">
                <p className="font-semibold mb-2">Availability</p>
                {availableSlots.map((s) => (
                  <p key={s.slot}>
                    {s.slot}:00 – {s.slot + 1}:00
                  </p>
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {HOURS.map((slot) => {
                  const status = slotStatus(slot);

                  return (
                    <label
                      key={slot}
                      className={`flex items-center gap-2 p-2 border
                        ${
                          status === "PAST"
                            ? "text-gray-400"
                            : status === "AVAILABLE"
                            ? ""
                            : ""
                        }
                      `}
                    >
                      {status === "AVAILABLE" && (
                        <input
                          type="checkbox"
                          checked={selectedSlots.includes(slot)}
                          onChange={() => toggleSlot(slot)}
                        />
                      )}
                      {slot}:00 – {slot + 1}:00
                    </label>
                  );
                })}

                <button
                  onClick={saveAvailability}
                  disabled={selectedSlots.length === 0}
                  className="mt-4 bg-black text-white px-4 py-2 disabled:opacity-50"
                >
                  Save Availability
                </button>
              </div>
            )}

            <button
              className="mt-4 text-sm underline"
              onClick={() => setSelectedDate(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
