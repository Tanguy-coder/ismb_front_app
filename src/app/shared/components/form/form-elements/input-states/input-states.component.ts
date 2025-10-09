import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { InputFieldComponent } from '../../input/input-field.component';
import { LabelComponent } from '../../label/label.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-states',
  imports: [
    CommonModule,
    ComponentCardComponent,
    InputFieldComponent,
    LabelComponent,
    FormsModule,
  ],
  templateUrl: './input-states.component.html',
  styles: ``
})
export class InputStatesComponent {

  email = '';
  emailTwo = 'hello.pimjo@gmail.com';
  error = false;

  validateEmail(value: string): boolean {
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    this.error = !isValidEmail;
    return isValidEmail;
  }
}