import { Component,OnInit } from '@angular/core';
import { HitApiService } from './hit-api.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
	// the constructor for the services
	constructor(private hitApiService: HitApiService) { }

	// global data, including configs
	dropdownSettings1 = {
		singleSelection: true,
		idField: 'item_id',
		textField: 'item_text',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		itemsShowLimit: 3,
		allowSearchFilter: true
	};
	dropdownSettings2 = {
		singleSelection: false,
		idField: 'item_id',
		textField: 'item_text',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		itemsShowLimit: 10,
		allowSearchFilter: true
	};
	tableSettings = {
		pager: {
			display: true,
			perPage: 10,
		},
		actions: {
			columnTitle: '',
			add: false,
			edit: false,
			delete: false,
			custom: [],
			position: 'left',
		},
		columns: {
			pathway: {
				width:'20%',
				title: 'Pathway',
				class:'columnstyle'
			},
			description: {
				title: 'Description',
				class:'columnstyle'
			},
			genes: {
				title: 'Genes',
				class:'columnstyle'
			}
		}
	};

	organismList     = [];
	pathwayList      = [];
	selectedOrganism = [];
	selectedPathways = [];
	geneData = [{
			pathway : " ",
			description: " ",
			genes : " "
	}];

	ngOnInit() {
		// set true only for development purposes
		if( false ) {
			if( localStorage.getItem('organismList') != null ){
				this.organismList = JSON.parse( localStorage.getItem('organismList') );
				return;
			}
		}

		// get the list of organisms by default
		this.hitApiService.getOrganisms()
		.subscribe( (apiResponse) => {
			this.organismList = this.parseOrganismResponse(apiResponse);
			localStorage.setItem('organismList', JSON.stringify(this.organismList) );
		});
	}

	organismSelected(item: any) {
		// verify if valid
		if( ! this.selectedOrganism.length ) {
			return;
		}

		// get the list of pathways for selected organism
		let id = this.selectedOrganism[0].item_id;
		this.hitApiService.getPathways(id)
		.subscribe( (apiResponse) => {
			this.pathwayList = this.parsePathwayResponse(apiResponse);
		});
	}
	organismDeSelected(item: any) {
		if( this.selectedOrganism.length === 0){
			this.pathwayList = [];
			this.selectedPathways = [];
		}
	}

	pathwaySelected(item: any) {
		console.log(item);
	}
	pathwaySelectedAll(items: any) {
		console.log(items);
	}

	fetchGenes(items: any) {
		// clear the data in the table currently
		this.geneData = [{
				pathway : " ",
				description: " ",
				genes : " "
		}];

		// make API calls for each pathway and append it to gene data for table
		for(let i=0; i<this.selectedPathways.length; i++) {
			let id = this.selectedPathways[i].item_id;
			this.hitApiService.getGeneInfo(id)
			.subscribe( (apiResponse) => {
				var obj = this.parseGeneResponse(apiResponse);
				var finalObj = {
					pathway : obj['pathway'],
					description: obj['description'],
					genes : obj['genes']
				};
				this.geneData = JSON.parse( JSON.stringify( this.geneData ) );
				this.geneData.push( finalObj );
				console.log( this.geneData );
			});
		}
	}
	// all parsing funcions here
	parseOrganismResponse(apiResponse) {
		let tempArray = [];
		if( ! apiResponse.success )
			return tempArray;

		let lines = apiResponse.data.split("\n");

		for(var i=0; i<lines.length; i++) {
			let values = lines[i].split('\t');
			let tempObj = {
				'item_id': values[1],
				'item_text': values[2]
			};
			tempArray.push(tempObj);
		}
		return tempArray;
	}

	parsePathwayResponse(apiResponse) {
		let tempArray = [];
		if( ! apiResponse.success )
			return tempArray;

		let lines = apiResponse.data.split("\n");
		for(var i=0; i<lines.length; i++) {
			if( lines[i].length == 0 )
				continue;

			let values = lines[i].split('\t');
			let id = values[0].split(':')[1];
			let name = values[1].split('-')[0].trim();
			let tempObj = {
				'item_id': id,
				'item_text': name
			};
			tempArray.push(tempObj);
		}
		return tempArray;
	}

	parseGeneResponse(apiResponse) {
		let finalObject = {};
		if( ! apiResponse.success )
			return finalObject;

		let lines = apiResponse.data.split("\n");
		let readGene = false;
		let genes = "";
		for(var i=0; i<lines.length; i++) {
			if( lines[i].length == 0 )
				continue;

			if(readGene) {
				if( lines[i][0] == " " ) {
					if( lines[i].indexOf(';') != -1 )
						genes += ", " + lines[i].match(/\s*\d*\s*(.*);.*$/)[1];
				}
				else {
					readGene = false;
				}
			}

			let vals = lines[i].split(' ');
			if( vals[0] == "NAME" ) {
				finalObject['pathway'] = lines[i].match(/NAME\s*(.*)\s*-.*$/)[1];
			}
			if( vals[0] == "DESCRIPTION" ) {
				finalObject['description'] = lines[i].match(/DESCRIPTION\s*(.*)\.$/)[1]
			}
			if( vals[0] == "GENE" ) {
				readGene = true;
				genes += lines[i].match(/GENE\s*\d*\s*(.*);.*$/)[1].trim();
			}
		}
		finalObject['genes'] = genes;
		return finalObject;
	}

	downloadCSV() {
		// check if table has values, to avoid downloading empty files
		if( this.geneData.length==1 )
			return;

		// get the content now
		let csvContent = "data:text/csv;charset=utf-8,";
		let csvHeaders = ["Pathway" , "Description", "Genes"];
		csvContent += csvHeaders.join(",") + "\r\n";

		this.geneData.forEach(function(rowArray) {
			// do not change for dummy
			if( rowArray.pathway != " " ) {
				let row = rowArray.pathway.trim() + ",";
				row += rowArray.description || " " + ",";
				row += rowArray.genes.split(',').join(";");
				csvContent += row + "\r\n";
			}
		});
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "kpgminer_"+ new Date().valueOf() +".csv");
		document.body.appendChild(link);
		link.click();
	}
}
