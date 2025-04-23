'use client'

import { useEffect, useState } from "react";

interface TreeholeHtmlItem {
  html: string;
}

export default function DeviceEmulator(props: { id: Number }) {
  if (props.id === 0) return <div className={"w-200 h-100 border-10 border-gray-500 rounded-lg shadow-md overflow-hidden"}></div>;
  const [htmlList, setHtmlList] = useState<string[]>([]);
  const [currentHtml, setCurrentHtml] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const htmlResponse = await fetch(
          `/api/GetRecordHtml?recordNumber=${props.id}`
        );
        const htmlData = await htmlResponse.json();
        const treeholeHttpResponse= await fetch(
          `/api/GetTreeholeRecord`
        );
        const treeholeHtmlData = await treeholeHttpResponse.json();
        const treeholeHtmlDataList = treeholeHtmlData.map((dic: TreeholeHtmlItem) => {return dic.html;})
        setHtmlList([...htmlData.html.html_list, ...treeholeHtmlDataList]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (htmlList.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      setCurrentHtml(htmlList[i]);
      i = (i + 1) % htmlList.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [htmlList]);

  return (
    <div className="w-200 h-100 border-10 border-gray-500 rounded-lg shadow-md overflow-hidden">
      <div dangerouslySetInnerHTML={{ __html: currentHtml }} />
    </div>
  );
}
