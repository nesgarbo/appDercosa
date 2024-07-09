import { Router } from '@angular/router';
import { Hook, HookContext } from '@feathersjs/feathers';
import { Application } from 'feathers-dercosa/lib/declarations';

export default function (options: any = {}): Hook {
  const { router }: { router: Router } = options;

  const navigateToLogin = () => {
    console.log(
      '[handleExpiredTokenError (Hook)] Navigating to login after failed reauthentication'
    );
    router.navigate(['auth/login']);
  };

  // Return the actual hook.
  return async (context: HookContext) => {
    // https://github.com/feathersjs/feathers/issues/1378#issuecomment-499983778
    const { id, params, service, data, method, error, path, app: feathers } = context;

    const app: Application = feathers as any;

    // Exclude paths handled directly in authenticacion client
    const excludedPaths = ['authentication', 'refresh-tokens'];

    if (error.code === 401 && !excludedPaths.includes(path) && !context.params.handlingError) {
      console.log('Handling not authenticated error...');
      params.handlingError = true;
      context.params.handlingError = true;
      navigateToLogin();
      params.handlingError = false;
      // try {
      //   // await app.authentication.refreshAccessToken();

      // } catch (e) {
      //   navigateToLogin();
      //   return context;
      // }
      // console.log('Reauthentication success!. Retrying original service call...');
      // let args: any[];
      // switch (method) {
      //   case 'create':
      //     args = [data, params];
      //     break;
      //   case 'find':
      //     args = [params];
      //     break;
      //   case 'get':
      //   case 'remove':
      //     args = [id, params];
      //     break;
      //   case 'update':
      //   case 'patch':
      //     args = [id, data, params];
      //     break;
      // }
      // return new Promise((resolve, reject) => {
      //   console.log('retrying...');
      //   (service[method] as any)(...args)
      //     .then(resolve)
      //     .catch(reject);
      // })
      //   .then((result) => {
      //     console.log('Original service call retry success!');
      //     context.result = result;
      //     return context;
      //   })
      //   .catch((e) => {
      //     console.log('Original service call retry error!', e);
      //     context.error = e;
      //     return e;
      //   });
    }
    // Not 401 error or handled error (Avoid infinite recursion)
    console.log('Exit hook without handling error', error);
    return context;
  };

}