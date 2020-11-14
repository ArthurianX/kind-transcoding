import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../engine/engine.service';
import TWEEN from '@tweenjs/tween.js';
import { IntroLogoService } from './intr-logo.service';

@Component({
    selector: 'ffui-intro-logo',
    templateUrl: './intro-logo.component.html',
    styleUrls: ['./intro-logo.component.scss'],
})
export class IntroLogoComponent implements OnInit {
    @ViewChild('rendererCanvas', { static: true })
    public rendererCanvas: ElementRef<HTMLCanvasElement>;

    public constructor(private introLogoService: IntroLogoService) {}

    public ngOnInit(): void {
        this.introLogoService.createScene(this.rendererCanvas);
        this.introLogoService.animate(this.rendererCanvas);
        console.log('Tween is', TWEEN);
        console.log(
            '%c👋 AUSTINMAYER.CO',
            'margin: 10px 10px 10px 0; padding: 10px 10px 10px 0; font-family: Andale Mono,AndaleMono,monospace; font-size:24px;color: #0000ff; text-shadow: 3px 3px 0 #00ffff',
        );
        console.log('🤘 react \n🔥 three.js \n🤯 react-spring \n💅 styled-components');
    }
}
