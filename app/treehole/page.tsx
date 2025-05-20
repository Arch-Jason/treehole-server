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
import { LucideImage } from "lucide-react";
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

import "./style.css";

const imagePlugin = createImagePlugin();

interface EditorData {
  id: number;
  editorState: EditorState;
  placeholder: string;
}

export default function TreeHoleSubmit() {
  const [hasMounted, setHasMounted] = useState(false);
  const [editor, setEditor] = useState<EditorData | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Plugin states
  const [plugins, setPlugins] = useState<any[]>([]);
  const [ToolbarComponent, setToolbarComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Client-side only initialization
    setHasMounted(true);
    
    // Initialize plugins
    const staticToolbarPlugin = createToolbarPlugin();
    const { Toolbar } = staticToolbarPlugin;
    
    setPlugins([staticToolbarPlugin, imagePlugin]);
    setToolbarComponent(() => Toolbar);
    
    // Initialize editor state
    setEditor({
      id: Date.now(),
      editorState: createEditorStateWithText(""),
      placeholder: ""
    });
  }, []);

  const updateEditorState = (newState: EditorState) => {
    setEditor((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        editorState: newState,
      };
    });
  };

  const handleFileUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newEditorState = imagePlugin.addImage(
        editor.editorState,
        reader.result as string,
        {}
      );
      setEditor((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          editorState: newEditorState,
        };
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const submitAll = async () => {
    if (!editor) return;

    setIsSubmitting(true);

    const htmlList = [stateToHTML(editor.editorState.getCurrentContent())];
    try {
      const response = await fetch("/api/TreeholeAddRecord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlList, isAnonymous, name }),
      });
      
      if (response.ok) {
        alert("提交成功！");
        // Reset form
        setEditor({
          id: Date.now(),
          editorState: createEditorStateWithText(""),
          placeholder: "请输入树洞内容...",
        });
        setName("");
        setIsAnonymous(false);
      } else {
        alert("提交失败！");
      }
    } catch (error) {
      console.error("提交错误:", error);
      alert("提交时出错");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent server-side rendering of editor content
  if (!hasMounted || !editor || !ToolbarComponent) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="请输入名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isAnonymous}
            className="p-2 border rounded w-full max-w-[200px]"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className="w-4 h-4"
            />
            <span className="text-sm">匿名发布</span>
          </label>
        </div>

        <div className="relative group bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <ToolbarComponent>
              {(externalProps: any) => (
                <div className="flex flex-row items-center gap-2 mb-2 flex-wrap">
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
            </ToolbarComponent>

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
        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            正在提交...服务器很慢，请耐心
          </>
        ) : (
          "提交"
        )}
      </button>
    </div>
  );
}
