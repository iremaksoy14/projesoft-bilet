// src/components/Select.tsx
"use client";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

export type Option<T extends string> = { label: string; value: T };

export default function Select<T extends string>({
  value, // "M" | "F" | null | undefined
  onChange,
  options,
  placeholder = "Seçin",
}: {
  value?: T | null;
  onChange: (v: T) => void;
  options: Option<T>[];
  placeholder?: string;
}) {
  // Her zaman kontrollü: seçili option objesi ya da null
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <Listbox
      value={selected} // ✔️ option objesi (veya null)
      onChange={(opt: Option<T> | null) => {
        // opt asla undefined olmaz
        if (opt) onChange(opt.value);
      }}
    >
      <div className="relative">
        <Listbox.Button
          className="relative w-full h-11 cursor-default rounded-lg border border-gray-300 bg-white
                     py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span className="block truncate">
            {selected?.label ?? placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg
                                     bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt} // ✔️ option objesi
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-indigo-50 text-indigo-700" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
