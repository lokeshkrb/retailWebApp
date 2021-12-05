import { Households, Products, Transactions } from "@/_models";
import { AlertService, RetailService } from "@/_services";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Console } from "console";
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'upload.component.html' })
export class UploadComponent implements OnInit {
    uploadForm: FormGroup;
    hloading = false;
    ploading = false;
    tloading = false;
   
    hbutton = true;
    pbutton = true;
    tbutton = true;

    hupload = false;
    pupload = false;
    tupload = false;

    tChunckCount = 0;
    pChunckCount = 0;
    hChunckCount = 0;

    tUploadPercentage = 0;
    pUploadPercentage = 0;
    hUploadPercentage = 0;
    
    public products: Products[] = [];  
    public households: Households[] = [];  
    public transactions: Transactions[]=[];
    transactionsInChunks = [];
    productsInChunks = [];
    householdsInChunks = [];
    ngOnInit(){
       this.uploadForm = this.formBuilder.group({
            productsFile: ['',],
            householdsFile: ['', ],
            transactionsFile: ['',]
        })
    }
    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private retailService: RetailService
    ){
    }

  @ViewChild('householdCsvReader',{static: false}) householdCsvReader: any; 
  @ViewChild('productCsvReader',{static: false}) productCsvReader: any; 
  @ViewChild('transactionCsvReader',{static: false}) transactionCsvReader: any; 

  uploadProductsListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
    this.pbutton = true;
    this.ploading = true;
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.getProductsDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        console.log(this.products.length);
        this.ploading = false;
        this.pbutton = false;
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.productCsvReader.nativeElement.value = "";  
      this.products = [];  
      this.hloading = false;
    }  
  }  

  uploadHouseholdsListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
    this.hbutton = true;
    this.hloading = true;
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.getHouseholdsDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        console.log(this.households.length);
        this.hloading = false;
        this.hbutton = false;
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.householdCsvReader.nativeElement.value = "";  
      this.households = []; 
      this.hloading = false;
    }  
  }  

  async uploadHouseholds(){
    this.hupload = true;
    this.hbutton = true;
    this.hChunckCount = 0;
    if(this.householdsInChunks.length > 0){ 
      for(let i = 0; i < this.householdsInChunks.length; i++)
      {   
        /*this.retailService.uploadHouseholds(this.householdsInChunks[i])
          .pipe(first())
          .subscribe(
                  data => {
                    this.hChunckCount++;
                    this.calculateHUploadPercentage();
                    if(this.hChunckCount == this.householdsInChunks.length){
                      this.hupload = false;
                      this.householdCsvReader.nativeElement.value = "";  
                      this.householdsInChunks = [];
                      this.alertService.success("Households upload ok");
                    }
                  },
                  error => {
                    this.hChunckCount++;
                    this.calculateHUploadPercentage();
                    this.alertService.error("Household upload failed for chunk "+(i+1));
                    if(this.hChunckCount == this.householdsInChunks.length){
                        this.hupload = false;
                        this.householdCsvReader.nativeElement.value = ""; 
                    }
                  });*/
                  console.log("calling for chunk "+(i+1));
                  try{
                    let anything = await this.retailService.uploadHouseholds(this.householdsInChunks[i]);
                    console.log("calling for chunk "+(i+1)+" ended"+anything);
                        this.hChunckCount++;
                        this.calculateHUploadPercentage();
                        if(this.hChunckCount == this.householdsInChunks.length){
                          this.hupload = false;
                          this.householdCsvReader.nativeElement.value = "";  
                          this.householdsInChunks = [];
                          this.alertService.success("Households upload ok");
                        }
                      } catch(e){
                        this.hChunckCount++;
                        this.calculateHUploadPercentage();
                        this.alertService.error("Household upload failed for chunk "+(i+1));
                        if(this.hChunckCount == this.householdsInChunks.length){
                            this.hupload = false;
                            this.householdCsvReader.nativeElement.value = ""; 
                        }
                      }
      }
    }
  }

  async uploadProducts(){
    this.pupload = true;
    this.pbutton = true;
    this.pChunckCount = 0;
    if(this.productsInChunks.length > 0){    
      for(let i = 0; i < this.productsInChunks.length; i++)
      {   
        console.log("calling for chunk "+(i+1));
        /*this.retailService.uploadProducts(this.productsInChunks[i])
          .pipe(first())
          .subscribe(
                  data => {
                    this.pChunckCount++;
                    this.calculatePUploadPercentage();
                    if(this.pChunckCount == this.productsInChunks.length){
                      this.pupload = false;
                      this.productCsvReader.nativeElement.value = "";  
                      this.productsInChunks = [];
                      this.alertService.success("Products upload ok");
                    }
                  },
                  error => {
                      this.pChunckCount++;
                      this.calculatePUploadPercentage();
                      this.alertService.error("Products upload failed for chunk "+i+1);
                      if(this.pChunckCount == this.productsInChunks.length){
                          this.pupload = false;
                          this.productCsvReader.nativeElement.value = ""; 
                      } 
                  });*/
                  try{
                    let anything = await this.retailService.uploadProducts(this.productsInChunks[i]);
                    /*anything.then(
                      (data:any)=>{
                        console.log("calling for chunk "+(i+1)+" ended");
                        this.pChunckCount++;
                      this.calculatePUploadPercentage();
                      if(this.pChunckCount == this.productsInChunks.length){
                        this.pupload = false;
                        this.productCsvReader.nativeElement.value = "";  
                        this.productsInChunks = [];
                        this.alertService.success("Products upload ok");
                      }
                      },(error)=>{
                        this.pChunckCount++;
                        this.calculatePUploadPercentage();
                        this.alertService.error("Products upload failed for chunk "+(i+1));
                        if(this.pChunckCount == this.productsInChunks.length){
                            this.pupload = false;
                            this.productCsvReader.nativeElement.value = ""; 
                        } 
                      })*/
                      console.log("calling for chunk "+(i+1)+" ended"+anything);
                      this.pChunckCount++;
                      this.calculatePUploadPercentage();
                      if(this.pChunckCount == this.productsInChunks.length){
                        this.pupload = false;
                        this.productCsvReader.nativeElement.value = "";  
                        this.productsInChunks = [];
                        this.alertService.success("Products upload ok");
                      }
                  } catch(e){
                    this.pChunckCount++;
                      this.calculatePUploadPercentage();
                      this.alertService.error("Products upload failed for chunk "+(i+1));
                      if(this.pChunckCount == this.productsInChunks.length){
                          this.pupload = false;
                          this.productCsvReader.nativeElement.value = ""; 
                      } 
                  }
                  
      }
    }
  }

  async uploadTransactions(){
   // var startTime = performance.now()
   this.tbutton = true;
   this.tupload = true;
   this.tChunckCount = 0;
    if (this.transactionsInChunks.length > 0){
      for(let i = 0; i < this.transactionsInChunks.length; i++)
      {
          //onsole.log("Trying set "+i);
          /*this.retailService.uploadTransactions(this.transactionsInChunks[i])
          .pipe(first())
          .subscribe(
              data => {
                this.tChunckCount++;
                this.calculateTUploadPercentage();
                if(this.tChunckCount == this.transactionsInChunks.length){
                  this.tupload = false;
                  this.transactionCsvReader.nativeElement.value = "";  
                  this.transactionsInChunks = [];
                  this.alertService.success("Transaction upload ok");
                } 
              },
              error => {
                this.tChunckCount++;
                this.calculateTUploadPercentage();
                this.alertService.error("Transaction upload failed for chunk "+(i+1));
                if(this.tChunckCount == this.transactionsInChunks.length){
                    this.tupload = false;
                    this.transactionCsvReader.nativeElement.value = ""; 
                }
              });*/
              console.log("calling for chunk "+(i+1));
              try{
                let anything = await this.retailService.uploadTransactions(this.transactionsInChunks[i]);
                console.log("calling for chunk "+(i+1)+" ended"+anything);
                    this.tChunckCount++;
                    this.calculateTUploadPercentage();
                    if(this.tChunckCount == this.transactionsInChunks.length){
                      this.tupload = false;
                      this.transactionCsvReader.nativeElement.value = "";  
                      this.transactionsInChunks = [];
                      this.alertService.success("Transaction upload ok");
                    } 
                  } catch(e){
                    this.tChunckCount++;
                    this.calculateTUploadPercentage();
                    this.alertService.error("Transaction upload failed for chunk "+(i+1));
                    if(this.tChunckCount == this.transactionsInChunks.length){
                      this.tupload = false;
                      this.transactionCsvReader.nativeElement.value = ""; 
                    }
                  }
      }   
    }  
      
  }

  uploadTransactionsListener($event: any): void {  
    let text = [];  
    let files = $event.srcElement.files;  
    this.tbutton = true;
    this.tloading = true;
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
       this.getTransactionsDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length); 
       this.tloading = false;
       this.tbutton = false;
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.transactionCsvReader.nativeElement.value = "";  
      this.transactionsInChunks = []; 
      this.tloading = false;
    }  
    
  }  
  
  getProductsDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
    let count = 0;
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      count++; 
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let products: Products = new Products();  
        products.product_num = +curruntRecord[0].trim();  
        products.department = curruntRecord[1].trim();  
        products.comodity = curruntRecord[2].trim();  
        products.brand_ty = curruntRecord[3].trim();  
        products.natural_organic_flag = curruntRecord[4].trim();  
        csvArr.push(products);  
      }  
      if(count==10000){
        this.productsInChunks.push(csvArr);
        csvArr = [];
        count = 0;
      }
    }  
    if(csvArr.length>0){
      this.productsInChunks.push(csvArr);
    }
    console.log("Products total chunks"+this.productsInChunks.length);  
    //return csvArr;  
  }  

  getHouseholdsDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
    let count = 0;
    for (let i = 1; i < csvRecordsArray.length; i++) { 
      count++; 
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let households: Households = new Households();  
        households.hshd_Num = +curruntRecord[0].trim();  
        households.loyality_flag = curruntRecord[1].trim();  
        households.age_range = curruntRecord[2].trim();  
        households.marital_status = curruntRecord[3].trim();  
        households.income_range = curruntRecord[4].trim();  
        households.homeowner_desc = curruntRecord[5].trim();  
        households.hshd_composition = curruntRecord[6].trim();  
        households.hshd_size = curruntRecord[7].trim();  
        households.children = curruntRecord[8].trim();  
        csvArr.push(households);  
      }  
      if(count==10000){
        this.householdsInChunks.push(csvArr);
        csvArr = [];
        count = 0;
      }
    }  
    if(csvArr.length>0){
      this.householdsInChunks.push(csvArr);
    }
    console.log("Households total chunks"+this.householdsInChunks.length); 
    //return csvArr;  
  }  

  getTransactionsDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
    let count = 0;
    for (let i = 1; i < csvRecordsArray.length; i++) {  
        count++;
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let transactions: Transactions = new Transactions();  
        transactions.basket_num = +curruntRecord[0].trim();  
        transactions.hshd_Num = +curruntRecord[1].trim();  
        transactions.purchase = curruntRecord[2].trim();  
        transactions.product_num = +curruntRecord[3].trim();  
        transactions.spend = curruntRecord[4].trim();  
        transactions.units = curruntRecord[5].trim();  
        transactions.stock_r = curruntRecord[6].trim();  
        transactions.week_num = curruntRecord[7].trim();  
        transactions.year = curruntRecord[8].trim();  
        csvArr.push(transactions);  
      }  
      if(count==10000){
        this.transactionsInChunks.push(csvArr);
        csvArr = [];
        count = 0;
      }
    } 
    if(csvArr.length>0){
        this.transactionsInChunks.push(csvArr);
    }
    console.log("Transactions total chunks"+this.transactionsInChunks.length); 
     //return csvArr;
  }
   
    
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  

  calculateTUploadPercentage(){
    this.tUploadPercentage = (this.tChunckCount/this.transactionsInChunks.length)*100;
  }
  calculateHUploadPercentage(){
    this.hUploadPercentage = (this.hChunckCount/this.householdsInChunks.length)*100;
  }
  calculatePUploadPercentage(){
    this.pUploadPercentage = (this.pChunckCount/this.productsInChunks.length)*100;
  }

}

