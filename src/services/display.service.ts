/**
 * Copyright 2021 GRENMap Authors
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
 * This service handles display changes such as showing popups,
 * changing the contents of the side drawer and showing loading spinners
 * for the whole map
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export type DrawerType = 'NodeInfo' | 'LinkInfo' | 'RensInfo' | 'Loading' | null;

@Injectable()
export class DisplayService {

    /** Indicates the type of content to be shown on the side drawer */
    openDrawerType = new BehaviorSubject<DrawerType>(null);
    /** Updates to indicate wether the map is currently updating or not */
    loadingMap = new BehaviorSubject(false);

    constructor(private _snackBar: MatSnackBar){}

    /** Opens the drawer that shows all of the nodes and their details */
    displayNodeInfoDrawer() { this.openDrawerType.next('NodeInfo'); }

    /** Opens the drawer that shows all of the links and their details */
    displayLinkInfoDrawer() { this.openDrawerType.next('LinkInfo'); }

    /** Opens the drawer that shows all of the rens and their details */
    displayRensInfoDrawer() { this.openDrawerType.next('RensInfo'); }

    /** Opens the drawer that shows data is loading for the sideview */
    displayLoadingDrawer() { this.openDrawerType.next('Loading'); }

    /** Hides the side drawer */
    hideDrawer() { this.openDrawerType.next(null); }

    /** Shows a spinner on the map indicating it's loading data */
    displayLoadingMap() { this.loadingMap.next(true); }

    /** Hides the spinner on the map that indicated it was loading data */
    hideLoadingMap() { this.loadingMap.next(false); }

    /** Shows an error message on the page in a dismissable snackbar */
    showError(error: string) { this._snackBar.open(error, $localize`Dismiss`); }
}
