import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    constructor(
        public afs: AngularFirestore, // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public afFunc: AngularFireFunctions, // Inject Firebase functions
        public router: Router,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
    ) {}

    public getData(collection, document?): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afAuth.authState.subscribe((user) => {
                if (user) {
                    this.afs
                        .collection(collection)
                        .valueChanges()
                        // .get()
                        // .pipe(map((doc) => Object.keys(doc).map((x) => doc[x])))
                        .subscribe(
                            (res) => {
                                resolve(res);
                            },
                            (err) => {
                                reject(err);
                            },
                        );
                }
            });
        });
    }

    public setData(data, collection, document?): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afAuth.authState.subscribe((user) => {
                if (user) {
                    Object.assign(data, {
                        created_by_email: user.email,
                        created_by_name: user.displayName,
                        created_by_photo: user.photoURL,
                    });
                    if (document) {
                        const colRef: AngularFirestoreDocument<any> = this.afs.doc(`${collection}/${document}`);
                        colRef.set(data).then(
                            (res) => {
                                resolve(res);
                            },
                            (rej) => {
                                reject(rej);
                            },
                        );
                    } else {
                        this.afs
                            .collection(`/${collection}`)
                            .add(data)
                            .then(
                                (res) => {
                                    resolve(res);
                                },
                                (err) => {
                                    reject(err);
                                },
                            );
                    }
                }
            });
        });
    }

    public getS3PreSignedUrl(data): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afAuth.authState.subscribe((user) => {
                if (user) {
                    console.log('this.afFunc', this.afFunc);
                    const getUrl = this.afFunc.httpsCallable('getS3SignedUrlUpload');
                    getUrl(data).subscribe(
                        (url) => {
                            resolve(url);
                        },
                        (error) => {
                            reject(false);
                        },
                    );
                }
            });
        });
    }
}
