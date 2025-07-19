import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-input-selecter',
  imports: [CommonModule],
  templateUrl: './input-selecter.component.html',
  styleUrl: './input-selecter.component.scss',
})
export class InputSelecterComponent {
  @Input() options: string[] = [];
  @Input() selectedItems: string[] = [];
  @Input() placeholder: string = 'Search and select...';
  @Input() disabled: boolean = false;
  @Output() selectionChanged = new EventEmitter<string[]>();

  searchTerm = signal('');
  dropdownOpen = false;

  constructor(private _eref: ElementRef) {}

  toggleDropdown(open: boolean = true) {
    if (!this.disabled) {
      this.dropdownOpen = open;
    }
  }

  isSelected(option: string): boolean {
    return this.selectedItems.includes(option);
  }

  addOrRemove(option: string) {
    if (this.isSelected(option)) {
      this.selectedItems = this.selectedItems.filter((item) => item !== option);
    } else {
      this.selectedItems.push(option);
    }
    this.selectionChanged.emit(this.selectedItems);
  }

  setSearch(value: string) {
    this.searchTerm.set(value);
    this.toggleDropdown(true);
  }

  filteredOptions = computed(() =>
    this.options.filter(
      (opt) =>
        opt.toLowerCase().includes(this.searchTerm().toLowerCase()) &&
        !this.selectedItems.includes(opt)
    )
  );

  clearSelection() {
    this.selectedItems = [];
    this.selectionChanged.emit(this.selectedItems);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
