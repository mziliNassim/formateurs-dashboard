import React, { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  List,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [editorState, setEditorState] = useState(value || "");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  // Initialize editor content
  useEffect(() => {
    if (value !== editorState) {
      setEditorState(value);
    }
  }, [value]);

  // Update parent component when editor content changes
  useEffect(() => {
    if (onChange) {
      onChange({ target: { name: "description", value: editorState } });
    }
  }, [editorState, onChange]);

  // Editor commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    // Force update after command execution
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    // Update editor state to trigger re-render
    const editorEl = document.getElementById("rich-text-editor");
    if (editorEl) {
      setEditorState(editorEl.innerHTML);
    }
  };

  const handleFormat = (command) => {
    execCommand(command);
  };

  const handleLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    setLinkText(selectedText);
    setIsLinkDialogOpen(true);
  };

  const insertLink = () => {
    if (linkUrl) {
      execCommand("createLink", linkUrl);
      setIsLinkDialogOpen(false);
      setLinkUrl("");
      setLinkText("");
    }
  };

  const handleImage = () => {
    setIsImageDialogOpen(true);
  };

  const insertImage = () => {
    if (imageUrl) {
      execCommand(
        "insertHTML",
        `<img src="${imageUrl}" alt="${
          imageAlt || "image"
        }" class="max-w-full h-auto rounded my-2" />`
      );
      setIsImageDialogOpen(false);
      setImageUrl("");
      setImageAlt("");
    }
  };

  const handleHeading = (level) => {
    execCommand("formatBlock", `<h${level}>`);
  };

  // Toolbar button component
  const ToolbarButton = ({ icon, action, isActive, title }) => (
    <button
      type="button"
      onClick={action}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        isActive
          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          : "text-gray-600 dark:text-gray-400"
      }`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 gap-1">
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <ToolbarButton
            icon={<Bold className="w-5 h-5" />}
            action={() => handleFormat("bold")}
            title="Gras"
          />
          <ToolbarButton
            icon={<Italic className="w-5 h-5" />}
            action={() => handleFormat("italic")}
            title="Italique"
          />
          <ToolbarButton
            icon={<Underline className="w-5 h-5" />}
            action={() => handleFormat("underline")}
            title="Souligné"
          />
        </div>

        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <ToolbarButton
            icon={<AlignLeft className="w-5 h-5" />}
            action={() => handleFormat("justifyLeft")}
            title="Aligner à gauche"
          />
          <ToolbarButton
            icon={<AlignCenter className="w-5 h-5" />}
            action={() => handleFormat("justifyCenter")}
            title="Centrer"
          />
          <ToolbarButton
            icon={<AlignRight className="w-5 h-5" />}
            action={() => handleFormat("justifyRight")}
            title="Aligner à droite"
          />
        </div>

        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <ToolbarButton
            icon={<ListOrdered className="w-5 h-5" />}
            action={() => handleFormat("insertOrderedList")}
            title="Liste numérotée"
          />
          <ToolbarButton
            icon={<List className="w-5 h-5" />}
            action={() => handleFormat("insertUnorderedList")}
            title="Liste à puces"
          />
        </div>

        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <ToolbarButton
            icon={<Heading1 className="w-5 h-5" />}
            action={() => handleHeading(1)}
            title="Titre 1"
          />
          <ToolbarButton
            icon={<Heading2 className="w-5 h-5" />}
            action={() => handleHeading(2)}
            title="Titre 2"
          />
          <ToolbarButton
            icon={<Heading3 className="w-5 h-5" />}
            action={() => handleHeading(3)}
            title="Titre 3"
          />
        </div>

        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <ToolbarButton
            icon={<Link className="w-5 h-5" />}
            action={handleLink}
            title="Insérer un lien"
          />
          <ToolbarButton
            icon={<Image className="w-5 h-5" />}
            action={handleImage}
            title="Insérer une image"
          />
          <ToolbarButton
            icon={<Code className="w-5 h-5" />}
            action={() => execCommand("formatBlock", "<pre>")}
            title="Code"
          />
          <ToolbarButton
            icon={<Quote className="w-5 h-5" />}
            action={() => execCommand("formatBlock", "<blockquote>")}
            title="Citation"
          />
        </div>

        <div className="flex">
          <ToolbarButton
            icon={<Undo className="w-5 h-5" />}
            action={() => execCommand("undo")}
            title="Annuler"
          />
          <ToolbarButton
            icon={<Redo className="w-5 h-5" />}
            action={() => execCommand("redo")}
            title="Rétablir"
          />
        </div>
      </div>

      {/* Editor */}
      <div
        id="rich-text-editor"
        contentEditable="true"
        className="w-full p-4 min-h-[200px] max-h-[600px] overflow-y-auto focus:outline-none dark:bg-gray-700 dark:text-white"
        dangerouslySetInnerHTML={{ __html: editorState }}
        onInput={(e) => setEditorState(e.currentTarget.innerHTML)}
        placeholder={placeholder}
      />

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Insérer un lien
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Texte du lien
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Texte à afficher"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsLinkDialogOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  onClick={insertLink}
                >
                  Insérer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {isImageDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Insérer une image
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL de l'image
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Texte alternatif
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Description de l'image"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsImageDialogOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  onClick={insertImage}
                >
                  Insérer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RichTextEditorDemo = ({ courseData, setCourseData }) => {

  const handleChange = (e) => {
    setCourseData({ ...courseData, description: e.target.value });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description *
      </label>
      <RichTextEditor
        value={courseData.description}
        onChange={(e) => handleChange(e)}
        placeholder="Décrivez le contenu et les objectifs de ce cours..."
      />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Une bonne description aide les étudiants à comprendre ce qu'ils vont
        apprendre
      </p>
    </div>
  );
};
export default RichTextEditorDemo;
