'use client'

import { useState, useEffect } from "react";
import DeviceEmulator from "./deviceEmulator";

export default function Overview() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countResponse = await fetch("/api/GetRecordCount");
        const countData = await countResponse.json();
        setCount(countData.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6">
      <div className="text-xl font-semibold text-gray-800">历史记录数量</div>
      <div className="text-4xl font-bold text-blue-600">
        {count === null ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>加载中……</span>
          </div>
        ) : (
          count
        )}
      </div>
      <DeviceEmulator key={count} id={count === null ? 0 : count} />
    </div>
  );
}
