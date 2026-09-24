import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilityService } from '../utils/utils.service';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(private firestore: AngularFirestore, private utilityService: UtilityService) {

    }



    seStateToCollection(data: string, district: string, school: string, board: string) {
        let stateid = data.replace(/\s/g, '').toLocaleLowerCase();
        let state = {
            'displayName': data,
            'id': stateid,
            'name': stateid
        }
        //    this.firestore.collection('state').doc(stateid).set(state, { merge: true });
        let distname = district.replace(/\s/g, '').toLocaleLowerCase();
        const distid = stateid + "#" + distname;
        //  this.seDistrictToCollection(distname, distid,district, stateid);
        //   this.setSchoolToCollection(school, board, distid, stateid);
        this.setCityToCollection(school, distid, stateid);

    }


    seDistrictToCollection(distname: string, distid: string, districtDname: string, stateid: string) {
        let district = {
            'displayName': districtDname,
            'id': distid,
            'name': distname,
            'stateid': stateid
        }
        this.firestore.collection('district').doc(distid).set(district, { merge: true });
    }

    setCityToCollection(data: string, districtId: string, stateid: string) {
        let citydata = data.replace(/\s/g, '').toLocaleLowerCase();

        if (citydata) {
            const id = this.utilityService.generateAlphaNumericId();
            let city = {
                'displayName': data,
                'id': id,
                'name': citydata,
                'stateid': stateid,
                'districtid': districtId
            }
            console.log('city  ' + citydata);
            this.firestore.collection('cities').doc(id).set(city, { merge: true });
        }

    }

    setSchoolToCollection(data: string, board: string, districtId: string, stateid: string) {
        let scl = data.replace(/\s/g, '').toLocaleLowerCase();

        if (scl) {
            const id = this.utilityService.generateAlphaNumericId();
            let school = {
                'displayName': data,
                'id': id,
                'name': scl,
                'board': board,
                'stateid': stateid,
                'districtid': districtId
            }
            console.log('School  ' + school);
            this.firestore.collection('school').doc(id).set(school, { merge: true });
        }

    }

    updatVideoStatusToCollection(id, status, comment) {
        this.firestore.collection('video_upload')
            .doc(id).update({
                status: status,
                remarks: comment
            })
    }

    approvedAndMarksEven(id, status, marks) {
        this.firestore.collection('user_events')
            .doc(id).update({
                status: status,
                marks: marks
            })
    }

}
