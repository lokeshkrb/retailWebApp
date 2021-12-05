import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Households, Products, Transactions, User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class RetailService {
    constructor(private http: HttpClient) { }

    getTransactions(hshdNum: number) {
        return this.http.get<Transactions[]>(`${config.apiUrl}/retail/${hshdNum}`);
    }
    async uploadProducts(products: Products[]) {
        return await this.http.post(`${config.apiUrl}/retail/uploadProducts`, products).toPromise();
    }
    async uploadHouseholds(households: Households[]) {
        return await this.http.post(`${config.apiUrl}/retail/uploadHouseholds`, households).toPromise();
    }
    async uploadTransactions(transactions: Transactions[]) {
        return await this.http.post(`${config.apiUrl}/retail/uploadTransactions`, transactions).toPromise();
    }

    
}