import StarterKit from "@tiptap/starter-kit";

import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

export const editorExtensions = [
    StarterKit.configure({
        codeBlock: false,
    }),

    Link.configure({
        openOnClick: false,
        autolink: true,
    }),

    Image,

    Underline,

    Highlight,

    Typography,

    Placeholder.configure({
        placeholder:
            "Write your story...",
    }),

    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),

    TaskList,

    TaskItem.configure({
        nested: true,
    }),
];