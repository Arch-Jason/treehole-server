"use client"

import React, { useState, useRef, useEffect } from "react";
import { EditorState } from 'draft-js';
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import createImagePlugin from "@draft-js-plugins/image";
import { stateToHTML } from "draft-js-export-html";
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import { LucidePlusCircle, LucideMinusCircle, LucideImage } from "lucide-react";

import '../new/style.css'

// 初始化插件
const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const imagePlugin = createImagePlugin();
const plugins = [staticToolbarPlugin, imagePlugin];

import {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
} from '@draft-js-plugins/buttons';

interface EditorData {
  id: number;
  editorState: EditorState;
  placeholder: string;
}

export default function TreeHoleSubmit() {
  const [editor, setEditor] = useState<EditorData>({
    id: Date.now(),
    editorState: createEditorStateWithText(""),
    placeholder: "请输入树洞内容...",
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateEditorState = (newState: any) => {
    setEditor((prev) => ({
      ...prev,
      editorState: newState,
    }));
  };

  const handleFileUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newEditorState = imagePlugin.addImage(
        editor.editorState,
        reader.result as string
      );
      setEditor((prev) => ({
        ...prev,
        editorState: newEditorState,
      }));
      if (fileInputRef.current) fileInputRef.current.value = ''; // 清空文件输入
    };
    reader.readAsDataURL(file);
  };

  const submitAll = async () => {
    const htmlList = [stateToHTML(editor.editorState.getCurrentContent())];
    try {
      const response = await fetch("/api/TreeholeAddRecord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlList, isAnonymous, name }),
      });
      if (response.ok) {
        alert("提交成功！");
      } else {
        alert("提交失败！");
      }
    } catch (error) {
      console.error("提交错误:", error);
      alert("提交时出错");
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="请输入名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isAnonymous}
            className="p-2 border rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
            />
            <span>匿名发布</span>
          </label>
        </div>

        <div className="relative group bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <Toolbar>
              {(externalProps) => (
                <div className="flex flex-row items-center gap-2 mb-2">
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <div
                    className="flex items-center justify-center px-2 py-1 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <LucideImage size={18} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </div>
                </div>
              )}
            </Toolbar>

            <Editor
              editorState={editor.editorState}
              onChange={updateEditorState}
              placeholder={editor.placeholder}
              plugins={plugins}
            />
          </div>
        </div>
      </div>

      <button
        onClick={submitAll}
        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        提交
      </button>
    </div>
  );
}
