declare type CellType = "code" | "markdown" | "raw";

declare class CommMessage {
  parent_header: {
    msg_id: string;
  };
  content: {
    data: any;
  }
}

declare class OutputMessage {
  header: {
    msg_type: string;
  };
  content: {
    name: string,
    text: string,
  };
}

declare class Comm {
  on_msg(callback: (msg: CommMessage) => void): void;
}

declare class CommManager {
  register_target(name: string, callback: (comm: Comm) => void): void;
  unregister_target(name: string): void;
}

declare class Kernel {
  comm_manager: CommManager;
}

declare class Notebook {
  kernel: Kernel;

  get_cells(): NotebookCell[];
  get_selected_cell(): NotebookCell;
  get_msg_cell(msg_id: string): NotebookCell;
}

declare class NotebookNamespace {
  notebook: Notebook;
}

declare class NotebookEvents {
  on(action: string, callback: (event: JQuery.Event, parameter?: any) => void): void;
  off(action: string, callback: (event: JQuery.Event, parameter?: any) => void): void;
  trigger(action: string, parameter?: any): void;
}

declare class OutputArea {
  clear_output(): void;
  handle_output(msg: OutputMessage): void;
}

declare class NotebookCell {
  cell_id: string;
  cell_type: CellType;
  output_area: OutputArea;
  element: JQuery<HTMLElement>;
  metadata: { [key: string]: any }
}

declare class NotebookCodeCell extends NotebookCell {
  code_mirror: CodeMirror.Editor;
}
