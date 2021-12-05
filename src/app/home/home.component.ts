import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService, RetailService, PagerService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    users = [];
    allTransactions = [];
    loading = true;
    // pager object
    pager: any = {};

    // paged items
    transactions: any[];

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private retailService: RetailService,
        private pagerService: PagerService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
        console.log(this.currentUser);
    }

    ngOnInit() {
        //this.loadAllUsers();
        this.loadRetailDataForHshdNum10();
    } 
    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
    private loadRetailDataForHshdNum10() {
        this.retailService.getTransactions(10)
            .pipe(first())
            .subscribe(trans => {this.allTransactions = trans; this.loading=false; this.setPage(1);});
    }
    private setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.allTransactions.length, page);

        // get current page of items
        this.transactions = this.allTransactions.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    
}