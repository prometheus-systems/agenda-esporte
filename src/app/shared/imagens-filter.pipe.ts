import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'imagensfilter', 
    pure: false
}) 
export class imagensFilterPipe implements PipeTransform { 
    transform(items: any[], args?: any[]): any { 
        if (!items || !args) {  
            return items; 
        }  
        return items.filter(item => item.ima_titulo.indexOf(args[0]) !== -1); 
    } 
} 
