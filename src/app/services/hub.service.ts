import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GenerateKeyService } from '../model/comman/common.generatekey';
import { Hub, HubNotices, HubOffer } from '../model/hub';

@Injectable({
    providedIn: 'root'
})
export class HubService {

    constructor(
        private firestore: AngularFirestore,
        private generateKeyService: GenerateKeyService
    ) { }


    setHubToCollection(hub: Hub) {
        return this.firestore.collection('hubs').doc(hub.id)
            .set(JSON.parse(JSON.stringify(hub)), { merge: true });
    }

    setHubOfferToCollection(hubOffer) {
        return this.firestore.collection('hubOffers').doc(hubOffer.id)
            .set(JSON.parse(JSON.stringify(hubOffer)), { merge: true });
    }

    setHubNoticesToCollection(hubNotices) {
        return this.firestore.collection('hubNotices').doc(hubNotices.id)
            .set(JSON.parse(JSON.stringify(hubNotices)), { merge: true });
    }

    updateHubToCollection(hub) {
        hub.status = 'MODIFIED';
        return this.firestore.collection('hubs').doc(hub.id)
            .update(JSON.parse(JSON.stringify(hub)));
    }

    populateHubDetails(hubDetails) {
        let hub: Hub = new Hub();

        hub.id = this.generateKeyService.generateUniqueFirestoreId();
        hub.displayName = hubDetails.displayName;
        hub.description = hubDetails.description;
        hub.locationText = hubDetails.locationText;
        hub.phoneNumber = hubDetails.phoneNumber;
        hub.whatsappNumber = hubDetails.whatsappNumber;
        hub.website = hubDetails.website;
        hub.imgUrl = hubDetails.imgUrl;
        hub.status = 'CREATED'
        hub.longitude = hubDetails.longitude;
        hub.latitude = hubDetails.latitude;
        hub.keywords = this.generateKeyService.generateKeywordsForHub(hubDetails.displayName);
        hub.workingDays = hubDetails.workingDays;
        hub.dealsIn = hubDetails.dealsIn;
        return hub
    }

    populateHubOffersDetails(hubOfferDetails, hubId) {
        let hubOffer: HubOffer = new HubOffer();

        hubOffer.id = this.generateKeyService.generateUniqueFirestoreId();
        hubOffer.name = hubOfferDetails.offerTitle;
        hubOffer.description = hubOfferDetails.offerDiscription;
        hubOffer.hubId = hubId;

        return hubOffer
    }

    populateHubNoticeDetails(hubDetails, hubId, noticeImgUrl) {
        let hubNotice: HubNotices = new HubNotices();
        hubNotice.description = hubDetails.notice;
        hubNotice.photos = noticeImgUrl;
        hubNotice.hubId = hubId;

        return hubNotice
    }

    updateHubImagesToCollections(hub) {

        return this.firestore.collection('hubs').doc(hub.id)
            .update({
                imgUrl:hub.imageURL
            });
    }

}
