"use client";
import { Popover, Transition, Portal } from "@headlessui/react";
import { Fragment, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DatePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (d: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover className="relative" as="div">
      <Popover.Button
        onClick={() => setOpen((v) => !v)}
        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-left
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {value ? (
          value.toLocaleDateString()
        ) : (
          <span className="text-gray-500">gg.aa.yyyy</span>
        )}
      </Popover.Button>

      <Portal>
        <Transition
          as={Fragment}
          show={open}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="fixed z-50 w-[320px] rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5"
            style={{
              right: `calc(100vw - ${(() => {
                const el = document.activeElement as HTMLElement | null;
                const rect = el?.getBoundingClientRect();
                return rect ? `${Math.round(rect.right)}px` : "0px";
              })()})`,
              top: `${(() => {
                const el = document.activeElement as HTMLElement | null;
                const rect = el?.getBoundingClientRect();
                return rect ? `${Math.round(rect.top) - 8}px` : 0;
              })()}`,
              transform: "translateY(-100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(d) => {
                if (d) {
                  onChange(d);
                  setOpen(false);
                }
              }}
              captionLayout="dropdown"
              fromYear={1950}
              toYear={2025}
            />
          </Popover.Panel>
        </Transition>
      </Portal>
    </Popover>
  );
}
