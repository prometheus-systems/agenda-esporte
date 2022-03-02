import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from "../../environments/environment"; 

@Injectable({
  providedIn: 'root'
})

export class UploadService {
  FOLDER = 'SGM';

  constructor() { }

  
  uploadFile(file) {
    const contentType = file.type;
    const bucket = new S3(
          {
              accessKeyId: 'AKIATLRBRY5EUJRGADFA',
              secretAccessKey: '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',
              region: 'sa-east-1'
          }
      );
      const params = {
          Bucket: 'jsa-angular-sgm',
          Key: this.FOLDER + file.name,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      bucket.upload(params, function (err, data) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
      });

}
}
