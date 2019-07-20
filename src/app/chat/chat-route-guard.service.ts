import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { CanActivate } from '@angular/router/src/utils/preactivation';

@Injectable({
  providedIn: 'root'
})
export class ChatRouteGuardService implements CanActivate{
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

    
 constructor(private router:Router){}
 canActivate(route:ActivatedRouteSnapshot):boolean {
     console.log("in guard servise")
     if(Cookie.get('authToken')===undefined || Cookie.get('authToken')==="" || Cookie.get('authToken')===null) {
        this.router.navigate(['/login']);
       
        return false;
        
      }
      else  {
  
        return true;
      }
 }
}
