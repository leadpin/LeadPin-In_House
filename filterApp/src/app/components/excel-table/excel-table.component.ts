import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { IExcelData } from '../../Modal/excel-interface';

@Component({
  selector: 'app-excel-table',
  imports: [NgxPaginationModule, CommonModule],
  templateUrl: './excel-table.component.html',
  styleUrl: './excel-table.component.scss',
})
export class ExcelTableComponent {
  @Input() tableFields!: string[];
  @Input() ExcelData!: IExcelData[];
  @Input() pageNumber!: number;
  @Input() itemsPerPage!: number;
}
