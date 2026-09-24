import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Options } from '../model/questions';
import { ClassesService } from '../services/classes.service';
import { HubService } from '../services/hub.service';
import { ModuleService } from '../services/module.service';
import { SubjectService } from '../services/subject.service';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor(private storage: AngularFireStorage,
        public classesService: ClassesService,
        public subjectService: SubjectService,
        public moduleService: ModuleService,
        public hubService:HubService) {
    }

    generateAlphaNumericId() {
        let result = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return result;
    }

    //Name must be lower case and no spaces between or end
    refactorName(name: string) {
        let result = String(name).replace(/[\s]/g, '').toLowerCase().trim()
        console.log(result)
        return result
    }
    generateOptionSequence(numberOfOptions: number, type: string) {
        let options: Options[] = [];
        for (let i = 0; i < numberOfOptions; i++) {
            let sequence = String.fromCharCode('A'.charCodeAt(0) + i);
            let opt: Options = new Options();
            opt.id = this.generateAlphaNumericId();
            opt.sequence = sequence;
            opt.text = '';
            opt.type = type;
            opt.url = '';
            options.push(opt);
        }
        return options;

    }

    uploadImage(imageFiles: any, educationObject: any, educationType: string) {

        var cacheMetaData = {
            cacheControl: 'public,max-age=40000',
        }

        let imagePath: string;
        if (educationType == 'CLASSES') {
            imagePath = 'strkwiz/classes/images/' + educationObject.id
        } else if (educationType == 'SUBJECT') {
            imagePath = 'strkwiz/subject/images/' + educationObject.id
        } else if (educationType == 'MODULE') {
            imagePath = 'strkwiz/module/images/' + educationObject.id
        } else if (educationType == 'HUB') {
            imagePath = 'strkwiz/hub/images/' + educationObject.id
        }

        let ref = this.storage.ref(imagePath);
        ref.put(imageFiles, cacheMetaData).then(data => {
            ref.getDownloadURL().subscribe(iurl => {
                educationObject.imageURL = iurl;

                if (educationType == 'CLASSES') {
                    this.classesService.setClassToCollection(
                        this.classesService.populateClassToCollection(educationObject))
                } else if (educationType == 'SUBJECT') {
                    this.subjectService.setSubjectToCollection(
                        this.subjectService.populateSubjectToCollection(educationObject))
                } else if (educationType == 'MODULE') {
                    this.moduleService.setModuleToCollection(
                        this.moduleService.populateModuleToCollection(educationObject))
                } else if (educationType == 'HUB') {
                  this.hubService.updateHubImagesToCollections(educationObject);
                }
            });
        });
    }
}