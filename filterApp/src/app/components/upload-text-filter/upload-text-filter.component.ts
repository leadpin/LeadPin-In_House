import { Component, EventEmitter, Input, Output } from '@angular/core';
import { dataClean } from '../../Modal/excel-functions';

@Component({
  selector: 'app-upload-text-filter',
  imports: [],
  templateUrl: './upload-text-filter.component.html',
  styleUrl: './upload-text-filter.component.scss',
})
export class UploadTextFilterComponent {
  @Input() options: string[] = [];
  @Input() disabled: boolean = false;
  @Output() selectionChanged = new EventEmitter<string[]>();
  @Input() placeholder!: string;
  @Input() imageName!: string;

  onUploadData(event: Event): void {
    const input = (event.target as HTMLTextAreaElement).value;
    this.options = dataClean(input);

    this.selectionChanged.emit(this.options);
  }
}
