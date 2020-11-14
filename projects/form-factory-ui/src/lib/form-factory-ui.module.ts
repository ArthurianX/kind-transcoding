import { NgModule } from '@angular/core';
import { LogoComponent } from './logo/logo.component';
import { EngineComponent } from './engine/engine.component';
import { UiComponent } from './ui/ui.component';
import { UiInfobarBottomComponent } from './ui/ui-infobar-bottom/ui-infobar-bottom.component';
import { UiInfobarTopComponent } from './ui/ui-infobar-top/ui-infobar-top.component';
import { UiSidebarLeftComponent } from './ui/ui-sidebar-left/ui-sidebar-left.component';
import { UiSidebarRightComponent } from './ui/ui-sidebar-right/ui-sidebar-right.component';
import { IntroLogoComponent } from './intro-logo/intro-logo.component';
import { LogoSimpleComponent } from 'projects/form-factory-ui/src/lib/logo-simple/logo.component';

@NgModule({
    declarations: [
        LogoComponent,
        LogoSimpleComponent,
        EngineComponent,
        UiComponent,
        UiInfobarBottomComponent,
        UiInfobarTopComponent,
        UiSidebarLeftComponent,
        UiSidebarRightComponent,
        IntroLogoComponent,
    ],
    imports: [],
    exports: [LogoComponent, LogoSimpleComponent, IntroLogoComponent],
})
export class FormFactoryUiModule {}
