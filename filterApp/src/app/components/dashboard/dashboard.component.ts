import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { IExcelData } from '../../Modal/excel-interface';
import { CommonModule } from '@angular/common';
import {
  convertFieldNames,
  getCompanies,
  getCountries,
  getIndustries,
  getJobTitles,
  mapFieldNames,
  mapToProspect,
  removeDuplicateEmailsData,
} from '../../Modal/excel-functions';
import { itemsPerPageData } from '../../Modal/excel-constants';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputSelecterComponent } from '../../Shared/input-selecter/input-selecter.component';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgxPaginationModule, InputSelecterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  ExcelData!: IExcelData[];
  tempExcelData!: IExcelData[];
  fileName = 'Excel-Sheet.xlsx';
  tableFields!: string[];
  pageNumber = 1;
  itemsPerPage = 10;
  itemsPerPageList = itemsPerPageData;
  totalProduct: any;
  countryList: any = [];
  selectedCountries: string[] = [];
  jobTitles: any = [];
  selectedJob: string[] = [];
  companyNames: any = [];
  selectedCompanies: string[] = [];

  industryNames: any = [];
  selectedIndustries: string[] = [];

  isFileUploaded = false;
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
      this.tableFields = convertFieldNames(this.ExcelData);
      this.countryList = getCountries(this.ExcelData);
      this.jobTitles = getJobTitles(this.ExcelData);
      this.companyNames = getCompanies(this.ExcelData);
      this.industryNames = getIndustries(this.ExcelData);
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

  onJobChange(selectedVal: string[]) {
    this.selectedJob = [...selectedVal];
    this.applyCombinedFilters();
  }
  onSelectedCompany(selectedVal: string[]) {
    this.selectedCompanies = [...selectedVal];
    this.applyCombinedFilters();
  }

  onSelectedIndustry(selectedVal: string[]) {
    this.selectedIndustries = [...selectedVal];
    this.applyCombinedFilters();
  }

  applyCombinedFilters() {
    this.ExcelData = this.tempExcelData.filter((item) => {
      const itemCountry = item.country.toLowerCase();
      const itemJob = item.jobTitle.toLowerCase();
      const itemCompany = item.companyName.toLowerCase();
      const itemIndustry = item.industry.toLowerCase();

      const countryMatch =
        this.selectedCountries.length === 0 ||
        this.selectedCountries.some((country) =>
          itemCountry.includes(country.toLowerCase())
        );

      const jobMatch =
        this.selectedJob.length === 0 ||
        this.selectedJob.some((job) => itemJob.includes(job.toLowerCase()));

      const companyMatch =
        this.selectedCompanies.length === 0 ||
        this.selectedCompanies.some((company) =>
          itemCompany.includes(company.toLowerCase())
        );

      const industryMatch =
        this.selectedIndustries.length === 0 ||
        this.selectedIndustries.some((industry) =>
          itemIndustry.includes(industry.toLowerCase())
        );

      return countryMatch && jobMatch && companyMatch && industryMatch;
    });

    this.totalProduct = this.ExcelData.length;
  }
}
