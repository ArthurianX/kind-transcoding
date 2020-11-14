import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthService } from './shared/services/auth-service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormFactoryUiModule } from 'projects/form-factory-ui/src/lib/form-factory-ui.module';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BadUserComponent } from 'projects/kind-transcoding/src/app/components/bad-user/bad-user.component';

@NgModule({
    declarations: [AppComponent, SignInComponent, DashboardComponent, BadUserComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp({
            apiKey: 'AIzaSyARvR-97_PB-O3hkQQWW5qdew99mjOlGGE',
            authDomain: 'kind-transcoder.firebaseapp.com',
            databaseURL: 'https://kind-transcoder.firebaseio.com',
            projectId: 'kind-transcoder',
            storageBucket: 'kind-transcoder.appspot.com',
            messagingSenderId: '29166964249',
            appId: '1:29166964249:web:5b386dc4f5ddda9c74a488',
            measurementId: 'G-5KSMQGXX1G',
        }),
        AngularFireAuthModule,
        AngularFirestoreModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        FormFactoryUiModule,
        MatListModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        MatProgressBarModule,
    ],
    providers: [AuthService],
    bootstrap: [AppComponent],
})
export class AppModule {}
