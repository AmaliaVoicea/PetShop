import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeRemoveWhitespaces'
})
export class PipeRemoveWhitespacesPipe implements PipeTransform {

  transform(value: any) {
    if (!value) {
      return '';
    }

    return value.replace(/\s*/g, "");
  }

}
