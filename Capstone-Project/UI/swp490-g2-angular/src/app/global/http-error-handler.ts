import { HttpStatusCode } from "@angular/common/http";
import { Injectable, ErrorHandler, NgZone } from "@angular/core";
import { MessageService } from "primeng/api";
import { BusinessException } from "../ngswag/client";

@Injectable({
  providedIn: "root"
})
export class HttpErrorHandler implements ErrorHandler {
  constructor(
    private $message: MessageService,
    private $zone: NgZone,
  ) { }

  handleError(error: any) {
    if (!error)
      return;

    let message: string | undefined;
    if (BusinessException.isBusinessException(error)) {
      switch (error.status) {
        case HttpStatusCode.InternalServerError:
          try {
            const errorObject = JSON.parse(error.response);
            if(errorObject?.exception === "com.swp490_g2.hrms.common.exception.BusinessException")
            {
              message = JSON.parse(errorObject.message)?.message;
            }
          }
          catch (error) {
            message = "Server gặp lỗi không xác định (500)";
          }

          break;
      }
    }

    console.error(message || error.message || "Undefined client error");
    this.$zone.run(() =>
      this.$message.add(
        {
          severity: "error",
          summary: "Error occurred",
          detail: message || error.message || "Undefined client error",
        }
      )
    );
  }
}
