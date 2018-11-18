import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// external imports after this point only
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpClientModule,  // HttpClientModule after BrowserModule

		// external imports after this point only
		NgMultiSelectDropDownModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
