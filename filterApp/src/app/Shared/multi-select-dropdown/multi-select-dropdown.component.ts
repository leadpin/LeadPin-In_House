import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-multi-select-dropdown',
  imports: [CommonModule],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrl: './multi-select-dropdown.component.scss',
})
export class MultiSelectDropdownComponent {
  @Input() options: string[] = [];
  @Input() selectedItems: string[] = [];
  @Output() selectionChanged = new EventEmitter<string[]>();
  @Input() disabled: boolean = false;
  dropdownOpen = false;
  constructor(private _eref: ElementRef) {}
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(option: string): boolean {
    return this.selectedItems.includes(option);
  }

  toggleSelection(option: string) {
    if (this.isSelected(option)) {
      this.selectedItems = this.selectedItems.filter((item) => item !== option);
    } else {
      this.selectedItems.push(option);
    }
    this.selectionChanged.emit(this.selectedItems);
  }
  removeTag(item: string) {
    this.selectedItems = this.selectedItems.filter((i) => i !== item);
    this.selectionChanged.emit(this.selectedItems);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
