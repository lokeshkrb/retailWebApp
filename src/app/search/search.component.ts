import { AlertService, RetailService, PagerService } from "@/_services";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from 'rxjs/operators';


@Component({ templateUrl: 'search.component.html' })
export class SearchComponent implements OnInit {
    searchForm: FormGroup;
    loading = false;
    showMessage = false;
    submitted = false;
    allTransactions = []
    // pager object
    pager: any = {};

    // paged items
    transactions: any[];
    
    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private retailService: RetailService,
        private pagerService: PagerService
    ){}

    ngOnInit(){
        this.searchForm = this.formBuilder.group({
            hshdNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.searchForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.showMessage = false;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.searchForm.invalid) {
            return;
        }

        this.loading = true;
        this.retailService.getTransactions(this.searchForm.value.hshdNumber)
            .pipe(first())
            .subscribe(
                trans => {
                    this.allTransactions = trans;
                    this.loading = false;
                    if(this.allTransactions.length == 0){
                        this.showMessage = true;
                    }
                    this.setPage(1);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
    private setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.allTransactions.length, page);

        // get current page of items
        this.transactions = this.allTransactions.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}