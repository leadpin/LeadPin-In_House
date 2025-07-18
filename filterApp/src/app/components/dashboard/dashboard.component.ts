import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { IExcelData } from '../../Modal/excel-interface';
import { CommonModule } from '@angular/common';
import { mapFieldNames, mapToProspect } from '../../Modal/excel-functions';
import {
  itemsPerPageData,
  tableFieldsNames,
} from '../../Modal/excel-constants';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  ExcelData!: IExcelData[];

  fileName = 'Excel-Sheet.xlsx';
  tableFields = tableFieldsNames;
  pageNumber = 1;
  itemsPerPage = 10;
  itemsPerPageList = itemsPerPageData;
  totalProduct: any;
  constructor() {}

  readExcel(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(sheet);
      this.ExcelData = rawData.map(mapToProspect);
      this.totalProduct = this.ExcelData.length;

      // this.totalProduct = this.removeDuplicates();
      console.log(this.ExcelData);
    };

    fileReader.readAsArrayBuffer(file);

    // this.ExcelData=this.ExcelData.filter((item:IExcelData)=>{
    // })
  }

  // removeDuplicates(data: any, key: any) {
  //   return console.log([
  //     ...new Map(data.map((x: any) => [key(x), x])).values(),
  //   ]);
  // }

  // removeDuplicates() {
  //   const uniqueArray = this.ExcelData.reduce((acc, current) => {
  //     const x = acc.find((item: any) => item.email === current.email);
  //     if (!x) {
  //       return acc.concat([current]);
  //     } else {
  //       return acc;
  //     }
  //   }, []);
  // }

  exportExcel() {
    const exportData = mapFieldNames(this.ExcelData);
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    XLSX.writeFile(workBook, this.fileName);
  }
  pageItems(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.itemsPerPage = +selectedValue;
    console.log(selectedValue);
  }
}
