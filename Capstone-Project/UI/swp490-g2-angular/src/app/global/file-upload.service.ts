import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private baseUrl = environment.apiUrl;

  constructor(private $http: HttpClient, private $auth: AuthService) {}

  upload(
    file: File,
    url: string,
    method: "POST" | "PUT" = "POST"
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append("file", file);

    const req = new HttpRequest(method, `${this.baseUrl}/${url}`, formData, {
      reportProgress: true,
      responseType: "json",
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.$auth.getJwtToken()}`,
      }),
    });

    return this.$http.request(req);
  }

  getFiles(): Observable<any> {
    return this.$http.get(`${this.baseUrl}/files`);
  }
}
