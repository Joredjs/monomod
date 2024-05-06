import { IErrResponse, IOKResponse } from "../domain/result";
import {
  IFrameworkService,
  TFrameworkRequest,
  TFrameworkResponse,
} from "../domain/frameworks";
import { IAppValidations } from "../domain/validations";
import { IController } from "../domain/layers";
import { domainKeys } from "../domain/keys/index";

export class BaseController<TFwReq, TFwRes>
  implements IController<TFwReq, TFwRes>
{
  validations: IAppValidations<TFwReq, TFwRes>;

  framework: IFrameworkService<TFwRes>;

  constructor(
    Validations: IAppValidations<TFwReq, TFwRes>,
    frameworkService: IFrameworkService<TFwRes>
  ) {
    this.validations = Validations;
    this.framework = frameworkService;
  }

  public handler = (
    req: TFrameworkRequest<TFwReq>,
    res: TFrameworkResponse<TFwRes>
  ) => {
    try {
      const resValidations = this.validations.manager(req, res);

      if (resValidations.isOk()) {
        const info = resValidations.unwrap().body;
        info
					.useCase(info)
					.then((useCaseResponse: IOKResponse<unknown>) => {
						const resInfo = {
							resBody: useCaseResponse,
							resInstance: res as TFwRes,
							status: useCaseResponse.code,
						};
						this.framework.returnInfo(resInfo);
					})
					.catch((useCaseErr: IErrResponse) => {
						const resErrInfo = {
							resBody: useCaseErr,
							resInstance: res as TFwRes,
							status: useCaseErr.code || domainKeys.errores.nocatch.code,
						};
						this.framework.returnInfo(resErrInfo);
					});
      } else {
        const infoError = resValidations.unwrap();
        const resErrInfo = {
          resBody: infoError,
          resInstance: res as TFwRes,
          status: infoError.code,
        };
        this.framework.returnInfo(resErrInfo);
      }
    } catch (error) {
      console.error("ERROR en handler", error);
      const resErrInfo = {
        resBody: {
          body: "Por el momento no es posible acceder a la información",
          code: 500,
        },
        resInstance: res as TFwRes,
        status: 500,
      };
      this.framework.returnInfo(resErrInfo);

    }
  };
}
