import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  Code2,
  Image as ImageIcon,
  Quote,
  Paperclip,
  ImagePlus,
  Table2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Code,
  Maximize2,
  FunctionSquare,
  Video
} from "lucide-react";

const RichTextEditor = React.forwardRef(({ value, onChange, error, placeholder, rows = 18 }, ref) => {
  const toolbarButtons = [
    {
      icon: <Sparkles className="h-4 w-4" />,
      label: "Write with AI",
      variant: "outline",
      className: "mr-2",
      onClick: () => console.log("AI writing assistant coming soon")
    }
  ];

  const formatButtons = [
    { icon: <Bold className="h-4 w-4" />, label: "Bold" },
    { icon: <Italic className="h-4 w-4" />, label: "Italic" },
    { icon: <Underline className="h-4 w-4" />, label: "Underline" },
  ];

  const listButtons = [
    { icon: <List className="h-4 w-4" />, label: "Bullet List" },
    { icon: <ListOrdered className="h-4 w-4" />, label: "Numbered List" },
  ];

  const indentButtons = [
    { icon: <ChevronDown className="h-4 w-4" />, label: "Decrease Indent" },
    { icon: <ChevronUp className="h-4 w-4" />, label: "Increase Indent" },
  ];

  const mediaButtons = [
    { icon: <Link2 className="h-4 w-4" />, label: "Insert Link" },
    { icon: <ImageIcon className="h-4 w-4" />, label: "Insert Image" },
    { icon: <Video className="h-4 w-4" />, label: "Insert Video" },
    { icon: <Table2 className="h-4 w-4" />, label: "Insert Table" },
    { icon: <Paperclip className="h-4 w-4" />, label: "Attach File" },
    { icon: <FunctionSquare className="h-4 w-4" />, label: "Insert Math" },
    { icon: <Code className="h-4 w-4" />, label: "Code Block" },
    { icon: <Maximize2 className="h-4 w-4" />, label: "Fullscreen" },
  ];

  return (
    <div className="w-full">
      <div className="border rounded-t-lg bg-white">
        <div className="flex items-center p-2 border-b">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || "ghost"}
              size="sm"
              className={button.className}
              onClick={button.onClick}
            >
              {button.icon}
              <span className="ml-2">{button.label}</span>
            </Button>
          ))}

          <Separator orientation="vertical" className="mx-2 h-6" />

          <select className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option value="paragraph">¶</option>
            <option value="heading1">H1</option>
            <option value="heading2">H2</option>
          </select>

          <select className="h-8 ml-2 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option value="arial">Arial</option>
            <option value="times">Times</option>
            <option value="courier">Courier</option>
          </select>

          <Separator orientation="vertical" className="mx-2 h-6" />

          <div className="flex gap-1">
            {formatButtons.map((button, index) => (
              <Button key={index} variant="ghost" size="sm" className="px-2">
                {button.icon}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="mx-2 h-6" />

          <div className="flex gap-1">
            {listButtons.map((button, index) => (
              <Button key={index} variant="ghost" size="sm" className="px-2">
                {button.icon}
              </Button>
            ))}
          </div>

          <div className="flex gap-1">
            {indentButtons.map((button, index) => (
              <Button key={index} variant="ghost" size="sm" className="px-2">
                {button.icon}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="mx-2 h-6" />

          <div className="flex gap-1">
            {mediaButtons.map((button, index) => (
              <Button key={index} variant="ghost" size="sm" className="px-2">
                {button.icon}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-2">
          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full resize-none border-0 bg-transparent p-0 font-mono text-sm focus:outline-none focus:ring-0 ${error ? 'text-red-500' : ''}`}
          />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor }; 