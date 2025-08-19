import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { dataClean } from '../../Modal/excel-functions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-text-filter',
  imports: [CommonModule],
  templateUrl: './upload-text-filter.component.html',
  styleUrl: './upload-text-filter.component.scss',
})
export class UploadTextFilterComponent {
  @Input() options: string[] = [];
  @Input() disabled: boolean = false;
  @Output() selectionChanged = new EventEmitter<string[]>();
  @Input() placeholder!: string;
  @Input() imageName!: string;
  @ViewChild('textAreaName') myTextareaRef!: ElementRef<HTMLTextAreaElement>;

  onUploadData(event: Event): void {
    const input = (event.target as HTMLTextAreaElement).value;
    this.options = dataClean(input);

    this.selectionChanged.emit(this.options);
  }

  clearData() {
    if (this.myTextareaRef) {
      this.myTextareaRef.nativeElement.value = '';
    }
    this.options = [];
    this.selectionChanged.emit(this.options);
  }
}
