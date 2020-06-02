import { Pipe, PipeTransform } from "@angular/core";
import { Events } from "../services/event.service";

@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {
  transform(items, searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((event) => {
      if (event.title) {
        return event.title.toLowerCase().includes(searchText);
      }
      // || venue.name.toLowerCase().includes(searchText)
    });
  }
}
