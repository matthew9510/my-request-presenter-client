import { Pipe, PipeTransform } from '@angular/core';
import {Events} from '../services/event.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Events[], searchText: string) : any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter( event => {
      return event.title.toLowerCase().includes(searchText) || event.venue.toLowerCase().includes(searchText);
    });
  };
}
