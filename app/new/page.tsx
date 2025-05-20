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

import './style.css'

// 初始化插件
const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const imagePlugin = createImagePlugin();
const plugins = [staticToolbarPlugin, imagePlugin];

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import SideNav from "../components/sideNav";

interface EditorData {
  id: number;
  editorState: EditorState;
  placeholder: string;
}

export default function CreateNew() {
  const [editors, setEditors] = useState<EditorData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 默认编辑器初始化
  useEffect(() => {
    const initialEditor = {
      id: Date.now(),
      editorState: createEditorStateWithText(""),
      placeholder: "",
    };
    setEditors([initialEditor]);
  }, []);

  // 处理文件上传
  const handleFileUpload = (editorId: number) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditors(prev => prev.map(editor => {
        if (editor.id === editorId) {
          // 使用 imagePlugin 插入图片
          const newEditorState = imagePlugin.addImage(editor.editorState, reader.result as string, {});
          return { ...editor, editorState: newEditorState };
        }
        return editor;
      }));
      if (fileInputRef.current) fileInputRef.current.value = ''; // 清空文件输入
    };
    reader.readAsDataURL(file);
  };

  // 添加编辑器
  const addEditor = () => {
    const newEditor = {
      id: Date.now(),
      editorState: createEditorStateWithText(""),
      placeholder: "",
    };
    setEditors((prev) => [...prev, newEditor]);
  };

  // 移除编辑器
  const removeEditor = (id: number) => {
    if (editors.length > 1) {
      setEditors((prev) => prev.filter((editor) => editor.id !== id));
    }
  };

  // 更新编辑器状态
  const updateEditorState = (id: number, newState: any) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === id ? { ...editor, editorState: newState } : editor
      )
    );
  };

  const submitAll = async () => {
    const htmlList = editors.map((editor) =>
      stateToHTML(editor.editorState.getCurrentContent())
    );
    try {
      console.log(htmlList);
      const response = await fetch("/api/AddRecord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlList }),
      });
      alert("提交成功！");
    } catch (error) {
      console.error("提交错误:", error);
      alert("提交时出错");
    }
  };

return (
  <div className="w-screen flex flex-row">
  <SideNav />
  <div className="p-4 bg-gray-50 rounded-lg shadow-md w-full">
    <div className="flex flex-col space-y-4">
      <button
        onClick={addEditor}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <LucidePlusCircle size={18} /> 增加显示页面
      </button>

      {editors.map((editor) => (
        <div key={editor.id} className="relative group bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={() => removeEditor(editor.id)}
            disabled={editors.length <= 1}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
          >
            <LucideMinusCircle size={18} />
          </button>

          <div className="mb-4">
            <Toolbar>
              {(externalProps) => (
                <div className="flex flex-row items-center gap-2 mb-2">
                  <BoldButton
                    {...externalProps}
                  />
                  <ItalicButton
                    {...externalProps}
                  />
                  <UnderlineButton
                    {...externalProps}
                  />
                  <CodeButton
                    {...externalProps}
                  />
                  <HeadlineOneButton
                    {...externalProps}
                  />
                  <HeadlineTwoButton
                    {...externalProps}
                  />
                  <HeadlineThreeButton
                    {...externalProps}
                  />
                  <UnorderedListButton
                    {...externalProps}
                  />
                  <OrderedListButton
                    {...externalProps}
                  />
                  <BlockquoteButton
                    {...externalProps}
                  />
                  <CodeBlockButton
                    {...externalProps}
                  />
                  <div
                    className="flex items-center justify-center px-2 py-1 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <LucideImage size={18} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={() => handleFileUpload(editor.id)}
                      accept="image/*"
                    />
                  </div>
                </div>
              )}
            </Toolbar>

            <Editor
              editorState={editor.editorState}
              onChange={(newState) => updateEditorState(editor.id, newState)}
              placeholder={editor.placeholder}
              plugins={plugins}
            />
          </div>
        </div>
      ))}
    </div>
    
    <button
      onClick={submitAll}
      className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
    >
      提交
    </button>
  </div>
  </div>
);
}
