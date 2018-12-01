import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})

export class HitApiService {
	// including the libraries in the constructor here
	constructor(
		private http: HttpClient
	) { }

	// global variables
	baseUrl    = 'http://rest.kegg.jp';
	backEndUrl = 'http://localhost:3000/apiProxy';

	// one central API call routine, modify accordingly based on your backend
	// or make direct calls to the end-point, if you are hosting on http site
	makeAPICall(targetUrl): Observable<any> {
		let headers = {
			params: {
				'targetUrl': targetUrl
			}
		};
		return 	this.http
				.get(this.backEndUrl, headers)
				.map( data => { return data; } );
	}

	// api wrapper to get the organisms list
	getOrganisms(): Observable<any> {
		let targetUrl = this.baseUrl+'/list/organism';
		return this.makeAPICall(targetUrl);
	}

	// api wrapper to get the pathways of selected organism
	getPathways(org_id): Observable<any> {
		let targetUrl = this.baseUrl+'/list/pathway/'+org_id;
		return this.makeAPICall(targetUrl);
	}

	// api wrapper to get the genes of selected pathway
	getGeneInfo(pathway_id): Observable<any> {
		let targetUrl = this.baseUrl+'/get/'+pathway_id;
		return this.makeAPICall(targetUrl);
	}
}
