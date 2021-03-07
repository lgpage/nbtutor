import { HeapObject } from '@app/models';
import { CellService, JsPlumbService } from '@app/services';
import { AnchorFromDirective } from './anchor-from.directive';

describe('AnchorFromDirective', () => {
  let directive: AnchorFromDirective;

  let cellServiceSpy: jasmine.SpyObj<CellService>;
  let jsPlumbServiceSpy: jasmine.SpyObj<JsPlumbService>;

  beforeEach(() => {
    cellServiceSpy = jasmine.createSpyObj<CellService>('CellService', ['setHover']);
    jsPlumbServiceSpy = jasmine.createSpyObj<JsPlumbService>('JsPlumbService', ['toggleHoverClass']);

    directive = new AnchorFromDirective(cellServiceSpy, jsPlumbServiceSpy, null);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('onMouseOver', () => {
    it('calls expected methods', () => {
      const heapObject = { id: 'id' } as HeapObject;

      directive.from = { id: 'id', uuid: 'uuid' };
      directive.heap = { ids: ['id'], entities: { id: heapObject } };

      directive.onMouseOver();

      expect(cellServiceSpy.setHover).toHaveBeenCalledWith({ from: directive.from, to: heapObject });
      expect(jsPlumbServiceSpy.toggleHoverClass).toHaveBeenCalledWith('uuid');
    });
  });

  describe('onMouseOut', () => {
    it('calls expected methods', () => {
      directive.from = { id: 'id', uuid: 'uuid' };

      directive.onMouseOut();

      expect(cellServiceSpy.setHover).toHaveBeenCalledWith(null);
      expect(jsPlumbServiceSpy.toggleHoverClass).toHaveBeenCalledWith('uuid');
    });
  });
});
