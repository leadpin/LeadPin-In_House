import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { IExcelData } from '../../Modal/excel-interface';
import { CommonModule } from '@angular/common';
import {
  getCountries,
  getJobTitles,
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
  countryList: any = [];
  jobTitles: any = [];
  selectedCountries: string[] = [];
  isFileUploaded = false;

  selectedJob: string[] = [];
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
      this.countryList = getCountries(this.ExcelData);
      this.jobTitles = getJobTitles(this.ExcelData);
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
    this.applyCombinedFilters();
  }

  onJobChange(selected: string[]) {
    this.selectedJob = [...selected];
    this.applyCombinedFilters();
  }

  applyCombinedFilters() {
    this.ExcelData = this.tempExcelData.filter((item) => {
      const itemCountry = item.country.toLowerCase();
      const itemJob = item.jobTitle.toLowerCase();

      const countryMatch =
        this.selectedCountries.length === 0 ||
        this.selectedCountries.some((country) =>
          itemCountry.includes(country.toLowerCase())
        );

      const jobMatch =
        this.selectedJob.length === 0 ||
        this.selectedJob.some((job) => itemJob.includes(job.toLowerCase()));

      return countryMatch && jobMatch;
    });

    this.totalProduct = this.ExcelData.length;
  }
  clearfilter() {
    this.selectedCountries = [];
    this.applyCombinedFilters();
  }

  removeTag(item: string, filterType: string) {
    if (filterType == 'country') {
      this.selectedCountries = this.selectedCountries.filter((i) => i !== item);
      this.applyCombinedFilters();
    } else if (filterType == 'job-title') {
      this.selectedJob = this.selectedJob.filter((i) => i !== item);
      this.applyCombinedFilters();
    }
  }
}
