
import { Component, OnInit } from "@angular/core";


@Component({ templateUrl: 'dashboard.component.html' })
export class DashboardComponent implements OnInit {

    isLoading = true;
    ngOnInit(){
       
    }
    disableLoadingTag(){
        this.isLoading=false;
    }
}
