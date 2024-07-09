import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/url-gen';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { crop } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';

@Injectable({
    providedIn: 'root',
})
export class CloudinaryService {
    private cloudinarySettings = {
        cloudName: 'dypm7mweh',
        uploadPreset: 'dercosa',
    };

    private cld = new Cloudinary({
        cloud: {
            cloudName: this.cloudinarySettings.cloudName,
        },
        url: {
            secure: true,
        },
    });

    constructor(private http: HttpClient) {}

    uploadFile(
        file: File,
        progress$?: BehaviorSubject<number>
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const formData: FormData = new FormData();
            formData.append(
                'upload_preset',
                this.cloudinarySettings.uploadPreset
            );
            formData.append('tags', 'browser_upload');
            formData.append('file', file);
            this.http
                .post(
                    `https://api.cloudinary.com/v1_1/${this.cloudinarySettings.cloudName}/upload`,
                    formData,
                    {
                        reportProgress: !!progress$,
                        observe: 'events',
                    }
                )
                .subscribe({
                    next: (event: any) => {
                        if (event.type === HttpEventType.UploadProgress) {
                            const percentDone = Math.round(
                                (100 * event.loaded) / event.total
                            );
                            console.log('Progress ' + percentDone + '%');
                            if (progress$) {
                                progress$.next(percentDone);
                            }
                        }
                        if (event.type === HttpEventType.Response) {
                            console.log(event);
                            resolve(event.body.public_id);
                        }
                    },
                    error: (error) => reject(new Error(error)),
                });
        });
    }

    createBackgroundImage(publicId: string) {
        return this.cld
            .image(publicId)
            .resize(
                crop()
                    .width(150)
                    .height(150)
                    .gravity(focusOn(FocusOn.faces()))
                    .regionRelative()
            )
            .roundCorners(byRadius(20))
            .toURL();
    }
}
