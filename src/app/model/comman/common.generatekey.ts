import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GenerateKeyService {

  constructor() { }

  generateUniqueFirestoreId() {
    // Alphanumeric characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
  }

  createKeywords = (name) => {
    const arrName = [];
    let curname = '';
    name.split("").forEach((letter) => {
      curname += letter.toLowerCase();
      arrName.push(curname);
    });
    return arrName;
  }

  generateKeywordsForHub = (name) => {
    let namekeys = this.createKeywords(name.toLowerCase() + "");
    let keywords = [];
    keywords.push("");
    keywords.push(...namekeys);
    return keywords;
  }


  generateApplicationId() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let autoId = '';
    for (let i = 0; i < 6; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
  }

}
