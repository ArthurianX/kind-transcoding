import { Component } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { $v } from 'codelyzer/angular/styles/chars';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
})
export class AppComponent {
    title = 'kind-transcoding';

    currentRoute: string;
    currentActivatedComponent: any;

    constructor(private router: Router) {
        router.events.subscribe((event) => {
            if (event instanceof RouterEvent) {
                this.currentRoute = event.url;
            }
        });
    }
    public routerActivates($event: any): void {
        this.currentActivatedComponent = $event;
    }
}
