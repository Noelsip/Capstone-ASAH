import React from "react";

function StatCard({ title, value, unit, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-6 border border-gray-100 max-w-xs w-full mx-auto min-h-[140px]">
      <div className="text-4xl mb-2 text-primary">{Icon && <Icon />}</div>
      <div className="text-sm text-gray-500 mb-1 text-center">{title}</div>
      <div
        className="text-3xl font-bold text-gray-800 truncate text-center w-full"
        title={typeof value === "number" ? value : ""}
      >
        {typeof value === "number"
          ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
          : value}
        {unit && (
          <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
        )}
      </div>
    </div>
  );
}

export default StatCard;