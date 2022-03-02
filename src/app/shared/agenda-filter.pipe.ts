import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'agendafilter', 
    pure: false
}) 
export class agendaFilterPipe implements PipeTransform { 
    transform(items: any[], args: any[]): any { 
        if (!items || !args) {  
            return items; 
        }  
        return items.filter(item => item.nome.indexOf(args[0]) !== -1); 
    } 
} 
