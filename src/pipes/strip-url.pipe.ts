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
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Takes a url like "https://www.mydomain.com/something/" and strips it to
 * "www.mydomain.com/something".
 */
@Pipe({ name: 'stripURL' })
export class StripURLPipe implements PipeTransform {
  transform(url: string): string {
    try {
        const leadingRE = /^https?:\/\//i;
        let strippedURL = url.replace(leadingRE, '');
        const trailingRE = /\/$/i;
        strippedURL = strippedURL.replace(trailingRE, '');
        return strippedURL;
      } catch (error) {
        return url;
      }
  }
}
