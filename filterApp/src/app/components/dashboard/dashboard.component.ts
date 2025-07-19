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
import { countrNames, jobTitles } from '../../../constants/filters';
import { MultiSelectDropdownComponent } from '../../Shared/multi-select-dropdown/multi-select-dropdown.component';
import { InputSelecterComponent } from '../../Shared/input-selecter/input-selecter.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    NgxPaginationModule,
    MultiSelectDropdownComponent,
    InputSelecterComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  ExcelData!: IExcelData[];
  tempExcelData!: IExcelData[];
  fileName = 'Excel-Sheet.xlsx';
  tableFields = tableFieldsNames;
  pageNumber = 1;
  itemsPerPage = 10;
  itemsPerPageList = itemsPerPageData;
  totalProduct: any;
  countryList = countrNames;
  selectedCountries: string[] = [];
  isFileUploaded = false;
  jobTitles: string[] = [];
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
      this.tempExcelData = this.ExcelData;
      this.isFileUploaded = true;
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

  onSelectedCountry(selectedVal: string[]) {
    this.selectedCountries = selectedVal;
    if (this.selectedCountries.length > 0) {
      this.ExcelData = this.tempExcelData.filter((item) => {
        const lowerCaseExlCountry = item.country.toLowerCase();

        return this.selectedCountries.some((countryArr) => {
          const lowerCaseCountrArr = countryArr.toLowerCase();
          return lowerCaseExlCountry.includes(lowerCaseCountrArr);
        });
      });
    } else {
      this.ExcelData = this.tempExcelData;
    }
  }
  clearfilter() {
    this.selectedCountries = [];
    this.onSelectedCountry(this.selectedCountries);
  }

  findJob() {
    const jobTitles = document.getElementById('job-title');
    const text = (jobTitles as HTMLInputElement).value;
    console.log(text);
  }

  jobs = jobTitles;
  selectedJob: string[] = [];

  onJobChange(selected: string[]) {
    this.selectedJob = [...selected];
    console.log('Selected Countries:', this.selectedJob);
  }

  removeTag(item: string, filterType: string) {
    if (filterType == 'country') {
      this.selectedCountries = this.selectedCountries.filter((i) => i !== item);
      this.onSelectedCountry(this.selectedCountries);
    } else if (filterType == 'job-title') {
      this.selectedJob = this.selectedJob.filter((i) => i !== item);
      this.onJobChange(this.selectedJob);
    }
  }
}
