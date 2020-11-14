import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import TWEEN from '@tweenjs/tween.js';

@Component({
    selector: 'app-engine',
    templateUrl: './engine.component.html',
})
export class EngineComponent implements OnInit {
    @ViewChild('rendererCanvas', { static: true })
    public rendererCanvas: ElementRef<HTMLCanvasElement>;

    public constructor(private engServ: EngineService) {}

    public ngOnInit(): void {
        this.engServ.createScene(this.rendererCanvas);
        this.engServ.animate();
        console.log('Tween is', TWEEN);
    }
}
