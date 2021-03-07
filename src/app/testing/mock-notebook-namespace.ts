declare var $: JQueryStatic;

export class MockOutputArea implements OutputArea {
  clear_output(): void { }
  handle_output(msg: OutputMessage): void { }
}

export class MockNotebookCell implements NotebookCell {
  metadata = {};
  cell_id = 'id';
  cell_type: CellType = 'code';
  output_area = new MockOutputArea();

  get element(): JQuery<HTMLElement> {
    return $('.cell.code_cell');
  }
}

export class MockCommManager implements CommManager {
  register_target(name: string, callback: (comm: Comm) => void): void { }
  unregister_target(name: string): void { }
}

export class MockKernel implements Kernel {
  comm_manager = new MockCommManager();
}

export class MockNotebook implements Notebook {
  protected _cell = new MockNotebookCell();

  kernel = new MockKernel();

  get_cells(): NotebookCell[] {
    return [this._cell];
  }

  get_selected_cell(): NotebookCell {
    return this._cell;
  }

  get_msg_cell(msg_id: string): NotebookCell {
    return this._cell;
  }
}

export class MockNotebookNamespace implements NotebookNamespace {
  notebook = new MockNotebook();
}
