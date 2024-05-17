/**
 * Copyright 2020 GRENMap Authors
 *
 * SPDX-License-Identifier: Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 * Includes the material modules used in the application
 */
/* eslint-disable max-len */
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
    imports: [
        MatButtonModule, MatCheckboxModule, MatSelectModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatCardModule, MatListModule, MatDialogModule, MatBottomSheetModule,
        MatInputModule, MatTabsModule, MatTableModule, MatSnackBarModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatExpansionModule, MatProgressSpinnerModule, MatSlideToggleModule, MatStepperModule],
    exports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatCardModule, MatListModule, MatDialogModule, MatBottomSheetModule,
        MatInputModule, MatTabsModule, MatTableModule, MatSnackBarModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatExpansionModule, MatProgressSpinnerModule, MatSlideToggleModule, MatStepperModule]
})
export class MaterialModule { }
