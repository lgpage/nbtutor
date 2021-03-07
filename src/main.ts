import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NbtutorService } from '@app/services/nbtutor.service';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(ngRef => {
  window['Nbtutor'] = {
    module: ngRef,
    service: ngRef.injector.get(NbtutorService)
  };
}).catch(err => console.error(err));
