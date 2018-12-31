import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WebpageModel } from  '../../../../models/webpages/webpage.model';
import { WebpageDataModel } from  '../../../../models/webpages/data/webpage-data.model';

@Injectable()
export class WebpageAdminService {

  private webpagesUrl = '/api/admin/webpages';
  private webpageByIdUrl = '/api/admin/webpages/id/';
  private webpageByTitleUrl= '/api/admin/webpages/title/';

  constructor(
    private http: HttpClient
  ) {}

  getWebpageById(webpageId: number): Observable<WebpageDataModel[]> {
    if (webpageId) {
      return this.http.get<WebpageDataModel[]>(this.webpageByIdUrl + webpageId);
    }
  }

  getWebpageByTitle(title: string): Observable<WebpageDataModel[]> {
    if (title) {
      return this.http.get<WebpageDataModel[]>(this.webpageByTitleUrl + title);
    }
  }

  saveNewWebpage(webpageData: WebpageModel) {
    if (webpageData) {
      return this.http.post(this.webpagesUrl, webpageData);
    }
  }

  saveExistingWebpage(webpageId: number, webpageData: WebpageModel) {
    if (webpageId && webpageData) {
      return this.http.put(this.webpagesUrl + '/' + webpageId, webpageData);
    }
  }
}
