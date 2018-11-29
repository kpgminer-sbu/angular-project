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
  title:string="KPGMiner : Retrieve pathway genes from KEGG pathway database";
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
  table_settings = {
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
    position: 'left', // left|right
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
data = [
  {
        pathway : "Glycolysis",
        description: " Xbox One, PS4, PC",
        genes : "HK3,HK2,HK1"
    },
    {
        pathway : "Pentose phosphate pathway",
        description: "Win, PS3, PS4",
        genes : "GPI,G6PD,PGLS"
    },
    {
        pathway : "Citrate Cycle(TCA cycle)",
        description: "PS4",
        genes : "TS,ACLY"
    },
    {
        pathway : "Resident Evil Zero HD Remaster",
        description: "Win, PS3, PS4, X360, XBO",
        genes : "GPI,G6PD"
    },
    {
        pathway : "Lego Marvel's Avengers",
        description: "Win, X360, XBO, PS3, PS4, PSVita, WiiU, 3DS",
        genes : "HK1"
    }
  ];
  dropdownList1  = [];
  dropdownList2  = [];
  selectedItems1 = [];
  selectedItems2 = [];
  //setClickedRow : Function;

  // signature for the selected items
  // this.selectedItems1 = [
  //   { item_id: 3, item_text: 'Pune' },
  //   { item_id: 4, item_text: 'Navsari' }
  // ];

  ngOnInit() {
  	// api calls here
  	this.dropdownList1 = this.hitApiService.getOrganisms();
  }
  onItemSelect1(item: any) {
    console.log(item);
    this.dropdownList2 = this.hitApiService.getPathways( this.selectedItems1);
    console.log("dd populated");
  }
  onItemDeSelect1(item: any) {
    if (this.selectedItems1.length=== 0){
      this.dropdownList2=[];
      this.selectedItems2 =[];
    }
    console.log("dd cleared");
  }
  onItemSelect2(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
