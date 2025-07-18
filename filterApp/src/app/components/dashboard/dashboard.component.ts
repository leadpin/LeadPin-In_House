import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { IExcelData } from '../../Modal/excel-interface';
import { CommonModule } from '@angular/common';
import {
  mapFieldNames,
  mapToProspect,
  removeDuplicateEmailsData,
} from '../../Modal/excel-functions';
import {
  itemsPerPageData,
  tableFieldsNames,
} from '../../Modal/excel-constants';
import { NgxPaginationModule } from 'ngx-pagination';
import { countrNames } from '../../../constants/filters';
import { MultiSelectDropdownComponent } from '../../Shared/multi-select-dropdown/multi-select-dropdown.component';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgxPaginationModule, MultiSelectDropdownComponent],
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
  countrList = countrNames;

  selectedCountries: string[] = [];
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

      this.ExcelData = removeDuplicateEmailsData(this.ExcelData);
      this.totalProduct = this.ExcelData.length;
    };

    fileReader.readAsArrayBuffer(file);
  }

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
  }

  onSelectionChange(selected: string[]) {
    console.log('Selected values:', selected);
    this.selectedCountries = selected;
    console.log(this.selectedCountries);
  }
}
