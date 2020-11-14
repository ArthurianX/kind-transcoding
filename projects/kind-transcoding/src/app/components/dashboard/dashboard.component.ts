import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AWS from 'aws-sdk';
import { BackendService } from 'projects/kind-transcoding/src/app/shared/services/backend.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    directDownloadLink = '';
    @ViewChild('stepper') private myStepper: MatStepper;
    private s3Payload: { S3BucketName: string; contentType: any; key: any };
    private fileName: string;
    private htmlFileForUpload: any;
    private bucketListenerInterval: any;

    constructor(private _formBuilder: FormBuilder, private backend: BackendService) {}

    ngOnInit(): void {
        console.log(AWS);
        this.firstFormGroup = this._formBuilder.group({
            fileCtrl: [{ value: '', disabled: true }, Validators.required],
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required],
        });

    }

    onFileSelected($event: Event): void {
        // @ts-ignore
        this.firstFormGroup.patchValue({ fileCtrl: $event.srcElement.files[0].name });
        // @ts-ignore
        this.prepareUploadPayload($event.srcElement.files[0]);
    }

    startFileUpload(): void {
        // Reset payload after successful upload
        // Reset htmlFileForUpload after successful upload

        const upload = (url, file) => {
            fetch(url, {
                method: 'PUT',
                // headers: {},
                body: file,
            })
                .then(
                    (success) => {
                        console.log(success);
                        this.htmlFileForUpload = undefined;
                        this.s3Payload = { S3BucketName: '', contentType: '', key: '' };
                        this.firstFormGroup.patchValue({ fileCtrl: '' });

                        this.listenToOutputBucket();
                    }, // Handle the success response object
                )
                .catch(
                    (error) => {
                        console.log(error);
                        this.htmlFileForUpload = undefined;
                        this.s3Payload = { S3BucketName: '', contentType: '', key: '' };
                        this.resetStepper()
                    }, // Handle the error response object
                );
        };

        this.backend.getS3PreSignedUrl(this.s3Payload).then((preSignedUrl) => {
            upload(preSignedUrl, this.htmlFileForUpload);
        });
    }

    resetStepper(): void {
        this.myStepper.reset();
        this.firstFormGroup.patchValue({ fileCtrl: '' });
        this.fileName = undefined;
    }

    private prepareUploadPayload(file: any): void {
        this.s3Payload = {
            S3BucketName: 'kind-media-transcoding-input',
            key: this.uniqueFileName(file.name),
            contentType: file.type,
        };
        this.htmlFileForUpload = file;
    }

    private uniqueFileName(name): string {
        // TODO Make a more unique file name here
        this.fileName = name;
        return name;
    }

    private listenToOutputBucket(): void {
        console.log('File Uploaded, listen to output bucket');

        const checkFilePresence = () => {
            this.backend.confirmBucketPresence({
                bucket: 'kind-media-transcoding-output',
                fileName: this.fileName
            }).then((exists) => {
                if (!exists) {return false;}
                if (this.bucketListenerInterval) {
                    clearInterval(this.bucketListenerInterval);
                }

                this.myStepper.next();
                this.downloadTranscodedFile();
            }, (error) => {
                console.log('error', error);
            })
        }

        this.bucketListenerInterval = setInterval(() => {
            checkFilePresence();
        }, 20000);

        checkFilePresence();
    }

    private downloadTranscodedFile() {
        // Reset fileName after this is done
        this.backend.getS3PreSignedUrlDownload({ S3BucketName: 'kind-media-transcoding-output', key: this.fileName })
        .then((url) => {
            this.directDownloadLink = url;
            window.location.replace(url);
        })
    }

}
