import { environment } from 'environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  CanvasComponent, CodeObjectComponent, FrameComponent, HeapComponent, HeapObjectComponent,
  KeyValuePairObjectComponent, LegendComponent, MainButtonGroupComponent, SequenceObjectComponent,
  StackComponent, StepButtonGroupComponent
} from './components';
import { LogLevel } from './constants';
import {
  AnchorFromDirective, AnchorToDirective, DynamicElementContainerDirective
} from './directives';
import { NbtutorComponent } from './nbtutor.component';
import { LOGLEVEL } from './services';
import {
  ButtonEffects, CellDataEffects, ComponentEffects, VisualizationEffects
} from './store/effects';
import { metaReducersProvider, REDUCERS, reducersProvider } from './store/reducers';
import { MockTraceStepData } from './testing/mock-tracestep-data';

export function setLogLevel(): LogLevel {
  return environment.production ? LogLevel.Warning : LogLevel.Trace;
}

export function getMockTraceStepData(): MockTraceStepData {
  return environment.production ? null : new MockTraceStepData();
}

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot(REDUCERS, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      }
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 50,
    }),
    EffectsModule.forRoot([
      ButtonEffects,
      CellDataEffects,
      ComponentEffects,
      VisualizationEffects,
    ]),
    BrowserAnimationsModule,
  ],
  declarations: [
    AnchorFromDirective,
    AnchorToDirective,
    CanvasComponent,
    CodeObjectComponent,
    DynamicElementContainerDirective,
    FrameComponent,
    HeapComponent,
    HeapObjectComponent,
    KeyValuePairObjectComponent,
    LegendComponent,
    MainButtonGroupComponent,
    NbtutorComponent,
    SequenceObjectComponent,
    StackComponent,
    StepButtonGroupComponent,
  ],
  providers: [
    reducersProvider,
    metaReducersProvider,
    { provide: LOGLEVEL, useFactory: setLogLevel },
    { provide: MockTraceStepData, useFactory: getMockTraceStepData },
  ],
  bootstrap: [NbtutorComponent]
})
export class AppModule { }
