import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertMessageComponent } from "../common/component/alert-message/alert-message.component";
import { WarningMessageComponent } from "../common/component/warning-message/warning-message.component";

@NgModule({
  declarations: [
    AlertMessageComponent,
    WarningMessageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  entryComponents: [
    AlertMessageComponent,
    WarningMessageComponent,
  ],
  exports: [
 ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedComponentsModule { }