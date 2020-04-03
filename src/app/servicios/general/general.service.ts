import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { url } from 'inspector';

@Injectable({
	providedIn: 'root'
})
export class GeneralService {
	
	private httpHeader: HttpHeaders;

	constructor(private httpClient: HttpClient) { }

	//Metodo para realizar los consumos POST al WS
	postData<T>(method: string, bearer: string, objectRequest?: any): Observable<T> {
		
		this.httpHeader = new HttpHeaders({
			//'X-CSRF-TOKEN': "BLHzyJaT42Cnqqyc4E1z92e6RIE1zaVb9Q1sX4Rm",
			//'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		});
		return this.httpClient.post<T>(`${environment.WS}${method}`, objectRequest, { headers: this.httpHeader });
	}

	//Metodo para obtener documentos realizando un consumo POST al WS
	postDataDocs<T>(method: string, bearer: string, objectRequest?: any): Observable<Blob> {
		this.httpHeader = new HttpHeaders({
			//'X-CSRF-TOKEN': "BLHzyJaT42Cnqqyc4E1z92e6RIE1zaVb9Q1sX4Rm",
			'Access-Control-Allow-Origin': '*',
			'contentType': 'application/octet-stream'
		});
		return this.httpClient.post<Blob>(`${environment.WS}${method}`, objectRequest, { responseType: 'blob' as 'json', headers: this.httpHeader });
	}

	//Metodo para obtener documentos realizando un consumo POST al WS
	postDataZip<T>(method: string, bearer: string, objectRequest?: any): Observable<Blob> {
		this.httpHeader = new HttpHeaders({
			//'X-CSRF-TOKEN': "BLHzyJaT42Cnqqyc4E1z92e6RIE1zaVb9Q1sX4Rm",
			'Access-Control-Allow-Origin': '*',
			'contentType': 'application/octet-stream'
		});
		return this.httpClient.post<Blob>(`${environment.WS}${method}`, objectRequest, { responseType: 'blob' as 'json', headers: this.httpHeader });
	}

	/**********************/
	public getUri(method: string)
	{
		return (`${environment.WS}${method}`).toString();
	}

	public  postFile<T>(method: string, data:FormData) {
		let url = this.getUri(method);
		const subscriptionFn = observer => {
			const xhr = new XMLHttpRequest();
		  xhr.addEventListener('load', () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
			  observer.next(JSON.parse(xhr.responseText));
			  observer.complete();
			}
		  });
		  xhr.open('POST', url);
		  xhr.send(data);
		  return () => xhr.abort()
		}
		return new Observable(subscriptionFn);
	  }

	/****************************/
}
