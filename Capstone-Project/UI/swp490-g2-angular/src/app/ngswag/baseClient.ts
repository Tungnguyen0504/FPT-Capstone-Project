export class BaseClient {
  private _jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  protected transformResult(url: string, response: HttpResponseBase, processor: (response: HttpResponseBase) => any): Observable<any> {
    return processor(response);
    // const status = response.status;
    // const responseBlob =
    //     response instanceof HttpResponse ? response.body :
    //     (response as any).error instanceof Blob ? (response as any).error : undefined;

    // let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
    // if (status === 200) {
    //     return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
    //     let result200: any = null;
    //     let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this._jsonParseReviver);
    //     debugger;
    //     result200 = ProductCategory.fromJS(resultData200);
    //     return _observableOf(result200);
    //     }));
    // } else if (status !== 200 && status !== 204) {
    //     return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
    //     return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    //     }));
    // }
    // return _observableOf(null as any);
  }
}
