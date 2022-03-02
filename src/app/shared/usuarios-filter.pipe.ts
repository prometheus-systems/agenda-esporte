import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'usuariosfilter', 
    pure: false
}) 
export class usuariosFilterPipe implements PipeTransform { 
    transform(items: any[], args: any[]): any { 
        if (!items || !args) {  
            return items; 
        }  
        return items.filter(item => item.nome.indexOf(args[0]) !== -1); 
    } 
} 
