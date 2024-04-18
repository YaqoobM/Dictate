/// <reference types="vite/client" />

declare module "*.png";

declare module "@editorjs/checklist" {
  import Checklist from "@editorjs/checklist";
  export = Checklist;
}

declare module "@editorjs/header" {
  import Header from "@editorjs/header";
  export = Header;
}

declare module "@editorjs/delimiter" {
  import Delimiter from "@editorjs/delimiter";
  export = Delimiter;
}

declare module "@editorjs/marker" {
  import Marker from "@editorjs/marker";
  export = Marker;
}

declare module "@editorjs/nested-list" {
  import NestedList from "@editorjs/nested-list";
  export = NestedList;
}

declare module "@editorjs/table" {
  import Table from "@editorjs/table";
  export = Table;
}

declare module "@editorjs/paragraph" {
  import Paragraph from "@editorjs/paragraph";
  export = Paragraph;
}

declare module "@editorjs/embed" {
  import Embed from "@editorjs/embed";
  export = Embed;
}
