import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import 'rxjs/Rx';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({
				'Content-Type': 'application/json',
				"Access-Control-Allow-Origin": "*"
	})
};

@Injectable({
  providedIn: 'root'
})

export class HitApiService {
	// including the libraries here
	constructor(
		private http: HttpClient
		// private http: Http
	) { }

	// actual function calls to the apis
	getOrganisms(): Observable<any> {
		return this.http.get(`http://localhost:3000/api/getOrganisms`)
						.map(data => {
								return data;
						});
	}
	getPathways(data) {
		console.log("selected item:");
		console.log(data);
		var type1Data = [
			{ item_id: 1, item_text: 'Mumbai' },
			{ item_id: 2, item_text: 'Bangaluru' },
			{ item_id: 3, item_text: 'Pune' },
			{ item_id: 4, item_text: 'Navsari' },
			{ item_id: 5, item_text: 'New Delhi' }
		];
		return type1Data;
	}
}
