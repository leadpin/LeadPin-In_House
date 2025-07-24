import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { IExcelData } from '../../Modal/excel-interface';
import { CommonModule } from '@angular/common';
import {
  convertFieldNames,
  dataClean,
  getCities,
  getComapanyDomains,
  getCompanies,
  getCountries,
  getEmpSizes,
  getIndustries,
  getJobTitles,
  getStates,
  getZipCodes,
  mapFieldNames,
  mapToProspect,
  removeDuplicateEmptyEmailsData,
} from '../../Modal/excel-functions';
import {
  DEPARTMENTS,
  ITEMS_PER_PAGE,
  MANAGEMENT_LEVELS,
} from '../../Modal/excel-constants';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputSelecterComponent } from '../../Shared/input-selecter/input-selecter.component';
import { ExcelTableComponent } from '../excel-table/excel-table.component';
import { UploadTextFilterComponent } from '../upload-text-filter/upload-text-filter.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    NgxPaginationModule,
    InputSelecterComponent,
    ExcelTableComponent,
    UploadTextFilterComponent,
  ],
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
  itemsPerPageList = ITEMS_PER_PAGE;
  totalProduct: any;
  countryList: any = [];
  selectedCountries: string[] = [];
  jobTitles: any = [];
  selectedJobTitle: string[] = [];
  companyNames: any = [];
  selectedCompanies: string[] = [];
  industryNames: any = [];
  selectedIndustries: string[] = [];
  cityNames: any = [];
  selectedCities: string[] = [];
  stateNames: any = [];
  selectedStates: string[] = [];
  zipCodes: any = [];
  selectedZipCodes: string[] = [];
  managementLevels = MANAGEMENT_LEVELS;
  selectedManagementLevel: string[] = [];
  empSizes: any[] = [];
  selectedEmpSize: string[] = [];
  companyDomainList: any[] = [];
  selectedDomain: string[] = [];
  departments = DEPARTMENTS;
  selectetdDepartments: string[] = [];

  companyUploadList: string[] = [];
  domainUploadList: string[] = [];

  isFileUploaded = false;
  constructor() {}

  //Read Data from Excel File.
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
      this.ExcelData = removeDuplicateEmptyEmailsData(this.ExcelData);

      this.totalProduct = this.ExcelData.length;
      this.tempExcelData = this.ExcelData;
      this.isFileUploaded = true;
      this.tableFields = convertFieldNames(this.ExcelData);
      this.countryList = getCountries(this.ExcelData);
      this.jobTitles = getJobTitles(this.ExcelData);
      this.companyNames = getCompanies(this.ExcelData);
      this.industryNames = getIndustries(this.ExcelData);
      this.stateNames = getStates(this.ExcelData);
      this.cityNames = getCities(this.ExcelData);
      this.zipCodes = getZipCodes(this.ExcelData);
      this.empSizes = getEmpSizes(this.ExcelData);
      this.companyDomainList = getComapanyDomains(this.ExcelData);
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

  onSelectedJobTitle(selectedVal: string[]) {
    this.selectedJobTitle = [...selectedVal];
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

  onSelectedState(selectedVal: string[]) {
    this.selectedStates = [...selectedVal];
    this.applyCombinedFilters();
  }

  onSelectedCity(selectedVal: string[]) {
    this.selectedCities = [...selectedVal];
    this.applyCombinedFilters();
  }

  onSelectedZipCode(selectedVal: any[]) {
    this.selectedZipCodes = [...selectedVal];
    this.applyCombinedFilters();
  }

  onSelectedManagementLevel(selectedVal: any[]) {
    this.selectedManagementLevel = [...selectedVal];
    this.applyCombinedFilters();
  }

  onSelectedEmpSize(selectedVal: any[]) {
    this.selectedEmpSize = [...selectedVal];
    this.applyCombinedFilters();
  }

  // onSelectedDomain(selectedVal: any[]) {
  //   this.selectedDomain = [...selectedVal];
  //   this.applyCombinedFilters();
  // }

  onSelectedDepartments(selectedVal: any[]) {
    this.selectetdDepartments = [...selectedVal];
    this.applyCombinedFilters();
  }

  onCompanyUpload(val: any): void {
    this.companyUploadList = val.map((data: any) => data.toLowerCase());
    this.applyCombinedFilters();
  }

  onDomainUpload(val: any): void {
    this.domainUploadList = val.map((data: any) => data.toLowerCase());
    this.applyCombinedFilters();
  }

  applyCombinedFilters() {
    this.ExcelData = this.tempExcelData.filter((item) => {
      const itemCountry = item.country.toLowerCase();
      const itemJobTilte = item.jobTitle.toLowerCase();
      const itemCompany = item.companyName.toLowerCase();
      const itemIndustry = item.industry.toLowerCase();
      const itemState = item.state.toLowerCase();
      const itemCity = item.city.toLowerCase();
      const itemZipCode = item.zipCode;
      const itemEmpSize = item.employeeSize;
      const itemEmail = item.email.split('@')[1].toLowerCase();
      const CleanCompanyNamesData = dataClean(itemCompany);

      const countryMatch =
        this.selectedCountries.length === 0 ||
        this.selectedCountries.some((country) =>
          itemCountry.includes(country.toLowerCase())
        );

      const jobMatch =
        this.selectedJobTitle.length === 0 ||
        this.selectedJobTitle.some((job) =>
          itemJobTilte.includes(job.toLowerCase())
        );

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

      const cityMatch =
        this.selectedCities.length === 0 ||
        this.selectedCities.some((city) =>
          itemCity.includes(city.toLowerCase())
        );

      const stateMatch =
        this.selectedStates.length === 0 ||
        this.selectedStates.some((state) =>
          itemState.includes(state.toLowerCase())
        );

      const zipCodeMatch =
        this.selectedZipCodes.length === 0 ||
        this.selectedZipCodes.some((zipCode) => itemZipCode.includes(zipCode));

      const levelMatch =
        this.selectedManagementLevel.length === 0 ||
        this.selectedManagementLevel.some((level) =>
          itemJobTilte
            .split(/[\s,-]+/)
            .map((word) => word.toLowerCase())
            .includes(level.toLowerCase())
        );

      const empSizeMatch =
        this.selectedEmpSize.length === 0 ||
        this.selectedEmpSize.some((empSize) => itemEmpSize.includes(empSize));

      // const domainMatch =
      //   this.selectedDomain.length === 0 ||
      //   this.selectedDomain.some((domain) =>
      //     itemEmail.includes(domain.toLowerCase())
      //   );

      const uploadDomainMatch =
        this.domainUploadList.length === 0 ||
        this.domainUploadList.some((domain) =>
          itemEmail.includes(domain.toLowerCase())
        );

      const departmentMatch =
        this.selectetdDepartments.length === 0 ||
        this.selectetdDepartments.some((dept) => itemJobTilte.includes(dept));

      const uploadCompanyMatch =
        this.companyUploadList.length === 0 ||
        this.companyUploadList.some((company) =>
          CleanCompanyNamesData.includes(company)
        );

      return (
        countryMatch &&
        jobMatch &&
        companyMatch &&
        industryMatch &&
        cityMatch &&
        stateMatch &&
        zipCodeMatch &&
        levelMatch &&
        empSizeMatch &&
        departmentMatch &&
        uploadDomainMatch &&
        uploadCompanyMatch
      );
    });

    this.totalProduct = this.ExcelData.length;
  }
}
