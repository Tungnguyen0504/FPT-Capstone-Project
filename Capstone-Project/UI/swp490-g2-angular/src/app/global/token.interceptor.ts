import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor
{
    constructor(
        private $auth: AuthService,
    )
    {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if (this.$auth.getJwtToken())
        {
            req = this._addToken(req, this.$auth.getJwtToken()!);
        }

        return next.handle(req);
    }

    private _addToken(request: HttpRequest<any>, token: string)
    {
        return request.clone({
            setHeaders: {
                "Authorization": `Bearer ${token}`,
            }
        });
    }
}
