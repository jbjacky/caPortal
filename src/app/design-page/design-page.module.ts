import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPageComponent } from './edit-page/edit-page.component';
import { DesignPageRoutingModule } from './design-page-routing.module';
import { DesignPageComponent } from './design-page.component';
import { FromSignComponent } from '../View/shareComponent/from-sign/from-sign.component';
import { SelectSignerComponent } from '../View/select-signer/select-signer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { FileDownloadService } from '../Service/file-download.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SharemodelModule } from '../Sharemodel/sharemodel.module';

@NgModule({
  imports: [
    CommonModule,
    DesignPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxSelectModule,
    // LZStringModule,
    // NgxSpinnerModule,
    HttpClientModule,
    SharemodelModule
  ],
  declarations: [
    DesignPageComponent,
    EditPageComponent,
    // FromSignComponent,
    // SelectSignerComponent,
  ],
  providers: [
    // LZStringService,
    // FileDownloadService
  ],
})
export class DesignPageModule { }
