import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProduct'
})
export class FilterProductPipe implements PipeTransform {

  transform(products: any[], search: string): any {
    const resultSearchProd = [];
    if(products){
      for(const product of products){
        if(product.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 || product.code.toLowerCase().indexOf(search.toLowerCase()) !== -1){
          resultSearchProd.push(product);
        }
      }
      return resultSearchProd;
    }
  }

}
