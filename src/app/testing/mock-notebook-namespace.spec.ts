import {
  MockKernel, MockNotebook, MockNotebookCell, MockNotebookNamespace, MockOutputArea
} from './mock-notebook-namespace';

describe('MockNotebookCell', () => {
  let testClass: MockNotebookCell;
  beforeEach(() => {
    testClass = new MockNotebookCell();
  });

  it('should have expected properties', () => {
    expect(testClass).toBeTruthy();
    expect(testClass.metadata).toEqual({});
    expect(testClass.cell_id).toEqual('id');
    expect(testClass.cell_type).toEqual('code');
    expect(testClass.output_area).toEqual(new MockOutputArea());
    expect(testClass.element).toBeTruthy();
  });
});

describe('MockNotebook', () => {
  let testClass: MockNotebook;
  beforeEach(() => {
    testClass = new MockNotebook();
  });

  it('should have expected properties', () => {
    const cell = new MockNotebookCell();

    expect(testClass.kernel).toEqual(new MockKernel());
    expect(testClass.get_cells()).toEqual([cell]);
    expect(testClass.get_selected_cell()).toEqual(cell);
    expect(testClass.get_msg_cell('msg')).toEqual(cell);
  });
});

describe('MockNotebookNamespace', () => {
  let testClass: MockNotebookNamespace;
  beforeEach(() => {
    testClass = new MockNotebookNamespace();
  });

  it('should have expected properties', () => {
    expect(testClass.notebook).toEqual(new MockNotebook());
  });
});
