"use client"

import { useEffect, useState } from "react";
import DeviceEmulator from "../components/deviceEmulator";
import clsx from "clsx";
import SideNav from "../components/sideNav";

export default function HistoryList() {
  const [recordList, setRecordList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRecord, setCurrentRecord] = useState<number>(0);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const recordRepsonse = await fetch("/api/GetRecords");
        const recordData = await recordRepsonse.json();
        setRecordList(recordData);
      };
      fetchData();
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <div>加载中…</div>;

  if (!isLoading && recordList.length === 0) return <div>无历史记录</div>;

  return (
    <div className="w-screen flex flex-row">
    <SideNav />
    <div className="flex gap-6 h-screen w-full">
      <div className="w-100 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
        <div className="text-2xl font-semibold text-gray-800 mb-4">
          历史记录
        </div>
        {recordList.map(({ id, timestamp }) => (
          <div
            key={id}
            data-id={id}
            onClick={(e) => {
              console.log(e.currentTarget.dataset.id);
              setCurrentRecord(Number(e.currentTarget.dataset.id));
            }}
            className={clsx("flex items-center justify-between p-3 mb-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-sky-100 transition-colors", {"bg-sky-100": id === currentRecord})}
          >
            <span className="text-lg font-medium text-gray-700">{id}</span>
            <span className="text-sm text-gray-500">
              {new Date(timestamp)
                .toLocaleDateString("zh-CN")}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full flex bg-white rounded-lg shadow-lg p-4 items-center justify-center">
        <div className="border-4 border-gray-300 rounded-lg shadow-md overflow-hidden bg-gray-100">
          <DeviceEmulator key={currentRecord} id={Number(currentRecord)} />
        </div>
      </div>
    </div>
    </div>
  );
}
