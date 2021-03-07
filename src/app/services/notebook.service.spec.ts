import { cold, hot } from 'jasmine-marbles';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CodeCell, VisualizationData } from '@app/models';
import { CellService } from './cell.service';
import { JupyterService } from './jupyter.service';
import { NotebookService } from './notebook.service';

@Injectable()
class NotebookServiceExposed extends NotebookService {
  get name(): string {
    return this._name;
  }
}

describe('NotebookService', () => {
  let exposed: NotebookServiceExposed;
  let service: NotebookService;
  let jupyterSvc: JupyterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotebookServiceExposed,
      ],
    });

    jupyterSvc = TestBed.inject(JupyterService);
    exposed = TestBed.inject(NotebookServiceExposed);
    service = exposed;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have the correct name', () => {
    expect(`${exposed.name}Exposed`).toEqual(service.constructor.name);
  });

  let state: VisualizationData;
  let codeCell: CodeCell;
  let notebookSpy: jasmine.SpyObj<Notebook>;
  let cellServiceSpy: jasmine.SpyObj<CellService>;
  let jupyterNotebookSpy: jasmine.Spy;
  let commManager: CommManager;

  beforeEach(() => {
    const output_area: OutputArea = { clear_output() { }, handle_output() { } };

    commManager = {} as CommManager;
    state = { cellId: 'id', step: 2, maxSteps: 5, visualize: true, data: [] };
    cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setCodeCell']);
    codeCell = {
      cell_type: 'code',
      cell_id: 'id',
      metadata: { nbtutor: state },
      element: null,
      nbtutor: { cellSvc: cellServiceSpy, ngOnDestroy: () => { } },
      output_area,
      code_mirror: null,
    };

    notebookSpy = jasmine.createSpyObj<Notebook>('Notebook', ['get_selected_cell', 'get_msg_cell', 'get_cells']);
    notebookSpy.kernel = { comm_manager: commManager };
    notebookSpy.get_cells.and.returnValue([codeCell]);
    notebookSpy.get_selected_cell.and.returnValue(codeCell);
    notebookSpy.get_msg_cell.and.returnValue(codeCell);

    jupyterNotebookSpy = spyOnProperty(jupyterSvc, 'notebook$', 'get');
    jupyterNotebookSpy.and.returnValue(hot('n', { n: notebookSpy }));
  });

  describe('getCommManager', () => {
    it('should return expected result', () => {
      expect(service.getCommManager()).toBeObservable(cold('(c|)', { c: commManager }));
      expect(jupyterNotebookSpy).toHaveBeenCalled();
    });
  });

  describe('getCells', () => {
    it('should return expected result', () => {
      expect(service.getCells()).toBeObservable(cold('(c|)', { c: [codeCell] }));
      expect(jupyterNotebookSpy).toHaveBeenCalled();
      expect(notebookSpy.get_cells).toHaveBeenCalled();
    });
  });

  describe('getSelectedCell', () => {
    it('should return expected result', () => {
      expect(service.getSelectedCell()).toBeObservable(cold('(c|)', { c: codeCell }));
      expect(jupyterNotebookSpy).toHaveBeenCalled();
      expect(notebookSpy.get_selected_cell).toHaveBeenCalled();
    });
  });

  describe('getCellById', () => {
    it('should return expected result', () => {
      expect(service.getCellById('id')).toBeObservable(cold('(c|)', { c: codeCell }));
      expect(jupyterNotebookSpy).toHaveBeenCalled();
      expect(notebookSpy.get_cells).toHaveBeenCalled();
    });
  });

  describe('getMsgCell', () => {
    it('should return expected result', () => {
      expect(service.getMsgCell('msgId')).toBeObservable(cold('(c|)', { c: codeCell }));
      expect(jupyterNotebookSpy).toHaveBeenCalled();
      expect(notebookSpy.get_msg_cell).toHaveBeenCalledWith('msgId');
    });
  });
});
