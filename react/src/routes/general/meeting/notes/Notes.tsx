import { FC, MutableRefObject, useEffect, useRef } from "react";

import Checklist from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
import Paragraph from "@editorjs/paragraph";
import Table from "@editorjs/table";

type Props = {
  groupNotes: MutableRefObject<string>;
  groupNotesState: string;
  websocket: MutableRefObject<WebSocket | null>;
};

const Notes: FC<Props> = ({ groupNotes, groupNotesState, websocket }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        data: JSON.parse(groupNotes.current),
        onChange: () => {
          editor.saver.save().then((data) => {
            if (
              websocket.current &&
              JSON.stringify(JSON.parse(groupNotes.current).blocks) !==
                JSON.stringify(data.blocks)
            ) {
              websocket.current.send(
                JSON.stringify({
                  type: "group_notes",
                  content: JSON.stringify(data),
                }),
              );
            }
          });
        },
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: "Add text here",
            },
          },
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3],
              defaultLevel: 1,
            },
          },
          delimiter: Delimiter,
          list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          table: Table,
          marker: Marker,
        },
        defaultBlock: "paragraph",
      });

      editorInstance.current = editor;
    }

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorInstance.current?.save) {
      editorInstance.current.save().then((data) => {
        if (
          JSON.stringify(data) !== groupNotes.current &&
          editorInstance.current?.render
        ) {
          const pos: number =
            editorInstance.current?.blocks.getCurrentBlockIndex() || 0;

          editorInstance.current
            .render(JSON.parse(groupNotes.current))
            .then(() => {
              editorInstance.current?.caret.setToBlock(pos, "end");
            });
        }
      });
    }
  }, [groupNotesState]);

  return (
    <section className="mx-auto h-full w-full max-w-4xl">
      <div className="mx-4 mt-10 rounded-md bg-gray-50 py-20 text-gray-950 shadow dark:bg-gray-200 dark:shadow-lg">
        <div id="editorjs" className="mx-auto w-[calc(100%_-_100px)]" />
      </div>
    </section>
  );
};

export default Notes;
